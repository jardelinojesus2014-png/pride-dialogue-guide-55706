import { useState, useEffect } from 'react';
import { Trash2, Video, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { toast } from '@/hooks/use-toast';
import { FluxoVideoUploadDialog } from './FluxoVideoUploadDialog';

interface FluxoVideo {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  created_at: string;
}

interface FluxoVideoSectionProps {
  darkMode: boolean;
}

export const FluxoVideoSection = ({ darkMode }: FluxoVideoSectionProps) => {
  const [videos, setVideos] = useState<FluxoVideo[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const { isAdmin } = useIsAdmin();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('fluxo_videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error: any) {
      console.error('Error loading videos:', error);
      toast({
        title: 'Erro ao carregar vídeos',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteVideo = async (id: string, videoUrl: string, thumbnailUrl: string) => {
    if (!confirm('Tem certeza que deseja excluir este vídeo?')) return;

    try {
      const videoFileName = videoUrl.split('/').pop();
      const thumbnailFileName = thumbnailUrl.split('/').pop();

      if (videoFileName) {
        await supabase.storage.from('fluxo_videos').remove([videoFileName]);
      }
      if (thumbnailFileName) {
        await supabase.storage.from('fluxo_videos').remove([thumbnailFileName]);
      }

      const { error: dbError } = await supabase
        .from('fluxo_videos')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      toast({
        title: 'Vídeo excluído',
        description: 'O vídeo foi removido com sucesso.',
      });

      loadVideos();
    } catch (error: any) {
      console.error('Error deleting video:', error);
      toast({
        title: 'Erro ao excluir vídeo',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <section className="bg-card rounded-lg shadow-xl p-6 sm:p-8 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-full p-3 shadow-lg">
            <Video className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-primary">
              Vídeos de Treinamento
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Adicione vídeos com exemplos e simulações do roteiro
            </p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={() => setUploadDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Upload className="w-5 h-5" />
            <span className="hidden sm:inline">Adicionar Vídeo</span>
          </button>
        )}
      </div>

      {videos.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          Nenhum vídeo disponível ainda.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-muted/50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <a
                  href={video.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/70 transition-all duration-300"
                >
                  <div className="bg-primary rounded-full p-4">
                    <Video className="w-8 h-8 text-primary-foreground" />
                  </div>
                </a>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-foreground mb-2">
                  {video.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {video.description}
                </p>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteVideo(video.id, video.video_url, video.thumbnail_url)}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-all duration-300 hover:scale-105"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {uploadDialogOpen && (
        <FluxoVideoUploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          onUploadSuccess={loadVideos}
        />
      )}
    </section>
  );
};
