import { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface PodcastSectionProps {
  darkMode: boolean;
}

export const PodcastSection = ({ darkMode }: PodcastSectionProps) => {
  const [podcastFile, setPodcastFile] = useState<{ url: string; name: string } | null>({
    url: 'https://drive.google.com/file/d/1h1LqUVvldJXZBC_rryyqqzR36Wa41y-0/preview',
    name: 'Podcast - Guia do Roteiro Pride',
  });
  const [showPodcastInput, setShowPodcastInput] = useState(false);

  const handlePodcastLinkSave = (link: string) => {
    if (link.trim()) {
      setPodcastFile({ url: link.trim(), name: 'Podcast - Guia do Roteiro' });
      setShowPodcastInput(false);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-lg p-6 mb-8 border-2 border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-hero rounded-full p-3 shadow-lg">
          <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-black text-primary">🎧 Guia em Áudio do Roteiro</h2>
          <p className="text-sm text-muted-foreground">Adicione um link de áudio explicando o roteiro</p>
        </div>
      </div>

      {!podcastFile ? (
        !showPodcastInput ? (
          <button
            onClick={() => setShowPodcastInput(true)}
            className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 transition-all duration-300 hover:scale-105 hover:border-accent w-full"
          >
            <Upload className="w-12 h-12 mb-3 text-primary" />
            <p className="text-center font-semibold text-foreground">
              Clique para adicionar link do podcast/áudio guia
            </p>
            <p className="text-xs mt-2 text-muted-foreground">Google Drive, Dropbox, etc.</p>
          </button>
        ) : (
          <div className="bg-muted rounded-lg p-4 shadow-md">
            <label className="block text-sm font-semibold mb-2 text-foreground">
              Cole o link do áudio:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://drive.google.com/..."
                className="flex-1 px-3 py-2 rounded-lg border-2 border-input bg-card focus:border-accent focus:outline-none transition-colors text-foreground"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handlePodcastLinkSave((e.target as HTMLInputElement).value);
                  }
                }}
                autoFocus
              />
              <button
                onClick={(e) => {
                  const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                  handlePodcastLinkSave(input.value);
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 py-2 rounded-lg transition-all"
              >
                Salvar
              </button>
              <button
                onClick={() => setShowPodcastInput(false)}
                className="text-destructive hover:text-destructive/80"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="bg-muted rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-accent rounded-full p-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-primary">{podcastFile.name}</p>
                <p className="text-xs text-muted-foreground">Áudio guia carregado</p>
              </div>
            </div>
            <button
              onClick={() => setPodcastFile(null)}
              className="text-destructive hover:text-destructive/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="w-full h-20">
            <iframe src={podcastFile.url} className="w-full h-full rounded" allow="autoplay" />
          </div>
        </div>
      )}
    </div>
  );
};
