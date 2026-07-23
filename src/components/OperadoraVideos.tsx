import { useState } from 'react';
import { Video, Play, ChevronDown, Trash2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useOperadoraContent, OperadoraContent } from '@/hooks/useOperadoras';

const formatVideoUrl = (url: string) => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('youtu.be')
      ? url.split('/').pop()?.split('?')[0]
      : url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes('drive.google.com')) {
    const fileId = url.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1];
    if (fileId) return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return url;
};

const isEmbeddable = (url: string) =>
  url.includes('youtube') || url.includes('youtu.be') || url.includes('drive.google.com');

// Capa (thumbnail) do vídeo — funciona para YouTube
const getThumbnail = (url: string): string | null => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const id = url.includes('youtu.be')
      ? url.split('/').pop()?.split('?')[0]
      : url.split('v=')[1]?.split('&')[0];
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  }
  return null;
};

/** Vídeos da operadora em formato compacto (no topo da página), com player grande ao clicar. */
export const OperadoraVideos = ({ operadoraId, isAdmin }: { operadoraId: string; isAdmin?: boolean }) => {
  const { content, deleteContent } = useOperadoraContent(operadoraId);
  const videos = content.filter((c) => c.content_type === 'video');
  const [playing, setPlaying] = useState<OperadoraContent | null>(null);
  const multiple = videos.length > 1;
  const [open, setOpen] = useState(true); // vários vídeos começam abertos (pode recolher)

  if (videos.length === 0) return null;

  const renderCard = (v: OperadoraContent) => {
        const thumb = getThumbnail(v.file_url);
        return (
          <div
            key={v.id}
            className="group relative flex flex-col sm:flex-row items-stretch sm:items-center gap-4 rounded-2xl border border-accent/40 bg-accent/5 p-4 hover:border-accent/70 hover:shadow-lg transition-all"
          >
            {isAdmin && (
              <button
                onClick={() => {
                  if (confirm(`Excluir o vídeo "${v.title}"?`)) deleteContent(v.id, v.file_path);
                }}
                className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 hover:bg-destructive/90 transition-all shadow-lg"
                title="Excluir vídeo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            {/* Capa clicável do vídeo */}
            <button
              onClick={() => setPlaying(v)}
              className="relative flex-shrink-0 w-full sm:w-52 aspect-video rounded-xl overflow-hidden bg-muted shadow-md"
              title="Assistir"
            >
              {thumb ? (
                <img src={thumb} alt={v.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-hero">
                  <Video className="w-9 h-9 text-accent" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent group-hover:from-black/70 flex items-center justify-center transition-all">
                <span className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 text-primary fill-primary ml-0.5" />
                </span>
              </div>
            </button>

            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-accent-foreground bg-accent px-2.5 py-0.5 rounded-full mb-2">
                <Video className="w-3 h-3" /> Vídeo de treinamento
              </span>
              <h4 className="text-base sm:text-lg font-bold text-foreground leading-tight">{v.title}</h4>
              {v.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{v.description}</p>}
              <button
                onClick={() => setPlaying(v)}
                className="mt-3 inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Play className="w-4 h-4 fill-current" /> Assistir agora
              </button>
            </div>
          </div>
        );
  };

  return (
    <div className="mb-6">
      {multiple ? (
        <>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center justify-between w-full rounded-2xl border border-accent/40 bg-accent/5 px-4 py-3 hover:border-accent/70 transition-colors"
          >
            <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-accent-foreground bg-accent px-2.5 py-0.5 rounded-full">
                <Video className="w-3 h-3" /> {videos.length} vídeos
              </span>
              de treinamento
            </span>
            <ChevronDown className={`w-5 h-5 text-accent transition-transform ${open ? '' : '-rotate-90'}`} />
          </button>
          {open && <div className="space-y-3 mt-3">{videos.map(renderCard)}</div>}
        </>
      ) : (
        renderCard(videos[0])
      )}

      <Dialog open={!!playing} onOpenChange={(o) => !o && setPlaying(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden border-0 bg-black">
          {playing && (
            <div className="aspect-video w-full bg-black">
              {isEmbeddable(playing.file_url) ? (
                <iframe
                  src={`${formatVideoUrl(playing.file_url)}?rel=0&modestbranding=1&autoplay=1`}
                  title={playing.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : (
                <video src={playing.file_url} controls autoPlay className="w-full h-full" />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
