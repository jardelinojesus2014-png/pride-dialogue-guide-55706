import { supabase } from "@/integrations/supabase/client";

const PUBLIC_MARKER = "/storage/v1/object/public/";
const SIGN_TTL_SECONDS = 60 * 60; // 1 hour

type CacheEntry = { url: string; expiresAt: number };

const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<string>>();

export function isPublicStorageUrl(url: unknown): url is string {
  return typeof url === "string" && url.includes(PUBLIC_MARKER);
}

export function parsePublicStorageUrl(
  url: string
): { bucket: string; path: string; query: string } | null {
  const idx = url.indexOf(PUBLIC_MARKER);
  if (idx === -1) return null;
  const rest = url.slice(idx + PUBLIC_MARKER.length);
  const [pathPart, query = ""] = rest.split("?");
  const segments = pathPart.split("/").filter(Boolean);
  if (segments.length < 2) return null;
  const bucket = segments[0];
  const path = segments.slice(1).join("/");
  return { bucket, path: decodeURIComponent(path), query };
}

/**
 * Converts a stored Supabase "public" object URL into a short-lived signed URL.
 * Buckets are private, so this is required for any read access.
 * Returns the original URL if it is not a storage URL or signing fails.
 */
export async function resolveStorageUrl(url: string): Promise<string> {
  if (!isPublicStorageUrl(url)) return url;

  const cached = cache.get(url);
  const now = Date.now();
  if (cached && cached.expiresAt > now) return cached.url;

  const pending = inflight.get(url);
  if (pending) return pending;

  const parsed = parsePublicStorageUrl(url);
  if (!parsed) return url;

  const task = (async () => {
    try {
      const { data, error } = await supabase.storage
        .from(parsed.bucket)
        .createSignedUrl(parsed.path, SIGN_TTL_SECONDS);
      if (error || !data?.signedUrl) return url;
      const signed = parsed.query
        ? `${data.signedUrl}${data.signedUrl.includes("?") ? "&" : "?"}${parsed.query}`
        : data.signedUrl;
      cache.set(url, {
        url: signed,
        // refresh a bit before the real expiry
        expiresAt: Date.now() + (SIGN_TTL_SECONDS - 300) * 1000,
      });
      return signed;
    } catch {
      return url;
    } finally {
      inflight.delete(url);
    }
  })();

  inflight.set(url, task);
  return task;
}

export function clearStorageUrlCache() {
  cache.clear();
}
