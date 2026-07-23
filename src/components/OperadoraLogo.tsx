import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OperadoraLogoProps {
  url: string;
  name: string;
  className?: string;
}

/**
 * Logo da operadora preenchendo o quadrado com a cor da marca (detectada
 * automaticamente pelos cantos), no mesmo estilo dos cards da grade.
 */
export const OperadoraLogo = ({ url, name, className }: OperadoraLogoProps) => {
  const [bgColor, setBgColor] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setBgColor(null);
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const w = canvas.width;
        const h = canvas.height;

        const corners = [
          ctx.getImageData(2, 2, 1, 1).data,
          ctx.getImageData(w - 3, 2, 1, 1).data,
          ctx.getImageData(2, h - 3, 1, 1).data,
          ctx.getImageData(w - 3, h - 3, 1, 1).data,
        ];
        const opaque = corners.filter((p) => p[3] > 200);

        if (opaque.length >= 2) {
          const counts: Record<string, { rgb: string; n: number }> = {};
          opaque.forEach((p) => {
            const key = `${p[0]},${p[1]},${p[2]}`;
            counts[key] = counts[key] || { rgb: `rgb(${p[0]}, ${p[1]}, ${p[2]})`, n: 0 };
            counts[key].n += 1;
          });
          const best = Object.values(counts).sort((a, b) => b.n - a.n)[0];
          if (!cancelled && best) setBgColor(best.rgb);
          return;
        }

        const data = ctx.getImageData(0, 0, w, h).data;
        let rs = 0, gs = 0, bs = 0, count = 0;
        for (let i = 0; i < data.length; i += 40) {
          if (data[i + 3] > 128) {
            rs += data[i];
            gs += data[i + 1];
            bs += data[i + 2];
            count += 1;
          }
        }
        if (count === 0) {
          if (!cancelled) setBgColor('#ffffff');
          return;
        }
        const lum = (0.299 * rs + 0.587 * gs + 0.114 * bs) / count;
        if (!cancelled) setBgColor(lum > 150 ? '#13234b' : '#ffffff');
      } catch {
        if (!cancelled) setBgColor('#ffffff');
      }
    };
    img.src = url;
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div
      className={cn('rounded-2xl overflow-hidden border border-border/40 shadow-sm', className)}
      style={{ backgroundColor: bgColor || '#ffffff' }}
    >
      <img src={url} alt={name} crossOrigin="anonymous" className="w-full h-full object-contain" />
    </div>
  );
};
