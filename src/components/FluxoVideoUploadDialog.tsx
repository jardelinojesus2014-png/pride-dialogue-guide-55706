import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface FluxoVideoUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: () => void;
}

export const FluxoVideoUploadDialog = ({
  open,
  onOpenChange,
  onUploadSuccess,
}: FluxoVideoUploadDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!title.trim() || !selectedVideo || !selectedThumbnail) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Upload vídeo
      const videoExt = selectedVideo.name.split('.').pop();
      const videoFileName = `${Date.now()}_video.${videoExt}`;

      const { error: videoUploadError } = await supabase.storage
        .from('fluxo_videos')
        .upload(videoFileName, selectedVideo);

      if (videoUploadError) throw videoUploadError;

      const { data: videoUrlData } = supabase.storage
        .from('fluxo_videos')
        .getPublicUrl(videoFileName);

      // Upload thumbnail
      const thumbExt = selectedThumbnail.name.split('.').pop();
      const thumbFileName = `${Date.now()}_thumb.${thumbExt}`;

      const { error: thumbUploadError } = await supabase.storage
        .from('fluxo_videos')
        .upload(thumbFileName, selectedThumbnail);

      if (thumbUploadError) throw thumbUploadError;

      const { data: thumbUrlData } = supabase.storage
        .from('fluxo_videos')
        .getPublicUrl(thumbFileName);

      // Insert no banco
      const { error: dbError } = await supabase
        .from('fluxo_videos')
        .insert({
          title: title.trim(),
          description: description.trim(),
          video_url: videoUrlData.publicUrl,
          thumbnail_url: thumbUrlData.publicUrl,
          created_by: user.id,
        });

      if (dbError) throw dbError;

      toast({
        title: 'Vídeo enviado com sucesso!',
        description: `"${title}" foi adicionado.`,
      });

      resetForm();
      onOpenChange(false);
      onUploadSuccess();
    } catch (error: any) {
      console.error('Error uploading video:', error);
      toast({
        title: 'Erro ao enviar vídeo',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedVideo(null);
    setSelectedThumbnail(null);
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
          <DialogTitle>Adicionar Vídeo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fluxo-video-title">Título do Vídeo *</Label>
            <Input
              id="fluxo-video-title"
              placeholder="Ex: Exemplo de Follow-up"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fluxo-video-desc">Descrição</Label>
            <Textarea
              id="fluxo-video-desc"
              placeholder="Descrição do vídeo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isUploading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fluxo-video-file">Arquivo de Vídeo *</Label>
            <Input
              id="fluxo-video-file"
              type="file"
              accept="video/*"
              onChange={(e) => setSelectedVideo(e.target.files?.[0] || null)}
              disabled={isUploading}
            />
            {selectedVideo && (
              <p className="text-sm text-muted-foreground">
                Vídeo: {selectedVideo.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fluxo-video-thumb">Thumbnail (Miniatura) *</Label>
            <Input
              id="fluxo-video-thumb"
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedThumbnail(e.target.files?.[0] || null)}
              disabled={isUploading}
            />
            {selectedThumbnail && (
              <p className="text-sm text-muted-foreground">
                Imagem: {selectedThumbnail.name}
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
              onClick={handleUpload}
              disabled={!title.trim() || !selectedVideo || !selectedThumbnail || isUploading}
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
