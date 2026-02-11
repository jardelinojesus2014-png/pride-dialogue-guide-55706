import { useState } from 'react';
import { Paperclip, Plus, Trash2, Music, Video, FileText, Upload, Link as LinkIcon } from 'lucide-react';
import { useCadenciaAttachments, CadenciaAttachment } from '@/hooks/useCadenciaAttachments';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { toast } from '@/hooks/use-toast';

interface CadenciaItemAttachmentsProps {
  cadenciaItemId: string;
  isAdmin: boolean;
}

const typeIcons = {
  audio: Music,
  video: Video,
  pdf: FileText,
};

const typeLabels = {
  audio: 'Áudio',
  video: 'Vídeo',
  pdf: 'PDF',
};

export const CadenciaItemAttachments = ({ cadenciaItemId, isAdmin }: CadenciaItemAttachmentsProps) => {
  const { attachments, isLoading, addAttachment, deleteAttachment, isAdding } = useCadenciaAttachments(cadenciaItemId);
  const [showDialog, setShowDialog] = useState(false);
  const [attachmentType, setAttachmentType] = useState<'audio' | 'video' | 'pdf'>('audio');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const resetForm = () => {
    setTitle('');
    setFile(null);
    setVideoUrl('');
    setAttachmentType('audio');
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({ title: 'Título obrigatório', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      if (attachmentType === 'video') {
        // Video uses URL (YouTube, etc.)
        if (!videoUrl.trim()) {
          toast({ title: 'URL do vídeo obrigatória', variant: 'destructive' });
          setUploading(false);
          return;
        }
        addAttachment({
          cadencia_item_id: cadenciaItemId,
          attachment_type: 'video',
          title: title.trim(),
          file_url: videoUrl.trim(),
        });
      } else {
        // Audio/PDF uses file upload
        if (!file) {
          toast({ title: 'Arquivo obrigatório', variant: 'destructive' });
          setUploading(false);
          return;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${cadenciaItemId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('cadencia_attachments')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('cadencia_attachments')
          .getPublicUrl(fileName);

        let durationSeconds: number | undefined;
        if (attachmentType === 'audio') {
          try {
            const audio = new Audio();
            audio.src = URL.createObjectURL(file);
            await new Promise((resolve) => {
              audio.onloadedmetadata = () => resolve(null);
              audio.onerror = () => resolve(null);
            });
            durationSeconds = Math.floor(audio.duration) || undefined;
          } catch {}
        }

        addAttachment({
          cadencia_item_id: cadenciaItemId,
          attachment_type: attachmentType,
          title: title.trim(),
          file_url: publicUrl,
          file_path: fileName,
          duration_seconds: durationSeconds,
        });
      }

      resetForm();
      setShowDialog(false);
    } catch (error: any) {
      toast({ title: 'Erro no upload', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (attachment: CadenciaAttachment) => {
    if (confirm(`Excluir "${attachment.title}"?`)) {
      deleteAttachment(attachment);
    }
  };

  const getAcceptType = () => {
    if (attachmentType === 'audio') return 'audio/*';
    if (attachmentType === 'pdf') return 'application/pdf';
    return '*/*';
  };

  // Render attachments for all users
  if (attachments.length === 0 && !isAdmin) return null;

  return (
    <div className="mt-3">
      {attachments.length > 0 && (
        <div className="space-y-2 mb-2">
          {attachments.map((att) => {
            const Icon = typeIcons[att.attachment_type];
            return (
              <div key={att.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg border border-border text-sm">
                <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-xs font-medium text-muted-foreground uppercase">{typeLabels[att.attachment_type]}</span>
                {att.attachment_type === 'audio' ? (
                  <audio controls className="h-8 flex-1 max-w-[250px]" preload="none">
                    <source src={att.file_url} />
                  </audio>
                ) : att.attachment_type === 'video' ? (
                  <a href={att.file_url} target="_blank" rel="noopener noreferrer" className="text-primary underline truncate flex-1">
                    {att.title}
                  </a>
                ) : (
                  <a href={att.file_url} target="_blank" rel="noopener noreferrer" className="text-primary underline truncate flex-1">
                    {att.title}
                  </a>
                )}
                {att.attachment_type === 'audio' && (
                  <span className="text-muted-foreground text-xs truncate">{att.title}</span>
                )}
                {isAdmin && (
                  <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => handleDelete(att)}>
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {isAdmin && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1"
            onClick={() => setShowDialog(true)}
          >
            <Paperclip className="w-3 h-3" />
            Anexar Mídia
          </Button>

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Anexar Mídia ao Item</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex gap-2">
                  {(['audio', 'video', 'pdf'] as const).map((type) => {
                    const Icon = typeIcons[type];
                    return (
                      <button
                        key={type}
                        onClick={() => setAttachmentType(type)}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-1 ${
                          attachmentType === type
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {typeLabels[type]}
                      </button>
                    );
                  })}
                </div>

                <div>
                  <Label>Título *</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título do anexo"
                  />
                </div>

                {attachmentType === 'video' ? (
                  <div>
                    <Label>URL do Vídeo (YouTube, etc.)</Label>
                    <Input
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                ) : (
                  <div>
                    <Label>Arquivo ({typeLabels[attachmentType]})</Label>
                    <input
                      type="file"
                      accept={getAcceptType()}
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer"
                    />
                    {file && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => { resetForm(); setShowDialog(false); }}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={uploading || isAdding || !title.trim()}
                  >
                    {uploading || isAdding ? 'Enviando...' : 'Adicionar'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};
