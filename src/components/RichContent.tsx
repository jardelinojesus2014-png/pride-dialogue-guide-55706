import { useRef, useState, useEffect, useMemo } from 'react';
import DOMPurify from 'dompurify';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ImageLightbox } from '@/components/ImageLightbox';

interface RichContentProps {
  content: string;
}

// Heurística: se começar com uma tag HTML, tratamos como HTML (editor rich).
// Caso contrário, mantém compatibilidade com Markdown legado.
const looksLikeHtml = (s: string) =>
  /^\s*<(p|h[1-6]|ul|ol|li|blockquote|div|img|iframe|figure|table|span|mark|strong|em|u|s|a|hr|br)\b/i.test(s);

/**
 * Renderiza conteúdo dos tópicos com fidelidade total ao editor (WYSIWYG real):
 * - HTML do editor rich é sanitizado com DOMPurify (mantendo estilos inline de
 *   cor, marca-texto, alinhamento e largura de imagem, além de iframes de
 *   YouTube/Loom) e injetado diretamente — nada se perde entre salvar e exibir.
 * - Se for Markdown (conteúdo legado), delega para MarkdownContent.
 * - Duplo clique em qualquer imagem abre um lightbox com zoom (estilo Notion).
 */
export const RichContent = ({ content }: RichContentProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState<string | undefined>(undefined);

  const isHtml = looksLikeHtml(content || '');

  const sanitized = useMemo(() => {
    if (!isHtml) return '';
    return DOMPurify.sanitize(content, {
      ADD_TAGS: ['iframe'],
      ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target', 'rel'],
    });
  }, [content, isHtml]);

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
  }, [sanitized, isHtml]);

  if (!content?.trim()) return null;

  return (
    <>
      <div ref={wrapperRef}>
        {isHtml ? (
          <div className="rich-content" dangerouslySetInnerHTML={{ __html: sanitized }} />
        ) : (
          <MarkdownContent content={content} />
        )}
      </div>
      <ImageLightbox
        src={lightboxSrc}
        alt={lightboxAlt}
        onClose={() => setLightboxSrc(null)}
      />
    </>
  );
};
