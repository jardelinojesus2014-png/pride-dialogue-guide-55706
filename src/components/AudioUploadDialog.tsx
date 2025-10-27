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

interface AudioUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionId: string;
  onUpload: (title: string, audioBlob: Blob, durationSeconds?: number) => Promise<void>;
}

export const AudioUploadDialog = ({
  open,
  onOpenChange,
  sectionId,
  onUpload,
}: AudioUploadDialogProps) => {
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [driveLink, setDriveLink] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'record' | 'upload' | 'drive'>('record');

  const handleRecordingComplete = async (audioBlob: Blob, durationSeconds: number) => {
    if (!title.trim()) {
      alert('Por favor, dê um título para o áudio');
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(title, audioBlob, durationSeconds);
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Error uploading recording:', error);
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
      await onUpload(title, selectedFile);
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDriveLinkUpload = async () => {
    if (!title.trim() || !driveLink.trim()) {
      alert('Por favor, preencha o título e o link do Google Drive');
      return;
    }

    setIsUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Erro',
          description: 'Você precisa estar autenticado',
          variant: 'destructive',
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('download-from-drive', {
        body: {
          driveLink: driveLink.trim(),
          title: title.trim(),
          type: 'audio',
          sectionId,
        },
      });

      if (error) {
        console.error('Error:', error);
        toast({
          title: 'Erro ao importar do Google Drive',
          description: error.message || 'Verifique se o link é público e permite download',
          variant: 'destructive',
        });
        return;
      }

      if (!data?.success) {
        toast({
          title: 'Erro ao importar',
          description: data?.error || 'Erro desconhecido',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Áudio importado com sucesso!',
        description: `"${title}" foi adicionado.`,
      });

      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error uploading from Drive:', error);
      toast({
        title: 'Erro ao importar do Google Drive',
        description: error.message || 'Verifique o link e as permissões.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSelectedFile(null);
    setDriveLink('');
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
          <DialogTitle>Adicionar Áudio</DialogTitle>
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

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'record' | 'upload' | 'drive')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="record">Gravar</TabsTrigger>
              <TabsTrigger value="upload">Upload PC</TabsTrigger>
              <TabsTrigger value="drive">Google Drive</TabsTrigger>
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
                <div className="flex items-center gap-2">
                  <Input
                    id="audio-file"
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    disabled={isUploading}
                    className="flex-1"
                  />
                </div>
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

            <TabsContent value="drive" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="drive-link-audio">Link do Google Drive</Label>
                <Input
                  id="drive-link-audio"
                  placeholder="https://drive.google.com/file/d/..."
                  value={driveLink}
                  onChange={(e) => setDriveLink(e.target.value)}
                  disabled={isUploading}
                />
                <p className="text-xs text-muted-foreground">
                  O arquivo será baixado do Google Drive e salvo automaticamente
                </p>
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
                  onClick={handleDriveLinkUpload}
                  disabled={!title.trim() || !driveLink.trim() || isUploading}
                  className="flex-1 gap-2"
                >
                  {isUploading ? 'Importando...' : (
                    <>
                      <Upload className="w-4 h-4" />
                      Importar do Drive
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
