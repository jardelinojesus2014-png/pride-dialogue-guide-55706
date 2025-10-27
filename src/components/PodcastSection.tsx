import { useState, useRef } from 'react';
import { Upload, X, Play, Pause, SkipBack, SkipForward, Trash2, Plus } from 'lucide-react';
import { usePodcastLinks } from '@/hooks/usePodcastLinks';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface PodcastSectionProps {
  darkMode: boolean;
}

export const PodcastSection = ({ darkMode }: PodcastSectionProps) => {
  const { podcastLinks, loading, addPodcastLink, deletePodcastLink } = usePodcastLinks();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentPodcast, setCurrentPodcast] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleAddPodcast = async () => {
    if (!title.trim() || !driveLink.trim()) {
      alert('Por favor, preencha o título e o link do Google Drive');
      return;
    }

    let processedUrl = driveLink.trim();
    
    if (processedUrl.includes('drive.google.com/file/d/')) {
      const fileId = processedUrl.match(/\/d\/([^/]+)/)?.[1];
      if (fileId) {
        processedUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      }
    }

    await addPodcastLink(title.trim(), processedUrl);
    setTitle('');
    setDriveLink('');
    setShowAddDialog(false);
  };

  const togglePlayPause = (podcastUrl: string) => {
    if (currentPodcast !== podcastUrl) {
      setCurrentPodcast(podcastUrl);
      setIsPlaying(false);
    }
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const skipTime = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  if (loading || adminLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <div className="bg-card rounded-xl shadow-lg p-6 mb-8 border-2 border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-hero rounded-full p-3 shadow-lg">
              <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black text-primary">🎧 Guia em Áudio do Roteiro</h2>
              <p className="text-sm text-muted-foreground">Podcasts explicando o roteiro</p>
            </div>
          </div>
          {isAdmin && (
            <Button onClick={() => setShowAddDialog(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Podcast
            </Button>
          )}
        </div>

        {podcastLinks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum podcast disponível ainda.</p>
            {isAdmin && (
              <p className="text-sm mt-1">Clique no botão acima para adicionar o primeiro podcast.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {podcastLinks.map((podcast) => (
              <div key={podcast.id} className="bg-muted rounded-lg p-4 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-accent rounded-full p-2">
                      <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-primary">{podcast.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(podcast.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  {isAdmin && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteId(podcast.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="space-y-3">
                  <audio
                    ref={currentPodcast === podcast.url ? audioRef : undefined}
                    src={podcast.url}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                  
                  <audio
                    src={podcast.url}
                    controls
                    className="w-full rounded-lg"
                  />
                  
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => skipTime(-10)}
                        className="bg-primary/10 hover:bg-primary/20 text-primary p-2 rounded-lg transition-colors"
                        title="Voltar 10s"
                      >
                        <SkipBack className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => togglePlayPause(podcast.url)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-lg transition-colors"
                        title={isPlaying && currentPodcast === podcast.url ? 'Pausar' : 'Reproduzir'}
                      >
                        {isPlaying && currentPodcast === podcast.url ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => skipTime(10)}
                        className="bg-primary/10 hover:bg-primary/20 text-primary p-2 rounded-lg transition-colors"
                        title="Avançar 10s"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">Velocidade:</span>
                      {speeds.map((speed) => (
                        <button
                          key={speed}
                          onClick={() => handleSpeedChange(speed)}
                          className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                            playbackSpeed === speed
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted hover:bg-muted/80 text-foreground'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Podcast do Google Drive</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="podcast-title">Título do Podcast *</Label>
              <Input
                id="podcast-title"
                placeholder="Ex: Guia do Roteiro Pride"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="drive-link">Link do Google Drive *</Label>
              <Input
                id="drive-link"
                placeholder="https://drive.google.com/file/d/..."
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Certifique-se que o link é público
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setShowAddDialog(false);
                  setTitle('');
                  setDriveLink('');
                }}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddPodcast}
                disabled={!title.trim() || !driveLink.trim()}
                className="flex-1 gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir podcast?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O podcast será permanentemente removido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  deletePodcastLink(deleteId);
                  setDeleteId(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
