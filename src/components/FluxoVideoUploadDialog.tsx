import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Usuário não autenticado');
      }

      // Upload video
      const videoPath = `${session.user.id}/${Date.now()}_${selectedVideo.name}`;
      const { data: videoData, error: videoError } = await supabase.storage
        .from('fluxo_videos')
        .upload(videoPath, selectedVideo);

      if (videoError) throw videoError;

      // Upload thumbnail
      const thumbnailPath = `${session.user.id}/${Date.now()}_${selectedThumbnail.name}`;
      const { data: thumbnailData, error: thumbnailError } = await supabase.storage
        .from('fluxo_videos')
        .upload(thumbnailPath, selectedThumbnail);

      if (thumbnailError) throw thumbnailError;

      // Get public URLs
      const { data: { publicUrl: videoUrl } } = supabase.storage
        .from('fluxo_videos')
        .getPublicUrl(videoData.path);

      const { data: { publicUrl: thumbnailUrl } } = supabase.storage
        .from('fluxo_videos')
        .getPublicUrl(thumbnailData.path);

      // Insert into database
      const { error: dbError } = await supabase
        .from('fluxo_videos')
        .insert({
          title: title.trim(),
          description: description.trim(),
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          created_by: session.user.id,
        });

      if (dbError) throw dbError;

      toast({
        title: 'Vídeo enviado com sucesso!',
        description: `"${title}" foi adicionado.`,
      });

      resetForm();
      onUploadSuccess();
      onOpenChange(false);
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
          <DialogTitle>Adicionar Vídeo - Fluxo de Atendimento</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video-title">Título do Vídeo *</Label>
            <Input
              id="video-title"
              placeholder="Ex: Guia Completo do Fluxo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-description">Descrição</Label>
            <Textarea
              id="video-description"
              placeholder="Descreva o conteúdo do vídeo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isUploading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-file">Arquivo de Vídeo *</Label>
            <Input
              id="video-file"
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
            <Label htmlFor="thumbnail-file">Miniatura (Thumbnail) *</Label>
            <Input
              id="thumbnail-file"
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedThumbnail(e.target.files?.[0] || null)}
              disabled={isUploading}
            />
            {selectedThumbnail && (
              <p className="text-sm text-muted-foreground">
                Miniatura: {selectedThumbnail.name}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
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
