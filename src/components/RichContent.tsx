import { useRef, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ImageLightbox } from '@/components/ImageLightbox';

interface RichContentProps {
  content: string;
}

// Heurística: se começar com uma tag HTML de bloco, tratamos como HTML (editor rich).
// Caso contrário, mantém compatibilidade com Markdown legado.
const looksLikeHtml = (s: string) => /^\s*<(p|h[1-6]|ul|ol|blockquote|div|img|iframe|figure|table)\b/i.test(s);

/**
 * Renderiza conteúdo dos tópicos.
 * - Se for HTML (novo editor rich), renderiza com sanitização básica e estilos.
 * - Se for Markdown (conteúdo legado), delega para MarkdownContent.
 * - Duplo clique em qualquer imagem abre um lightbox com zoom (estilo Notion).
 */
export const RichContent = ({ content }: RichContentProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState<string | undefined>(undefined);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const onDblClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'IMG') {
        const img = target as HTMLImageElement;
        // Usa o src mais alto disponível
        const hi = img.getAttribute('data-hi-res') || img.currentSrc || img.src;
        if (hi) {
          setLightboxAlt(img.alt || undefined);
          setLightboxSrc(hi);
        }
      }
    };

    // Marca visualmente as imagens como clicáveis
    const imgs = el.querySelectorAll('img');
    imgs.forEach((img) => {
      img.style.cursor = 'zoom-in';
      img.setAttribute('title', img.getAttribute('title') || 'Duplo clique para ampliar');
    });

    el.addEventListener('dblclick', onDblClick);
    return () => el.removeEventListener('dblclick', onDblClick);
  }, [content]);

  if (!content?.trim()) return null;

  const inner = !looksLikeHtml(content) ? (
    <MarkdownContent content={content} />
  ) : (
    <div className="rich-content text-[15px] leading-relaxed text-foreground/90 space-y-3
      [&_p]:text-muted-foreground
      [&_strong]:text-foreground [&_strong]:font-semibold
      [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-4
      [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-3
      [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:text-muted-foreground
      [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_ol]:text-muted-foreground
      [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2
      [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:bg-accent/5 [&_blockquote]:px-4 [&_blockquote]:py-2 [&_blockquote]:rounded-r-lg
      [&_img]:rounded-lg [&_img]:my-2 [&_img]:max-w-full [&_img]:cursor-zoom-in
      [&_iframe]:rounded-lg [&_iframe]:max-w-full
      [&_div[data-youtube-video]_iframe]:w-full [&_div[data-youtube-video]_iframe]:aspect-video [&_div[data-youtube-video]_iframe]:h-auto
      [&_.video-embed]:my-3 [&_.video-embed]:rounded-lg [&_.video-embed]:overflow-hidden">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );

  return (
    <>
      <div ref={wrapperRef}>{inner}</div>
      <ImageLightbox
        src={lightboxSrc}
        alt={lightboxAlt}
        onClose={() => setLightboxSrc(null)}
      />
    </>
  );
};
