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

const getTokenIat = (token: string) => {
  try {
    const [, payload] = token.split(".");
    if (!payload) return 0;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const decoded = JSON.parse(atob(normalized));
    return typeof decoded.iat === "number" ? decoded.iat : 0;
  } catch {
    return 0;
  }
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return json({ error: "Server configuration error" }, 500);
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "No authorization header" }, 401);
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !authData.user) {
      return json({ error: authError?.message || "Invalid token" }, 401);
    }

    const body = await req.json().catch(() => ({}));
    const action = body.action === "force" ? "force" : "check";

    if (action === "check") {
      const { data: freshUser, error: freshUserError } = await supabaseAdmin.auth.admin.getUserById(authData.user.id);
      if (freshUserError || !freshUser.user) {
        return json({ error: freshUserError?.message || "User not found" }, 401);
      }

      const forcedAt = freshUser.user.app_metadata?.force_logout_at;
      const forcedAtSeconds = forcedAt ? Math.floor(new Date(String(forcedAt)).getTime() / 1000) : 0;
      const lastSignInSeconds = freshUser.user.last_sign_in_at
        ? Math.floor(new Date(freshUser.user.last_sign_in_at).getTime() / 1000)
        : getTokenIat(token);

      return json({ shouldLogout: !!forcedAtSeconds && !!lastSignInSeconds && lastSignInSeconds < forcedAtSeconds });
    }

    const { data: adminRole } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", authData.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!adminRole) {
      return json({ error: "Unauthorized: Admin access required" }, 403);
    }

    const userId = typeof body.userId === "string" ? body.userId : "";
    if (!userId) {
      return json({ error: "User ID is required" }, 400);
    }

    if (userId === authData.user.id) {
      return json({ error: "Cannot force logout your own account" }, 400);
    }

    const { data: targetUser, error: targetUserError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (targetUserError || !targetUser.user) {
      return json({ error: targetUserError?.message || "User not found" }, 404);
    }

    const forceLogoutAt = new Date().toISOString();
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      app_metadata: {
        ...(targetUser.user.app_metadata || {}),
        force_logout_at: forceLogoutAt,
      },
    });

    if (updateError) {
      return json({ error: updateError.message }, 500);
    }

    return json({ success: true, forceLogoutAt });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unexpected error" }, 500);
  }
});