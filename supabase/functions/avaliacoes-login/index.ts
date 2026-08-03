import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !serviceKey || !anonKey) {
      return json({ error: "Server configuration error" }, 500);
    }

    const body = await req.json().catch(() => ({}));
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");
    const token = String(body?.accessToken || "");

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    let userId: string | null = null;
    let userEmail: string | null = null;
    let userMeta: Record<string, unknown> = {};

    if (token) {
      // Reuse an existing app session (iframe inside the main app)
      const { data, error } = await admin.auth.getUser(token);
      if (error || !data?.user) return json({ error: "Sessão inválida." }, 401);
      userId = data.user.id;
      userEmail = (data.user.email || "").toLowerCase();
      userMeta = (data.user.user_metadata || {}) as Record<string, unknown>;
    } else {
      if (!email || !password) return json({ error: "Informe e-mail e senha." }, 400);
      // Validate the exact same credentials used in the main app
      const publicClient = createClient(supabaseUrl, anonKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { data, error } = await publicClient.auth.signInWithPassword({ email, password });
      if (error || !data?.user) return json({ error: "E-mail ou senha incorretos." }, 401);
      userId = data.user.id;
      userEmail = (data.user.email || "").toLowerCase();
      userMeta = (data.user.user_metadata || {}) as Record<string, unknown>;
      await publicClient.auth.signOut().catch(() => {});
    }

    const { data: role } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    return json({
      ok: true,
      userId,
      email: userEmail,
      name: (userMeta?.full_name as string) || (userMeta?.name as string) || "",
      isAdmin: !!role,
    });
  } catch (e) {
    return json({ error: (e as Error).message || "Erro inesperado" }, 500);
  }
});
