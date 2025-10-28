import { useState } from 'react';
import { Upload, Link as LinkIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface FluxoAudioUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: () => void;
}

export const FluxoAudioUploadDialog = ({
  open,
  onOpenChange,
  onUploadSuccess,
}: FluxoAudioUploadDialogProps) => {
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [driveLink, setDriveLink] = useState<string>('');
  const [uploadMode, setUploadMode] = useState<'file' | 'link'>('file');

  const resetForm = () => {
    setTitle('');
    setFile(null);
    setDriveLink('');
    setUploadMode('file');
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
        .from('fluxo_audio_files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('fluxo_audio_files')
        .getPublicUrl(filePath);

      const { data: userData } = await supabase.auth.getUser();

      // Get audio duration
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      
      await new Promise((resolve) => {
        audio.onloadedmetadata = () => {
          resolve(null);
        };
      });

      const durationSeconds = Math.floor(audio.duration);

      const { error: insertError } = await supabase
        .from('fluxo_audio_files')
        .insert({
          title: title.trim(),
          file_path: filePath,
          file_url: publicUrl,
          created_by: userData.user?.id,
          duration_seconds: durationSeconds,
        });

      if (insertError) throw insertError;

      toast({
        title: 'Áudio enviado',
        description: 'O áudio foi enviado com sucesso.',
      });

      resetForm();
      onUploadSuccess();
      onOpenChange(false);
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
      // Support multiple Google Drive URL formats
      let fileId = '';
      
      // Try to match /d/ format
      let fileIdMatch = driveLink.match(/\/d\/([^/?]+)/);
      if (fileIdMatch) {
        fileId = fileIdMatch[1];
      } else {
        // Try to match id= format
        fileIdMatch = driveLink.match(/[?&]id=([^&]+)/);
        if (fileIdMatch) {
          fileId = fileIdMatch[1];
        }
      }

      if (!fileId) {
        toast({
          title: 'Link inválido',
          description: 'Por favor, insira um link válido do Google Drive.',
          variant: 'destructive',
        });
        setUploading(false);
        return;
      }

      const directUrl = `https://drive.google.com/uc?id=${fileId}&export=download`;

      const { data: userData } = await supabase.auth.getUser();

      const { error: insertError } = await supabase
        .from('fluxo_audio_files')
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

      resetForm();
      onUploadSuccess();
      onOpenChange(false);
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

  const handleSubmit = () => {
    if (uploadMode === 'file') {
      handleFileUpload();
    } else {
      handleDriveLinkUpload();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Áudio</DialogTitle>
          <DialogDescription>
            Envie um arquivo de áudio do seu computador ou adicione um link do Google Drive.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
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

          <div className="flex gap-2">
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
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Arquivo de Áudio
              </label>
              <input
                type="file"
                accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/aac,audio/m4a,audio/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                disabled={uploading}
              />
              {file && (
                <p className="text-sm text-muted-foreground mt-2">
                  Arquivo selecionado: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Link do Google Drive
              </label>
              <input
                type="text"
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                placeholder="Cole o link do Google Drive aqui"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={uploading || !title.trim() || (uploadMode === 'file' ? !file : !driveLink.trim())}
            className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 text-accent-foreground font-bold px-6 py-3 rounded-lg transition-all"
          >
            {uploading ? 'Enviando...' : 'Adicionar Áudio'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
