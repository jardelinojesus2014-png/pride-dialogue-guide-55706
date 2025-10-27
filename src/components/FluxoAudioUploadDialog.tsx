import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { AudioRecorder } from './AudioRecorder';
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
  const [activeTab, setActiveTab] = useState<'record' | 'upload'>('record');

  const uploadToDatabase = async (audioBlob: Blob, fileName: string, durationSeconds?: number) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Usuário não autenticado');
    }

    const filePath = `${session.user.id}/${Date.now()}_${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('fluxo_audio_files')
      .upload(filePath, audioBlob);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('fluxo_audio_files')
      .getPublicUrl(uploadData.path);

    const { error: dbError } = await supabase
      .from('fluxo_audio_files')
      .insert({
        title: title.trim(),
        file_url: publicUrl,
        file_path: uploadData.path,
        duration_seconds: durationSeconds || 0,
        created_by: session.user.id,
      });

    if (dbError) throw dbError;
  };

  const handleRecordingComplete = async (audioBlob: Blob, durationSeconds: number) => {
    if (!title.trim()) {
      alert('Por favor, dê um título para o áudio');
      return;
    }

    setIsUploading(true);
    try {
      await uploadToDatabase(audioBlob, `${title}.webm`, durationSeconds);
      
      toast({
        title: 'Áudio gravado com sucesso!',
        description: `"${title}" foi adicionado.`,
      });

      resetForm();
      onUploadSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error uploading recording:', error);
      toast({
        title: 'Erro ao gravar áudio',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!title.trim() || !selectedFile) {
      alert('Por favor, preencha o título e selecione um arquivo');
      return;
    }

    setIsUploading(true);
    try {
      await uploadToDatabase(selectedFile, selectedFile.name);
      
      toast({
        title: 'Áudio enviado com sucesso!',
        description: `"${title}" foi adicionado.`,
      });

      resetForm();
      onUploadSuccess();
      onOpenChange(false);
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
    setActiveTab('record');
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
          <DialogTitle>Adicionar Áudio - Fluxo de Atendimento</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="audio-title">Título do Áudio *</Label>
            <Input
              id="audio-title"
              placeholder="Ex: Apresentação - Versão 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
            />
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'record' | 'upload')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="record">Gravar</TabsTrigger>
              <TabsTrigger value="upload">Upload PC</TabsTrigger>
            </TabsList>

            <TabsContent value="record" className="mt-4">
              <AudioRecorder
                onRecordingComplete={handleRecordingComplete}
                onCancel={() => handleOpenChange(false)}
              />
            </TabsContent>

            <TabsContent value="upload" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="audio-file">Arquivo de Áudio</Label>
                <Input
                  id="audio-file"
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
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
