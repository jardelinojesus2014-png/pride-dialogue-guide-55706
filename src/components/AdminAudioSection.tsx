import { useState, useEffect, useRef } from 'react';
import { Trash2, Upload, Link as LinkIcon, Play, Pause } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { toast } from '@/hooks/use-toast';
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
}

export const AdminAudioSection = ({ darkMode }: AdminAudioSectionProps) => {
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [audios, setAudios] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [driveLink, setDriveLink] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'link'>('file');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
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

  const handleFileUpload = async () => {
    if (!title.trim()) {
      toast({
        title: 'Título obrigatório',
        description: 'Por favor, insira um título para o áudio.',
        variant: 'destructive',
      });
      return;
    }

    if (!file) {
      toast({
        title: 'Arquivo necessário',
        description: 'Por favor, selecione um arquivo de áudio.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('audio-files')
        .getPublicUrl(filePath);

      const { data: userData } = await supabase.auth.getUser();

      const { error: insertError } = await supabase
        .from('podcasts')
        .insert({
          title: title.trim(),
          file_path: filePath,
          file_url: publicUrl,
          created_by: userData.user?.id,
        });

      if (insertError) throw insertError;

      toast({
        title: 'Áudio enviado',
        description: 'O áudio foi enviado com sucesso.',
      });

      setTitle('');
      setFile(null);
      loadAudios();
    } catch (error) {
      console.error('Error uploading audio:', error);
      toast({
        title: 'Erro no upload',
        description: 'Não foi possível enviar o áudio.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDriveLinkUpload = async () => {
    if (!title.trim()) {
      toast({
        title: 'Título obrigatório',
        description: 'Por favor, insira um título para o áudio.',
        variant: 'destructive',
      });
      return;
    }

    if (!driveLink.trim()) {
      toast({
        title: 'Link necessário',
        description: 'Por favor, insira um link do Google Drive.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const fileIdMatch = driveLink.match(/\/d\/([^/]+)/);
      if (!fileIdMatch) {
        throw new Error('Link do Google Drive inválido');
      }

      const fileId = fileIdMatch[1];
      const directUrl = `https://drive.google.com/uc?id=${fileId}&export=download`;

      const { data: userData } = await supabase.auth.getUser();

      const { error: insertError } = await supabase
        .from('podcasts')
        .insert({
          title: title.trim(),
          file_path: driveLink,
          file_url: directUrl,
          created_by: userData.user?.id,
        });

      if (insertError) throw insertError;

      toast({
        title: 'Áudio adicionado',
        description: 'O link do áudio foi adicionado com sucesso.',
      });

      setTitle('');
      setDriveLink('');
      loadAudios();
    } catch (error) {
      console.error('Error adding drive link:', error);
      toast({
        title: 'Erro ao adicionar link',
        description: 'Não foi possível adicionar o link do áudio.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
    <section className="bg-card rounded-lg shadow-xl p-6 sm:p-8 mb-6">
      <h2 className="text-2xl sm:text-3xl font-black text-primary mb-4">
        🎵 Áudios de Treinamento
      </h2>

      {isAdmin && (
        <div className="mb-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
          <h3 className="text-lg font-bold text-accent mb-3">Adicionar Novo Áudio</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Título do Áudio *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do áudio"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
            />
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setUploadMode('file')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                uploadMode === 'file'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Upload de Arquivo
            </button>
            <button
              onClick={() => setUploadMode('link')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                uploadMode === 'link'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <LinkIcon className="w-4 h-4 inline mr-2" />
              Link do Google Drive
            </button>
          </div>

          {uploadMode === 'file' ? (
            <div className="space-y-3">
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
              />
              <button
                onClick={handleFileUpload}
                disabled={uploading || !title.trim() || !file}
                className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 text-accent-foreground font-bold px-6 py-3 rounded-lg transition-all"
              >
                {uploading ? 'Enviando...' : 'Enviar Áudio'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                placeholder="Cole o link do Google Drive aqui"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
              />
              <button
                onClick={handleDriveLinkUpload}
                disabled={uploading || !title.trim() || !driveLink.trim()}
                className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 text-accent-foreground font-bold px-6 py-3 rounded-lg transition-all"
              >
                {uploading ? 'Adicionando...' : 'Adicionar Link'}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        {audios.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhum áudio disponível no momento.
          </p>
        ) : (
          audios.map((audio) => (
            <div
              key={audio.id}
              className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <button
                onClick={() => togglePlay(audio)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full transition-all"
              >
                {playingId === audio.id ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>

              <audio
                ref={(el) => {
                  if (el) audioRefs.current[audio.id] = el;
                }}
                src={audio.file_url}
                onEnded={() => setPlayingId(null)}
              />

              <div className="flex-1">
                <h4 className="font-bold text-foreground">{audio.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {formatDate(audio.created_at)} • {formatDuration(audio.duration_seconds)}
                </p>
              </div>

              {isAdmin && (
                <button
                  onClick={() => setDeleteId(audio.id)}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground p-2 rounded-lg transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

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
