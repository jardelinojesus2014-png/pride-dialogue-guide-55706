import { Play, Pause, Trash2, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { UserAudioFile } from '@/hooks/useUserAudioFiles';
import { useState, useRef } from 'react';
import { useIsAdmin } from '@/hooks/useIsAdmin';
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

interface AudioFilesListProps {
  audioFiles: UserAudioFile[];
  onDelete: (id: string) => void;
}

export const AudioFilesList = ({ audioFiles, onDelete }: AudioFilesListProps) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const isAdmin = useIsAdmin();

  const togglePlay = (audioFile: UserAudioFile) => {
    const audio = audioRefs.current[audioFile.id];

    if (!audio) {
      const newAudio = new Audio(audioFile.file_url);
      audioRefs.current[audioFile.id] = newAudio;
      
      newAudio.onended = () => setPlayingId(null);
      newAudio.play();
      setPlayingId(audioFile.id);
    } else {
      if (playingId === audioFile.id) {
        audio.pause();
        setPlayingId(null);
      } else {
        audio.play();
        setPlayingId(audioFile.id);
      }
    }

    // Pause other audios
    Object.entries(audioRefs.current).forEach(([id, audio]) => {
      if (id !== audioFile.id && !audio.paused) {
        audio.pause();
      }
    });
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (audioFiles.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhum áudio gravado ainda.</p>
        <p className="text-sm mt-1">Clique no botão acima para adicionar seu primeiro áudio.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {audioFiles.map((audioFile) => (
          <div
            key={audioFile.id}
            className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Button
              size="sm"
              variant="ghost"
              onClick={() => togglePlay(audioFile)}
              className="flex-shrink-0"
            >
              {playingId === audioFile.id ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{audioFile.title}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(audioFile.duration_seconds)}
                </span>
                <span>{formatDate(audioFile.created_at)}</span>
              </div>
            </div>

            {isAdmin && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setDeleteId(audioFile.id)}
                className="flex-shrink-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir áudio?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O arquivo de áudio será permanentemente removido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId);
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
