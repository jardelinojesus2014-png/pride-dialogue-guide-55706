import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, Upload, Link as LinkIcon, Trash2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface HowToUseVideo {
  id: string;
  video_url: string;
  title: string;
  description: string | null;
  created_at: string;
}

interface HowToUseVideoDialogProps {
  isAdmin: boolean;
}

export const HowToUseVideoDialog = ({ isAdmin }: HowToUseVideoDialogProps) => {
  const [video, setVideo] = useState<HowToUseVideo | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('Como usar a ferramenta');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'file'>('link');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadVideo();
  }, []);

  const loadVideo = async () => {
    try {
      const { data, error } = await supabase
        .from('how_to_use_video')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setVideo(data);
    } catch (error) {
      console.error('Error loading tutorial video:', error);
    }
  };

  const formatLoomUrl = (url: string): string => {
    const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
    if (loomMatch) {
      return `https://www.loom.com/embed/${loomMatch[1]}`;
    }
    
    const googleDriveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (googleDriveMatch) {
      return `https://drive.google.com/file/d/${googleDriveMatch[1]}/preview`;
    }
    
    return url;
  };

  const saveVideoLink = async () => {
    if (!videoUrl.trim() || !title.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o título e a URL do vídeo.",
        variant: "destructive"
      });
      return;
    }

    try {
      const formattedUrl = formatLoomUrl(videoUrl);
      
      // Delete existing video if any
      if (video) {
        await supabase
          .from('how_to_use_video')
          .delete()
          .eq('id', video.id);
      }

      const { error } = await supabase
        .from('how_to_use_video')
        .insert({
          video_url: formattedUrl,
          title: title.trim(),
          description: description.trim() || null
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Vídeo tutorial salvo com sucesso."
      });

      resetForm();
      await loadVideo();
    } catch (error) {
      console.error('Error saving video:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o vídeo.",
        variant: "destructive"
      });
    }
  };

  const uploadVideoFile = async () => {
    if (!selectedFile || !title.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione um arquivo e preencha o título.",
        variant: "destructive"
      });
      return;
    }

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (selectedFile.size > maxSize) {
      toast({
        title: "Arquivo muito grande",
        description: "O vídeo deve ter no máximo 50MB.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `tutorial-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('tutorial-videos')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('tutorial-videos')
        .getPublicUrl(filePath);

      // Delete existing video if any
      if (video) {
        await supabase
          .from('how_to_use_video')
          .delete()
          .eq('id', video.id);
      }

      const { error: dbError } = await supabase
        .from('how_to_use_video')
        .insert({
          video_url: publicUrl,
          title: title.trim(),
          description: description.trim() || null
        });

      if (dbError) throw dbError;

      toast({
        title: "Sucesso!",
        description: "Vídeo tutorial enviado com sucesso."
      });

      resetForm();
      await loadVideo();
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o vídeo.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteVideo = async () => {
    if (!video) return;

    if (!confirm('Tem certeza que deseja excluir este vídeo tutorial?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('how_to_use_video')
        .delete()
        .eq('id', video.id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Vídeo tutorial excluído."
      });

      setVideo(null);
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o vídeo.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setTitle('Como usar a ferramenta');
    setDescription('');
    setVideoUrl('');
    setSelectedFile(null);
    setActiveTab('link');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-accent hover:bg-primary/20"
          title="Como usar a ferramenta"
        >
          <HelpCircle className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-primary">
            Como usar a ferramenta
          </DialogTitle>
        </DialogHeader>

        {video && !showForm ? (
          <div className="space-y-4">
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
              {video.video_url.includes('loom.com') || video.video_url.includes('youtube.com') || video.video_url.includes('drive.google.com') ? (
                <iframe
                  src={video.video_url}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={video.video_url}
                  controls
                  className="w-full h-full"
                  controlsList="nodownload"
                />
              )}
            </div>
            
            <div>
              <h3 className="font-bold text-lg">{video.title}</h3>
              {video.description && (
                <p className="text-muted-foreground mt-2">{video.description}</p>
              )}
            </div>

            {isAdmin && (
              <div className="flex gap-2 justify-end">
                <Button
                  onClick={() => setShowForm(true)}
                  variant="outline"
                >
                  Alterar Vídeo
                </Button>
                <Button
                  onClick={deleteVideo}
                  variant="destructive"
                  size="icon"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        ) : !video && !isAdmin ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum vídeo tutorial disponível no momento.
          </div>
        ) : (
          <div className="space-y-4">
            {isAdmin && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Título</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título do vídeo"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição (opcional)</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição do vídeo"
                    rows={3}
                  />
                </div>

                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'link' | 'file')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="link" className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      Link do Vídeo
                    </TabsTrigger>
                    <TabsTrigger value="file" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload do PC
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="link" className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">URL do Vídeo</label>
                      <Input
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="Cole o link do Loom, YouTube ou Google Drive"
                      />
                      <p className="text-xs text-muted-foreground">
                        Suporta links do Loom, YouTube e Google Drive
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={saveVideoLink} className="flex-1">
                        Salvar Vídeo
                      </Button>
                      {video && (
                        <Button onClick={resetForm} variant="outline">
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="file" className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Arquivo de Vídeo</label>
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Limite: 50MB. Formatos: MP4, MOV, AVI, etc.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={uploadVideoFile} 
                        disabled={uploading}
                        className="flex-1"
                      >
                        {uploading ? 'Enviando...' : 'Enviar Vídeo'}
                      </Button>
                      {video && (
                        <Button onClick={resetForm} variant="outline">
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
