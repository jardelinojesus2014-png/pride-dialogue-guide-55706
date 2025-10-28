import { useState, useEffect } from 'react';
import { Building2, Copy, Check, Edit, Save, X, Video } from 'lucide-react';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface InstitutionalSectionProps {
  darkMode: boolean;
  userViewMode?: boolean;
}

interface InstitutionalVideo {
  id: string;
  video_url: string;
  title: string;
  description: string;
}

export const InstitutionalSection = ({ darkMode, userViewMode = false }: InstitutionalSectionProps) => {
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const effectiveIsAdmin = isAdmin && !userViewMode;
  const [video, setVideo] = useState<InstitutionalVideo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ video_url: '', title: '', description: '' });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadVideo();
  }, []);

  const loadVideo = async () => {
    try {
      const { data, error } = await supabase
        .from('institutional_videos')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        const videoData: InstitutionalVideo = {
          id: data.id,
          video_url: data.video_url,
          title: data.title,
          description: data.description || '',
        };
        setVideo(videoData);
        setEditData({
          video_url: videoData.video_url,
          title: videoData.title,
          description: videoData.description,
        });
      }
    } catch (error: any) {
      console.error('Error loading institutional video:', error);
    }
  };

  const handleSave = async () => {
    if (!editData.video_url.trim() || !editData.title.trim()) {
      toast({
        title: 'Erro',
        description: 'URL do vídeo e título são obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      let embedUrl = editData.video_url.trim();
      
      // Converter URL do YouTube para formato embed
      if (embedUrl.includes('youtube.com/watch?v=')) {
        const videoId = embedUrl.split('v=')[1]?.split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (embedUrl.includes('youtu.be/')) {
        const videoId = embedUrl.split('youtu.be/')[1]?.split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }

      if (video) {
        // Update existing
        const { error } = await supabase
          .from('institutional_videos')
          .update({
            video_url: embedUrl,
            title: editData.title.trim(),
            description: editData.description.trim(),
          })
          .eq('id', video.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('institutional_videos')
          .insert({
            video_url: embedUrl,
            title: editData.title.trim(),
            description: editData.description.trim(),
            created_by: user.id,
          });

        if (error) throw error;
      }

      toast({
        title: 'Sucesso',
        description: 'Vídeo institucional salvo com sucesso',
      });

      setIsEditing(false);
      loadVideo();
    } catch (error: any) {
      console.error('Error saving institutional video:', error);
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleCopyLink = () => {
    if (video?.video_url) {
      // Converter embed URL para URL normal do YouTube
      let shareUrl = video.video_url;
      if (shareUrl.includes('youtube.com/embed/')) {
        const videoId = shareUrl.split('embed/')[1]?.split('?')[0];
        shareUrl = `https://www.youtube.com/watch?v=${videoId}`;
      }

      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: 'Link copiado!',
        description: 'O link do vídeo foi copiado para a área de transferência',
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-card via-card to-primary/5 rounded-2xl shadow-2xl p-8 sm:p-10 mb-6 border-2 border-primary/20 overflow-hidden">
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-yellow-500 rounded-tl-2xl" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-yellow-500 rounded-br-2xl" />
      <div className="absolute top-1/2 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-yellow-500 to-transparent transform -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-1 h-32 bg-gradient-to-b from-transparent via-yellow-500 to-transparent transform -translate-y-1/2" />
      
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-primary mb-2 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            Institucional Pride Corretora
          </h2>
          <p className="text-sm text-muted-foreground ml-15">
            Conheça mais sobre nossa empresa através do nosso vídeo institucional
          </p>
        </div>
        {!adminLoading && effectiveIsAdmin && !isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="gap-2"
          >
            <Edit className="w-5 h-5" />
            Editar
          </Button>
        )}
      </div>

      {isEditing && effectiveIsAdmin ? (
        <div className="relative z-10 space-y-4 bg-muted/50 backdrop-blur-sm p-8 rounded-xl border border-primary/20">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-primary">URL do Vídeo do YouTube</Label>
            <Input
              value={editData.video_url}
              onChange={(e) => setEditData({ ...editData, video_url: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="border-primary/30"
            />
            <p className="text-xs text-muted-foreground">
              Cole a URL completa do YouTube (ex: https://www.youtube.com/watch?v=...)
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-primary">Título</Label>
            <Input
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="Ex: Conheça a Pride Corretora"
              className="border-primary/30"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-primary">Descrição (opcional)</Label>
            <Input
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              placeholder="Ex: Veja nossa apresentação institucional"
              className="border-primary/30"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                if (video) {
                  setEditData({
                    video_url: video.video_url,
                    title: video.title,
                    description: video.description,
                  });
                }
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      ) : video ? (
        <div className="relative z-10 space-y-6">
          <div className="text-center max-w-3xl mx-auto bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-6 rounded-xl border border-primary/20">
            <h3 className="text-3xl font-black text-primary mb-4">{video.title}</h3>
            {video.description && (
              <p className="text-foreground/80 leading-relaxed">{video.description}</p>
            )}
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative border-4 border-yellow-500 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/5 to-transparent p-2">
              <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={video.video_url}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="gap-2 border-2 border-yellow-500 hover:bg-yellow-500 hover:text-white transition-all duration-300 px-6 py-3 font-bold"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Link Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copiar Link do Vídeo
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative z-10 text-center py-16 text-muted-foreground">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-4">
            <Video className="w-10 h-10 text-white" />
          </div>
          <p className="text-lg font-semibold">Nenhum vídeo configurado ainda</p>
          {effectiveIsAdmin && (
            <Button onClick={() => setIsEditing(true)} className="mt-6 px-6 py-3 font-bold">
              Adicionar Vídeo
            </Button>
          )}
        </div>
      )}
    </section>
  );
};
