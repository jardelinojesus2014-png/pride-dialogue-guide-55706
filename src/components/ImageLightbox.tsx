import { useEffect, useState, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ImageLightboxProps {
  src: string | null;
  alt?: string;
  onClose: () => void;
}

export const ImageLightbox = ({ src, alt, onClose }: ImageLightboxProps) => {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<{ x: number; y: number } | null>(null);

  const reset = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (!src) return;
    reset();
    // Trava o scroll do body sem perder a posição
    const scrollY = window.scrollY;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === '+' || e.key === '=') setScale((s) => Math.min(s + 0.25, 5));
      else if (e.key === '-') setScale((s) => Math.max(s - 0.25, 0.25));
      else if (e.key === '0') reset();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [src, onClose, reset]);

  if (!src) return null;

  const zoomIn = () => setScale((s) => Math.min(s + 0.25, 5));
  const zoomOut = () => setScale((s) => Math.max(s - 0.25, 0.25));

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setScale((s) => Math.min(5, Math.max(0.25, s + delta)));
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setDragging({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - dragging.x, y: e.clientY - dragging.y });
  };
  const onMouseUp = () => setDragging(null);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center animate-in fade-in duration-150"
      onClick={onClose}
      onWheel={onWheel}
    >
      {/* Toolbar */}
      <div
        className="absolute top-4 right-4 flex items-center gap-2 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={zoomOut}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          title="Diminuir (-)"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <div className="text-white/80 text-sm min-w-[3rem] text-center tabular-nums">
          {Math.round(scale * 100)}%
        </div>
        <button
          onClick={zoomIn}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          title="Aumentar (+)"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={reset}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          title="Redefinir (0)"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition ml-2"
          title="Fechar (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div
        className="max-w-[95vw] max-h-[92vh] overflow-hidden flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{ cursor: scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'default' }}
      >
        <img
          src={src}
          alt={alt || ''}
          draggable={false}
          className="select-none transition-transform duration-100 ease-out"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            maxWidth: '95vw',
            maxHeight: '92vh',
            objectFit: 'contain',
            imageRendering: scale > 1 ? 'auto' : 'auto',
          }}
        />
      </div>
    </div>
  );
};
