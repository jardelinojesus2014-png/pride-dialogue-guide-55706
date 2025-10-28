import { useState, useEffect, useRef } from 'react';
import { Trash2, Play, Pause, Upload, Music } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { toast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { FluxoAudioUploadDialog } from './FluxoAudioUploadDialog';

interface FluxoAudioFile {
  id: string;
  title: string;
  file_url: string;
  created_at: string;
}

interface FluxoAudioSectionProps {
  darkMode: boolean;
}

export const FluxoAudioSection = ({ darkMode }: FluxoAudioSectionProps) => {
  const [audioFiles, setAudioFiles] = useState<FluxoAudioFile[]>([]);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isAdmin, loading: adminLoading } = useIsAdmin();

  useEffect(() => {
    loadAudioFiles();
  }, []);

  const loadAudioFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('fluxo_audio_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAudioFiles(data || []);
    } catch (error: any) {
      console.error('Error loading audio files:', error);
      toast({
        title: 'Erro ao carregar áudios',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handlePlayPause = (audioUrl: string) => {
    if (playingAudio === audioUrl) {
      audioRef.current?.pause();
      setPlayingAudio(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.play();
        setPlayingAudio(audioUrl);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSpeedChange = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDeleteAudio = async (id: string, fileUrl: string) => {
    if (!confirm('Tem certeza que deseja excluir este áudio?')) return;

    try {
      const fileName = fileUrl.split('/').pop();
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('fluxo_audio_files')
          .remove([fileName]);
        if (storageError) throw storageError;
      }

      const { error: dbError } = await supabase
        .from('fluxo_audio_files')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      toast({
        title: 'Áudio excluído',
        description: 'O áudio foi removido com sucesso.',
      });

      loadAudioFiles();
    } catch (error: any) {
      console.error('Error deleting audio:', error);
      toast({
        title: 'Erro ao excluir áudio',
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
            <Music className="w-6 h-6 text-primary-foreground" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-primary">
            Áudios de Treinamento
          </h2>
        </div>
        {!adminLoading && isAdmin && (
          <button
            onClick={() => setUploadDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Upload className="w-5 h-5" />
            <span className="hidden sm:inline">Adicionar Áudio</span>
          </button>
        )}
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setPlayingAudio(null)}
      />

      {audioFiles.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          Nenhum áudio disponível ainda.
        </p>
      ) : (
        <div className="space-y-4">
          {audioFiles.map((audio) => (
            <div
              key={audio.id}
              className="bg-muted/50 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <h3 className="font-bold text-lg text-foreground mb-1">
                  {audio.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(audio.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePlayPause(audio.file_url)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full transition-all duration-300 hover:scale-110"
                >
                  {playingAudio === audio.file_url ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>

                {playingAudio === audio.file_url && (
                  <>
                    <div className="text-sm text-muted-foreground">
                      {formatTime(currentTime)}
                    </div>
                    <button
                      onClick={handleSpeedChange}
                      className="bg-accent hover:bg-accent/90 text-accent-foreground px-3 py-1 rounded-full font-bold text-sm transition-all duration-300"
                    >
                      {playbackSpeed}x
                    </button>
                    <div className="text-sm text-muted-foreground">
                      {formatTime(duration)}
                    </div>
                  </>
                )}

                {!adminLoading && isAdmin && (
                  <button
                    onClick={() => handleDeleteAudio(audio.id, audio.file_url)}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground p-2 rounded-full transition-all duration-300 hover:scale-110"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {uploadDialogOpen && (
        <FluxoAudioUploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          onUploadSuccess={loadAudioFiles}
        />
      )}
    </section>
  );
};
