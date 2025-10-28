import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async () => {
    if (!title.trim() || !selectedFile) {
      alert('Por favor, preencha o título e selecione um arquivo');
      return;
    }

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('fluxo_audio_files')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('fluxo_audio_files')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('fluxo_audio_files')
        .insert({
          title: title.trim(),
          file_url: urlData.publicUrl,
          file_path: filePath,
          created_by: user.id,
        });

      if (dbError) throw dbError;

      toast({
        title: 'Áudio enviado com sucesso!',
        description: `"${title}" foi adicionado.`,
      });

      resetForm();
      onOpenChange(false);
      onUploadSuccess();
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Erro ao enviar áudio',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSelectedFile(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isUploading) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Áudio</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fluxo-audio-title">Título do Áudio *</Label>
            <Input
              id="fluxo-audio-title"
              placeholder="Ex: Cadência de Follow-up"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fluxo-audio-file">Arquivo de Áudio</Label>
            <Input
              id="fluxo-audio-file"
              type="file"
              accept="audio/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              disabled={isUploading}
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Arquivo selecionado: {selectedFile.name}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => handleOpenChange(false)}
              variant="outline"
              className="flex-1"
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleFileUpload}
              disabled={!title.trim() || !selectedFile || isUploading}
              className="flex-1 gap-2"
            >
              {isUploading ? (
                <>Enviando...</>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Fazer Upload
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
