import { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface FluxoVideo {
  id: string;
  title: string;
  description: string;
  video_url: string;
  created_at: string;
}

interface FluxoVideoSectionProps {
  darkMode: boolean;
}

export const FluxoVideoSection = ({ darkMode }: FluxoVideoSectionProps) => {
  const [videos, setVideos] = useState<FluxoVideo[]>([]);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [currentVideo, setCurrentVideo] = useState({ url: '', title: '', description: '' });
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'upload'>('link');
  const { isAdmin, loading: adminLoading } = useIsAdmin();

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

  const handleVideoLinkAdd = () => {
    setShowVideoForm(true);
  };

  const saveVideoLink = async () => {
    if (currentVideo.url.trim() && currentVideo.title.trim() && currentVideo.description.trim()) {
      setIsUploading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        let embedUrl = currentVideo.url.trim();
        
        // Convert Google Drive links to embed format
        if (embedUrl.includes('drive.google.com')) {
          const fileIdMatch = embedUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
          if (fileIdMatch) {
            embedUrl = `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
          }
        }

        const { error } = await supabase
          .from('fluxo_videos')
          .insert({
            title: currentVideo.title.trim(),
            description: currentVideo.description.trim(),
            video_url: embedUrl,
            thumbnail_url: '', // Not needed for iframe
            created_by: user.id,
          });

        if (error) throw error;

        toast({
          title: 'Vídeo adicionado com sucesso!',
          description: `"${currentVideo.title}" foi adicionado.`,
        });

        setCurrentVideo({ url: '', title: '', description: '' });
        setShowVideoForm(false);
        loadVideos();
      } catch (error: any) {
        console.error('Error saving video:', error);
        toast({
          title: 'Erro ao adicionar vídeo',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsUploading(false);
      }
    } else {
      alert('Por favor, preencha o link, título e descrição do vídeo!');
    }
  };

  const uploadVideoFile = async () => {
    if (!currentVideo.title.trim() || !currentVideo.description.trim() || !selectedVideo) {
      alert('Por favor, preencha título, descrição e selecione um arquivo de vídeo!');
      return;
    }

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Upload video
      const videoExt = selectedVideo.name.split('.').pop();
      const videoFileName = `${Date.now()}_video.${videoExt}`;

      const { error: videoUploadError } = await supabase.storage
        .from('fluxo_videos')
        .upload(videoFileName, selectedVideo);

      if (videoUploadError) throw videoUploadError;

      const { data: videoUrlData } = supabase.storage
        .from('fluxo_videos')
        .getPublicUrl(videoFileName);

      // Insert into database
      const { error: dbError } = await supabase
        .from('fluxo_videos')
        .insert({
          title: currentVideo.title.trim(),
          description: currentVideo.description.trim(),
          video_url: videoUrlData.publicUrl,
          thumbnail_url: '', // Not needed
          created_by: user.id,
        });

      if (dbError) throw dbError;

      toast({
        title: 'Vídeo enviado com sucesso!',
        description: `"${currentVideo.title}" foi adicionado.`,
      });

      setCurrentVideo({ url: '', title: '', description: '' });
      setSelectedVideo(null);
      setShowVideoForm(false);
      loadVideos();
    } catch (error: any) {
      console.error('Error uploading video:', error);
      toast({
        title: 'Erro ao enviar vídeo',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const deleteVideo = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este vídeo?')) return;

    try {
      const { error } = await supabase
        .from('fluxo_videos')
        .delete()
        .eq('id', id);

      if (error) throw error;

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

  const cancelVideo = () => {
    setCurrentVideo({ url: '', title: '', description: '' });
    setSelectedVideo(null);
    setShowVideoForm(false);
    setActiveTab('link');
  };

  return (
    <div className="bg-card rounded-xl shadow-lg p-6 mb-8 border-2 border-border">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-hero rounded-full p-3 shadow-lg">
            <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-primary">🎥 Vídeos de Treinamento</h2>
            <p className="text-sm text-muted-foreground">
              Adicione vídeos com exemplos e simulações do roteiro
            </p>
          </div>
        </div>

        {!adminLoading && isAdmin && (
          <button
            onClick={handleVideoLinkAdd}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Upload className="w-5 h-5" />
            Adicionar Vídeo
          </button>
        )}
      </div>

      {showVideoForm && (
        <div className="bg-muted border-2 border-border rounded-lg p-6 mb-6 shadow-xl">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-bold text-primary">📝 Informações do Vídeo (obrigatório)</h3>
            <button onClick={cancelVideo} className="text-destructive hover:text-destructive/80 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'link' | 'upload')}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="link">Link do Vídeo</TabsTrigger>
              <TabsTrigger value="upload">Upload do PC</TabsTrigger>
            </TabsList>

            <TabsContent value="link" className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">Link do Vídeo *</label>
                <input
                  type="text"
                  value={currentVideo.url}
                  onChange={(e) => setCurrentVideo({ ...currentVideo, url: e.target.value })}
                  placeholder="https://drive.google.com/... ou https://youtube.com/..."
                  className="w-full p-3 rounded-lg border-2 border-input bg-card focus:border-accent focus:outline-none transition-colors text-foreground"
                  disabled={isUploading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">Título do Vídeo *</label>
                <input
                  type="text"
                  value={currentVideo.title}
                  onChange={(e) => setCurrentVideo({ ...currentVideo, title: e.target.value })}
                  placeholder="Ex: Simulação da Etapa de Follow-up"
                  className="w-full p-3 rounded-lg border-2 border-input bg-card focus:border-accent focus:outline-none transition-colors text-foreground"
                  disabled={isUploading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">Descrição *</label>
                <textarea
                  value={currentVideo.description}
                  onChange={(e) => setCurrentVideo({ ...currentVideo, description: e.target.value })}
                  placeholder="Descreva brevemente o conteúdo deste vídeo..."
                  className="w-full p-3 rounded-lg border-2 border-input bg-card focus:border-accent focus:outline-none transition-colors text-foreground"
                  rows={3}
                  disabled={isUploading}
                />
              </div>

              <button
                onClick={saveVideoLink}
                disabled={isUploading}
                className="w-full bg-gradient-hero hover:opacity-90 text-accent font-bold py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50"
              >
                {isUploading ? 'Salvando...' : '✓ Salvar Vídeo'}
              </button>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">Título do Vídeo *</label>
                <input
                  type="text"
                  value={currentVideo.title}
                  onChange={(e) => setCurrentVideo({ ...currentVideo, title: e.target.value })}
                  placeholder="Ex: Simulação da Etapa de Follow-up"
                  className="w-full p-3 rounded-lg border-2 border-input bg-card focus:border-accent focus:outline-none transition-colors text-foreground"
                  disabled={isUploading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">Descrição *</label>
                <textarea
                  value={currentVideo.description}
                  onChange={(e) => setCurrentVideo({ ...currentVideo, description: e.target.value })}
                  placeholder="Descreva brevemente o conteúdo deste vídeo..."
                  className="w-full p-3 rounded-lg border-2 border-input bg-card focus:border-accent focus:outline-none transition-colors text-foreground"
                  rows={3}
                  disabled={isUploading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">Arquivo de Vídeo *</label>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo,video/*"
                  onChange={(e) => setSelectedVideo(e.target.files?.[0] || null)}
                  className="w-full p-3 rounded-lg border-2 border-input bg-card focus:border-accent focus:outline-none transition-colors text-foreground"
                  disabled={isUploading}
                />
                {selectedVideo && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Vídeo selecionado: {selectedVideo.name} ({(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <button
                onClick={uploadVideoFile}
                disabled={isUploading}
                className="w-full bg-gradient-hero hover:opacity-90 text-accent font-bold py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50"
              >
                {isUploading ? 'Enviando...' : '✓ Fazer Upload'}
              </button>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {videos.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-muted rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-video bg-black">
                {video.video_url.includes('drive.google.com') || video.video_url.includes('youtube.com') || video.video_url.includes('youtu.be') ? (
                  <iframe
                    src={video.video_url}
                    className="w-full h-full absolute top-0 left-0"
                    allowFullScreen
                    title={video.title}
                  />
                ) : (
                  <video
                    controls
                    className="w-full h-full absolute top-0 left-0"
                    preload="metadata"
                  >
                    <source src={video.video_url} type="video/mp4" />
                    Seu navegador não suporta a reprodução de vídeos.
                  </video>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-primary">{video.title}</h4>
                  {!adminLoading && isAdmin && (
                    <button
                      onClick={() => deleteVideo(video.id)}
                      className="text-destructive hover:text-destructive/80 transition-colors flex-shrink-0 ml-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
          <p className="font-semibold">Nenhum vídeo adicionado ainda</p>
          <p className="text-sm mt-2">Clique em "Adicionar Vídeo" para começar</p>
        </div>
      )}
    </div>
  );
};
