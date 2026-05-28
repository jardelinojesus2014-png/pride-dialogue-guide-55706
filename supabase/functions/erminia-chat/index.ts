// Erminia AI chat — Lovable AI Gateway (Gemini)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const getBearerToken = (req: Request) => {
  const auth = req.headers.get("authorization") || "";
  return auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";
};

const readUserFromToken = async (supabaseUrl: string, token: string) => {
  if (!token || token.split(".").length !== 3) return null;
  const resp = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: token },
  });
  if (!resp.ok) return null;
  return await resp.json().catch(() => null);
};

const saveConversation = async ({
  supabaseUrl,
  serviceKey,
  user,
  conversation,
  messages,
}: {
  supabaseUrl: string;
  serviceKey: string;
  user: any;
  conversation: any;
  messages: Array<{ role: string; content: string }>;
}) => {
  if (!user?.id || !conversation?.sessionId || !Array.isArray(messages)) return;

  const email = String(user.email || conversation.email || "").toLowerCase() || null;
  const participantName =
    conversation.name ||
    user.user_metadata?.full_name ||
    (email ? email.split("@")[0] : null);

  const resp = await fetch(`${supabaseUrl}/rest/v1/erminia_conversations?on_conflict=session_id`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({
      session_id: String(conversation.sessionId),
      user_id: user.id,
      email,
      participant_name: participantName,
      messages,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!resp.ok) {
    console.error("erminia conversation save failed", resp.status, await resp.text());
  }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { system, messages, conversation } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!LOVABLE_API_KEY) {
      return jsonResponse({ error: "LOVABLE_API_KEY not configured" }, 500);
    }

    if (!Array.isArray(messages)) {
      return jsonResponse({ error: "messages must be an array" }, 400);
    }

    const authUser = SUPABASE_URL
      ? await readUserFromToken(SUPABASE_URL, getBearerToken(req))
      : null;

    const payloadMessages = [
      ...(system ? [{ role: "system", content: String(system) }] : []),
      ...messages.slice(-20).map((m: any) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: String(m.content ?? ""),
      })),
    ];

    const resp = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: payloadMessages,
        }),
      },
    );

    if (!resp.ok) {
      if (resp.status === 429) {
        return jsonResponse({ error: "Limite de requisições atingido, tente novamente em alguns instantes." }, 429);
      }
      if (resp.status === 402) {
        return jsonResponse({ error: "Créditos de IA esgotados. Adicione créditos no workspace Lovable." }, 402);
      }
      const t = await resp.text();
      console.error("AI gateway error", resp.status, t);
      return jsonResponse({ error: "Erro no gateway de IA" }, 500);
    }

    const data = await resp.json();
    const text = data?.choices?.[0]?.message?.content ?? "";

    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY && authUser?.id && conversation?.sessionId) {
      await saveConversation({
        supabaseUrl: SUPABASE_URL,
        serviceKey: SUPABASE_SERVICE_ROLE_KEY,
        user: authUser,
        conversation,
        messages: [
          ...messages.map((m: any) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: String(m.content ?? ""),
          })),
          { role: "assistant", content: String(text) },
        ],
      });
    }

    return jsonResponse({ text, saved: Boolean(authUser?.id && conversation?.sessionId) });
  } catch (e) {
    console.error("erminia-chat error", e);
    return jsonResponse({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
