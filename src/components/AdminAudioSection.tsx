import { useState, useEffect, useRef } from 'react';
import { Trash2, Play, Pause, Upload, Music } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { toast } from '@/hooks/use-toast';
import { AdminAudioUploadDialog } from '@/components/AdminAudioUploadDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Audio {
  id: string;
  title: string;
  file_url: string;
  duration_seconds: number | null;
  created_at: string;
}

interface AdminAudioSectionProps {
  darkMode: boolean;
  userViewMode?: boolean;
}

export const AdminAudioSection = ({ darkMode, userViewMode = false }: AdminAudioSectionProps) => {
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const effectiveIsAdmin = isAdmin && !userViewMode;
  const [audios, setAudios] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentTimes, setCurrentTimes] = useState<{ [key: string]: number }>({});
  const [playbackRates, setPlaybackRates] = useState<{ [key: string]: number }>({});
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    loadAudios();
  }, []);

  const loadAudios = async () => {
    try {
      const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAudios(data || []);
    } catch (error) {
      console.error('Error loading audios:', error);
      toast({
        title: 'Erro ao carregar áudios',
        description: 'Não foi possível carregar os áudios.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('podcasts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Áudio excluído',
        description: 'O áudio foi excluído com sucesso.',
      });

      loadAudios();
    } catch (error) {
      console.error('Error deleting audio:', error);
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir o áudio.',
        variant: 'destructive',
      });
    }
    setDeleteId(null);
  };

  const togglePlay = (audio: Audio) => {
    const audioElement = audioRefs.current[audio.id];
    
    if (playingId === audio.id) {
      audioElement?.pause();
      setPlayingId(null);
    } else {
      Object.values(audioRefs.current).forEach(audio => audio?.pause());
      audioElement?.play();
      setPlayingId(audio.id);
    }
  };

  const handleTimeUpdate = (audioId: string, currentTime: number) => {
    setCurrentTimes(prev => ({ ...prev, [audioId]: currentTime }));
  };

  const handleSeek = (audioId: string, newTime: number) => {
    const audioElement = audioRefs.current[audioId];
    if (audioElement) {
      audioElement.currentTime = newTime;
      setCurrentTimes(prev => ({ ...prev, [audioId]: newTime }));
    }
  };

  const changePlaybackRate = (audioId: string) => {
    const currentRate = playbackRates[audioId] || 1;
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    const currentIndex = rates.indexOf(currentRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    
    const audioElement = audioRefs.current[audioId];
    if (audioElement) {
      audioElement.playbackRate = nextRate;
      setPlaybackRates(prev => ({ ...prev, [audioId]: nextRate }));
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (adminLoading || loading) {
    return (
      <section className="bg-card rounded-lg shadow-xl p-6 sm:p-8 mb-6">
        <h2 className="text-2xl sm:text-3xl font-black text-primary mb-4">
          🎵 Áudios de Treinamento
        </h2>
        <p className="text-muted-foreground">Carregando...</p>
      </section>
    );
  }

  return (
    <section className="p-6">
      <div className="flex items-center justify-between mb-6">
        {effectiveIsAdmin && (
          <button
            onClick={() => setUploadDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg ml-auto"
          >
            <Upload className="w-5 h-5" />
            Adicionar Áudio
          </button>
        )}
      </div>

      <div className="space-y-4">
        {audios.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhum áudio disponível no momento.
          </p>
        ) : (
          audios.map((audio) => {
            const currentTime = currentTimes[audio.id] || 0;
            const duration = audio.duration_seconds || 0;
            const playbackRate = playbackRates[audio.id] || 1;
            
            return (
              <div
                key={audio.id}
                className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground text-lg">{audio.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(audio.created_at)}
                    </p>
                  </div>
                  {effectiveIsAdmin && (
                    <button
                      onClick={() => setDeleteId(audio.id)}
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground p-2 rounded-lg transition-all ml-3"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => togglePlay(audio)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full transition-all"
                    >
                      {playingId === audio.id ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1">
                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={(e) => handleSeek(audio.id, Number(e.target.value))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => changePlaybackRate(audio.id)}
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-3 py-2 rounded-lg font-semibold text-sm transition-all min-w-[60px]"
                    >
                      {playbackRate}x
                    </button>
                  </div>

                  <audio
                    ref={(el) => {
                      if (el) {
                        audioRefs.current[audio.id] = el;
                        el.playbackRate = playbackRate;
                      }
                    }}
                    src={audio.file_url}
                    onTimeUpdate={(e) => handleTimeUpdate(audio.id, e.currentTarget.currentTime)}
                    onEnded={() => setPlayingId(null)}
                    onLoadedMetadata={(e) => {
                      if (!audio.duration_seconds) {
                        const duration = Math.floor(e.currentTarget.duration);
                        supabase
                          .from('podcasts')
                          .update({ duration_seconds: duration })
                          .eq('id', audio.id)
                          .then(() => loadAudios());
                      }
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <AdminAudioUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadComplete={loadAudios}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este áudio? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};
