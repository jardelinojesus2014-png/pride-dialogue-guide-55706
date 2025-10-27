import { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface Video {
  id: number;
  url: string;
  title: string;
  description: string;
}

interface VideoSectionProps {
  darkMode: boolean;
}

export const VideoSection = ({ darkMode }: VideoSectionProps) => {
  const [videos, setVideos] = useState<Video[]>([
    {
      id: 1,
      url: 'https://drive.google.com/file/d/1dXCN9ZCXPRvpRMrFIF2VDT-hGSJfmb5k/preview',
      title: 'Vídeo de Treinamento Pride',
      description: 'Guia completo sobre o roteiro de prospecção',
    },
  ]);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [currentVideo, setCurrentVideo] = useState({ url: '', title: '', description: '' });

  const handleVideoLinkAdd = () => {
    setShowVideoForm(true);
  };

  const saveVideo = () => {
    if (currentVideo.url.trim() && currentVideo.title.trim() && currentVideo.description.trim()) {
      let embedUrl = currentVideo.url.trim();
      if (embedUrl.includes('drive.google.com')) {
        const fileIdMatch = embedUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (fileIdMatch) {
          embedUrl = `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
        }
      }

      setVideos([...videos, { ...currentVideo, url: embedUrl, id: Date.now() }]);
      setCurrentVideo({ url: '', title: '', description: '' });
      setShowVideoForm(false);
    } else {
      alert('Por favor, preencha o link, título e descrição do vídeo!');
    }
  };

  const deleteVideo = (id: number) => {
    setVideos(videos.filter((v) => v.id !== id));
  };

  const cancelVideo = () => {
    setCurrentVideo({ url: '', title: '', description: '' });
    setShowVideoForm(false);
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

        <button
          onClick={handleVideoLinkAdd}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <Upload className="w-5 h-5" />
          Adicionar Vídeo
        </button>
      </div>

      {showVideoForm && (
        <div className="bg-muted border-2 border-border rounded-lg p-6 mb-6 shadow-xl">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-bold text-primary">📝 Informações do Vídeo (obrigatório)</h3>
            <button onClick={cancelVideo} className="text-destructive hover:text-destructive/80 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">Link do Vídeo *</label>
              <input
                type="text"
                value={currentVideo.url}
                onChange={(e) => setCurrentVideo({ ...currentVideo, url: e.target.value })}
                placeholder="https://drive.google.com/... ou https://youtube.com/..."
                className="w-full p-3 rounded-lg border-2 border-input bg-card focus:border-accent focus:outline-none transition-colors text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground">Título do Vídeo *</label>
              <input
                type="text"
                value={currentVideo.title}
                onChange={(e) => setCurrentVideo({ ...currentVideo, title: e.target.value })}
                placeholder="Ex: Simulação da Etapa de Apresentação"
                className="w-full p-3 rounded-lg border-2 border-input bg-card focus:border-accent focus:outline-none transition-colors text-foreground"
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
              />
            </div>

            <button
              onClick={saveVideo}
              className="w-full bg-gradient-hero hover:opacity-90 text-accent font-bold py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              ✓ Salvar Vídeo
            </button>
          </div>
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
                <iframe
                  src={video.url}
                  className="w-full h-full absolute top-0 left-0"
                  allow="autoplay"
                  allowFullScreen
                  title={video.title}
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-primary">{video.title}</h4>
                  <button
                    onClick={() => deleteVideo(video.id)}
                    className="text-destructive hover:text-destructive/80 transition-colors flex-shrink-0 ml-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
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
