import { useEffect } from "react";
import { isPublicStorageUrl, resolveStorageUrl } from "@/lib/storageUrl";

const ATTRS = ["src", "href", "poster"] as const;

async function rewriteElement(el: Element) {
  for (const attr of ATTRS) {
    const value = el.getAttribute(attr);
    if (!isPublicStorageUrl(value)) continue;
    const signed = await resolveStorageUrl(value);
    if (signed !== value && el.getAttribute(attr) === value) {
      el.setAttribute(attr, signed);
    }
  }
}

function scan(root: ParentNode) {
  const selector = "[src],[href],[poster]";
  if (root instanceof Element) void rewriteElement(root);
  root.querySelectorAll?.(selector).forEach((el) => void rewriteElement(el));
}

/**
 * Storage buckets are private. Stored media URLs are kept in the legacy
 * "public object" format, so we transparently swap them for short-lived
 * signed URLs both in the DOM and in fetch() calls (downloads).
 */
export function SignedStorageUrlBridge() {
  useEffect(() => {
    // 1) DOM attributes (img/video/audio/iframe/anchor)
    scan(document);
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.target instanceof Element) {
          void rewriteElement(m.target);
        }
        m.addedNodes.forEach((node) => {
          if (node instanceof Element) scan(node);
        });
      }
    });
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["src", "href", "poster"],
    });

    // 2) fetch() based downloads / blob reads
    const originalFetch = window.fetch.bind(window);
    const patchedFetch: typeof window.fetch = async (input, init) => {
      try {
        if (typeof input === "string" && isPublicStorageUrl(input)) {
          return originalFetch(await resolveStorageUrl(input), init);
        }
        if (input instanceof URL && isPublicStorageUrl(input.toString())) {
          return originalFetch(await resolveStorageUrl(input.toString()), init);
        }
        if (input instanceof Request && isPublicStorageUrl(input.url)) {
          const signed = await resolveStorageUrl(input.url);
          return originalFetch(new Request(signed, input), init);
        }
      } catch {
        // fall through to the original request
      }
      return originalFetch(input as RequestInfo, init);
    };
    window.fetch = patchedFetch;

    return () => {
      observer.disconnect();
      if (window.fetch === patchedFetch) window.fetch = originalFetch;
    };
  }, []);

  return null;
}
