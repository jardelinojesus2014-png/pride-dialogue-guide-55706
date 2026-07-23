import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Soma a altura de tudo que está congelado no topo da página (cabeçalho, nav de
 * abas, barra de busca). Cada bloco fixo se marca com `data-sticky-header`, para
 * não precisarmos manter números mágicos espalhados por página.
 */
const stickyOffset = (fallback: number) => {
  const bars = document.querySelectorAll<HTMLElement>('[data-sticky-header]');
  if (bars.length === 0) return fallback;
  let total = 0;
  bars.forEach((b) => {
    total += b.offsetHeight;
  });
  return total + 12;
};

/**
 * Rola até um tópico (elemento com id `topic-<id>`), descontando o offset dos
 * cabeçalhos fixos. Fica tentando via rAF até o elemento existir e se corrige
 * depois, pois vídeos/imagens acima terminam de carregar após a rolagem e
 * mudam a altura da página.
 */
export const scrollToTopicEl = (topicId: string, offset = 100) => {
  const jump = (smooth: boolean) => {
    const el = document.getElementById(`topic-${topicId}`);
    if (!el) return false;
    const y = el.getBoundingClientRect().top + window.scrollY - stickyOffset(offset);
    window.scrollTo({ top: y, behavior: smooth ? 'smooth' : 'auto' });
    return true;
  };

  let tries = 0;
  const step = () => {
    if (jump(true)) {
      // correções depois que o conteúdo acima assenta
      [350, 750, 1300].forEach((d) => window.setTimeout(() => jump(false), d));
      return;
    }
    if (tries++ < 150) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

/**
 * Trata o deep-link `#topic-<id>` vindo da barra de busca.
 *
 * @param ready   vira true quando os tópicos da página já carregaram — dispara
 *                nova tentativa caso a primeira tenha ocorrido cedo demais.
 * @param onOpen  opcional: abre o tópico (páginas com accordion).
 * @param offset  altura dos cabeçalhos fixos da página.
 */
export const useTopicDeepLink = (
  ready: boolean,
  onOpen?: (topicId: string) => void,
  offset = 100,
) => {
  const location = useLocation();
  const doneRef = useRef('');
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;

  useEffect(() => {
    if (!location.hash.startsWith('#topic-')) return;

    // location.key muda a cada navegação, então clicar de novo na mesma
    // sugestão volta a rolar.
    const runId = `${location.key}${location.hash}`;
    if (doneRef.current === runId) return;

    const topicId = location.hash.replace('#topic-', '');
    onOpenRef.current?.(topicId);

    let cancelled = false;
    let tries = 0;
    const jump = (smooth: boolean) => {
      const el = document.getElementById(`topic-${topicId}`);
      if (!el) return false;
      const y = el.getBoundingClientRect().top + window.scrollY - stickyOffset(offset);
      window.scrollTo({ top: y, behavior: smooth ? 'smooth' : 'auto' });
      return true;
    };

    const timers: number[] = [];
    const step = () => {
      if (cancelled) return;
      if (jump(true)) {
        doneRef.current = runId;
        [350, 750, 1300].forEach((d) =>
          timers.push(
            window.setTimeout(() => {
              if (!cancelled) jump(false);
            }, d),
          ),
        );
        return;
      }
      if (tries++ < 150) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);

    return () => {
      cancelled = true;
      timers.forEach((t) => clearTimeout(t));
    };
  }, [location.hash, location.key, ready, offset]);
};
