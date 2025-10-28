import { useState, useEffect } from 'react';
import { Building2, Copy, Check, Edit, Save, X } from 'lucide-react';
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
    <section className="bg-card rounded-lg shadow-xl p-6 sm:p-8 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-full p-3 shadow-lg">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-primary">
              Institucional da Pride Corretora
            </h2>
            <p className="text-sm text-muted-foreground">
              Apresente a Pride Corretora aos seus clientes
            </p>
          </div>
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
        <div className="space-y-4 bg-muted/30 p-6 rounded-lg">
          <div className="space-y-2">
            <Label>URL do Vídeo do YouTube</Label>
            <Input
              value={editData.video_url}
              onChange={(e) => setEditData({ ...editData, video_url: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="text-xs text-muted-foreground">
              Cole a URL completa do YouTube (ex: https://www.youtube.com/watch?v=...)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Título</Label>
            <Input
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="Ex: Conheça a Pride Corretora"
            />
          </div>

          <div className="space-y-2">
            <Label>Descrição (opcional)</Label>
            <Input
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              placeholder="Ex: Veja nossa apresentação institucional"
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
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-primary rounded-lg p-6">
            <h3 className="text-xl font-bold text-primary mb-2">{video.title}</h3>
            {video.description && (
              <p className="text-muted-foreground mb-4">{video.description}</p>
            )}
            
            <div className="aspect-video rounded-lg overflow-hidden bg-black shadow-lg mb-4">
              <iframe
                src={video.video_url}
                className="w-full h-full"
                allowFullScreen
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>

            <Button
              onClick={handleCopyLink}
              className="w-full sm:w-auto gap-2"
              variant={copied ? "outline" : "default"}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Link Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar Link para Enviar ao Cliente
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Nenhum vídeo institucional configurado ainda</p>
          {effectiveIsAdmin && (
            <Button onClick={() => setIsEditing(true)} className="mt-4">
              Adicionar Vídeo
            </Button>
          )}
        </div>
      )}
    </section>
  );
};
