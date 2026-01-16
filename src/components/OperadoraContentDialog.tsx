import { useState } from 'react';
import { Video, FileText, Image, Music, Link, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OperadoraContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (
    contentType: 'video' | 'pdf' | 'photo' | 'audio',
    title: string,
    description: string,
    fileOrUrl: File | string
  ) => Promise<void>;
}

export const OperadoraContentDialog = ({ open, onOpenChange, onAdd }: OperadoraContentDialogProps) => {
  const [contentType, setContentType] = useState<'video' | 'pdf' | 'photo' | 'audio'>('video');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [inputMethod, setInputMethod] = useState<'link' | 'upload'>('link');
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setUrl('');
    setFile(null);
    setInputMethod('link');
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    if (inputMethod === 'link' && !url.trim()) return;
    if (inputMethod === 'upload' && !file) return;

    setIsLoading(true);
    try {
      await onAdd(
        contentType,
        title.trim(),
        description.trim(),
        inputMethod === 'link' ? url.trim() : file!
      );
      resetForm();
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getAcceptType = () => {
    switch (contentType) {
      case 'video': return 'video/*';
      case 'pdf': return 'application/pdf';
      case 'photo': return 'image/*';
      case 'audio': return 'audio/*';
      default: return '*/*';
    }
  };

  const contentTypes = [
    { value: 'video', label: 'Vídeo', icon: Video },
    { value: 'pdf', label: 'PDF', icon: FileText },
    { value: 'photo', label: 'Foto', icon: Image },
    { value: 'audio', label: 'Áudio', icon: Music },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Adicionar Conteúdo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Content Type Selection */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Tipo de Conteúdo</Label>
            <div className="grid grid-cols-4 gap-2">
              {contentTypes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setContentType(value)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                    contentType === value
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="content-title">Título *</Label>
            <Input
              id="content-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do conteúdo"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="content-description">Descrição</Label>
            <Textarea
              id="content-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite uma descrição (opcional)"
              rows={2}
            />
          </div>

          {/* Input Method Tabs */}
          <Tabs value={inputMethod} onValueChange={(v) => setInputMethod(v as 'link' | 'upload')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="link" className="flex items-center gap-2">
                <Link className="w-4 h-4" />
                Link
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload
              </TabsTrigger>
            </TabsList>

            <TabsContent value="link" className="mt-4">
              <div>
                <Label htmlFor="content-url">URL do {contentType === 'video' ? 'Vídeo (YouTube, Google Drive)' : contentType === 'audio' ? 'Áudio' : 'Arquivo'}</Label>
                <Input
                  id="content-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={
                    contentType === 'video' 
                      ? 'https://youtube.com/watch?v=... ou Google Drive link'
                      : 'https://...'
                  }
                />
              </div>
            </TabsContent>

            <TabsContent value="upload" className="mt-4">
              <div>
                <Label htmlFor="content-file">Selecionar Arquivo</Label>
                <Input
                  id="content-file"
                  type="file"
                  accept={getAcceptType()}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Arquivo selecionado: {file.name}
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || (inputMethod === 'link' ? !url.trim() : !file) || isLoading}
            className="w-full"
          >
            {isLoading ? 'Adicionando...' : 'Adicionar Conteúdo'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
