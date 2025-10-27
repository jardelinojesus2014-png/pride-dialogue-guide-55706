import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { AudioRecorder } from './AudioRecorder';
import { Upload } from 'lucide-react';

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
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'record' | 'upload'>('record');

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

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'record' | 'upload')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="record">Gravar Áudio</TabsTrigger>
              <TabsTrigger value="upload">Fazer Upload</TabsTrigger>
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
                <p className="text-xs text-muted-foreground">
                  Dica: Para arquivos do Google Drive, baixe-os primeiro e depois faça upload aqui
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
