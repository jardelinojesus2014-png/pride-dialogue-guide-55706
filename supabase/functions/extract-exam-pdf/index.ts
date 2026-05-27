// Extract questions from an exam PDF using Lovable AI (Gemini)
import { extractText, getDocumentProxy } from "https://esm.sh/unpdf@0.12.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function base64ToUint8(b64: string): Uint8Array {
  const clean = b64.replace(/^data:[^;]+;base64,/, "");
  const bin = atob(clean);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { pdfBase64 } = await req.json();
    if (!pdfBase64) {
      return new Response(JSON.stringify({ error: "pdfBase64 obrigatório" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY não configurada" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const bytes = base64ToUint8(pdfBase64);
    if (bytes.byteLength > 15 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "PDF maior que 15MB" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pdf = await getDocumentProxy(bytes);
    const { text } = await extractText(pdf, { mergePages: true });
    const limited = String(text || "").slice(0, 60000);
    if (!limited.trim()) {
      return new Response(JSON.stringify({ error: "Não foi possível extrair texto do PDF (talvez seja escaneado)." }), {
        status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const system = `Você é um conversor de provas em PDF para JSON estruturado.
Extraia TODAS as questões de múltipla escolha do texto.
Cada questão precisa ter: enunciado, 4 alternativas (A,B,C,D) e a alternativa correta.
Se houver explicação/gabarito comentado, coloque em "feedback". Caso contrário, deixe "feedback" vazio.
Use "tag" para categoria/módulo da questão (ou "Geral" se não houver).
RESPONDA APENAS com JSON válido no formato:
{"questions":[{"tag":"...","text":"...","opts":["A","B","C","D"],"correct":0,"feedback":"..."}]}
Onde "correct" é o índice 0-3 da alternativa correta. SEMPRE 4 opções. Sem markdown, sem comentários, sem texto antes/depois.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: system },
          { role: "user", content: "Texto da prova:\n\n" + limited },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) {
      const errTxt = await resp.text();
      return new Response(JSON.stringify({ error: "Falha na IA: " + errTxt }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const raw = data?.choices?.[0]?.message?.content || "{}";
    let parsed: any = {};
    try { parsed = JSON.parse(raw); } catch {
      const m = raw.match(/\{[\s\S]*\}/);
      if (m) { try { parsed = JSON.parse(m[0]); } catch {} }
    }
    const qs = Array.isArray(parsed.questions) ? parsed.questions : [];
    const cleaned = qs
      .filter((q: any) => q && q.text && Array.isArray(q.opts) && q.opts.length === 4)
      .map((q: any) => ({
        tag: String(q.tag || "Geral").slice(0, 40),
        text: String(q.text).trim(),
        opts: q.opts.map((o: any) => String(o).trim()),
        correct: Math.max(0, Math.min(3, parseInt(q.correct) || 0)),
        feedback: String(q.feedback || "").trim(),
      }));

    return new Response(JSON.stringify({ questions: cleaned }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message || e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
