import { useState } from 'react';

/**
 * Reordenação por arrastar (HTML5 drag & drop) para listas simples.
 * Devolve os handlers prontos para aplicar em cada item da lista.
 */
export const useDragReorder = <T extends { id: string }>(
  items: T[],
  onReorder: (orderedIds: string[]) => void | Promise<void>,
) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [armedId, setArmedId] = useState<string | null>(null);

  // Só habilita o arrasto quando a alça (grip) é pressionada,
  // preservando a seleção de texto no corpo do tópico.
  const getHandleProps = (id: string) => ({
    onMouseDown: () => setArmedId(id),
    onTouchStart: () => setArmedId(id),
  });

  const getItemProps = (id: string) => ({
    draggable: armedId === id,
    onDragStart: (e: React.DragEvent) => {
      setDraggingId(id);
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', id); } catch { /* noop */ }
    },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (id !== overId) setOverId(id);
    },
    onDragLeave: () => {
      if (id === overId) setOverId(null);
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      const sourceId = draggingId || e.dataTransfer.getData('text/plain');
      setDraggingId(null);
      setOverId(null);
      setArmedId(null);
      if (!sourceId || sourceId === id) return;
      const ids = items.map((it) => it.id);
      const from = ids.indexOf(sourceId);
      const to = ids.indexOf(id);
      if (from < 0 || to < 0) return;
      ids.splice(to, 0, ids.splice(from, 1)[0]);
      onReorder(ids);
    },
    onDragEnd: () => {
      setDraggingId(null);
      setOverId(null);
      setArmedId(null);
    },
  });

  const getItemClassName = (id: string) =>
    [
      draggingId === id ? 'opacity-50' : '',
      overId === id && draggingId && draggingId !== id ? 'ring-2 ring-accent' : '',
    ]
      .filter(Boolean)
      .join(' ');

  return { draggingId, overId, getItemProps, getItemClassName, getHandleProps };
};
