import { useState } from 'react';
import { Trash2, Save, X, ChevronUp, ChevronDown, Upload, Link as LinkIcon, File, Video, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SpinBadge } from './SpinBadge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { QualificationItem } from '@/hooks/useQualificationItems';

interface QualificationItemEditorProps {
  item: QualificationItem;
  onUpdate: (item: Partial<QualificationItem> & { id: string }) => void;
  onDelete: (id: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export const QualificationItemEditor = ({
  item,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: QualificationItemEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(item.content);
  const [description, setDescription] = useState(item.description || '');
  const [tip, setTip] = useState(item.tip || '');
  const [videoUrl, setVideoUrl] = useState(item.video_url || '');
  const [spinType, setSpinType] = useState<'S' | 'P' | 'none'>(item.spin_type || 'none');
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState(item.file_name || '');
  const [fileUrl, setFileUrl] = useState(item.file_url || '');

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `qualification/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('fluxo_audio_files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('fluxo_audio_files')
        .getPublicUrl(filePath);

      setFileUrl(publicUrl);
      setFileName(file.name);

      toast({
        title: 'Arquivo enviado',
        description: 'O arquivo foi enviado com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro no upload',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    onUpdate({
      id: item.id,
      content,
      description: description || null,
      tip: tip || null,
      video_url: videoUrl || null,
      file_url: fileUrl || null,
      file_name: fileName || null,
      spin_type: spinType === 'none' ? null : spinType,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContent(item.content);
    setDescription(item.description || '');
    setTip(item.tip || '');
    setVideoUrl(item.video_url || '');
    setFileUrl(item.file_url || '');
    setFileName(item.file_name || '');
    setSpinType(item.spin_type || 'none');
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 border-2 border-blue-400 dark:border-blue-600 rounded-lg p-4 flex items-center justify-between gap-4 group hover:shadow-lg transition-all">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            {item.spin_type && <SpinBadge type={item.spin_type} />}
            <span className="text-primary font-bold text-lg">•</span>
            <div className="flex-1">
              <span className="text-foreground font-bold">{item.content}</span>
              
              {item.description && (
                <div className="mt-2 bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm text-foreground">
                  📝 {item.description}
                </div>
              )}
              
              {item.tip && (
                <div className="bg-accent/10 border-l-4 border-accent p-3 rounded text-sm mt-2">
                  <p className="text-foreground">
                    💡 <strong>Dica:</strong> {item.tip}
                  </p>
                </div>
              )}
              
              {item.video_url && (
                <div className="mt-3">
                  <div className="w-64 aspect-video rounded-lg overflow-hidden bg-black shadow-lg">
                    <iframe
                      src={item.video_url}
                      className="w-full h-full"
                      allowFullScreen
                      title={item.content}
                    />
                  </div>
                </div>
              )}
              
              {item.file_url && item.file_name && (
                <a
                  href={item.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-2 rounded-lg transition-colors"
                >
                  <File className="w-4 h-4" />
                  {item.file_name}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="outline"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            title="Mover para cima"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            title="Mover para baixo"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
            Editar
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              if (confirm('Tem certeza que deseja excluir este item?')) {
                onDelete(item.id);
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border-2 border-primary rounded-lg p-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`content-${item.id}`}>Texto do Item *</Label>
        <Input
          id={`content-${item.id}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ex: Nome da Empresa/ Cliente"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`spin-${item.id}`}>SPIN - Tipo de Pergunta</Label>
        <Select value={spinType} onValueChange={(value: 'S' | 'P' | 'none') => setSpinType(value)}>
          <SelectTrigger id={`spin-${item.id}`}>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhum</SelectItem>
            <SelectItem value="S">
              <div className="flex items-center gap-2">
                <SpinBadge type="S" />
                <span>Situação</span>
              </div>
            </SelectItem>
            <SelectItem value="P">
              <div className="flex items-center gap-2">
                <SpinBadge type="P" />
                <span>Problema</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`description-${item.id}`}>
          Descrição (aparece em caixa colorida)
        </Label>
        <Textarea
          id={`description-${item.id}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Adicione uma descrição opcional que aparecerá em uma caixa destacada..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`tip-${item.id}`}>
          Dica (aparece com ícone de lâmpada)
        </Label>
        <Textarea
          id={`tip-${item.id}`}
          value={tip}
          onChange={(e) => setTip(e.target.value)}
          placeholder="Adicione uma dica opcional que aparecerá com destaque..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`video-${item.id}`}>
          <Video className="w-4 h-4 inline mr-2" />
          Link do Vídeo (YouTube, Vimeo, etc.)
        </Label>
        <Input
          id={`video-${item.id}`}
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Cole o link do vídeo (embed URL)"
        />
        <p className="text-xs text-muted-foreground">
          Use a URL de incorporação (embed). Ex: https://www.youtube.com/embed/VIDEO_ID
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`file-${item.id}`}>
          <File className="w-4 h-4 inline mr-2" />
          Arquivo Anexo
        </Label>
        <div className="flex gap-2">
          <Input
            id={`file-${item.id}`}
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            disabled={isUploading}
            className="flex-1"
          />
          {fileName && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFileUrl('');
                setFileName('');
              }}
            >
              Remover
            </Button>
          )}
        </div>
        {fileName && (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <File className="w-4 h-4" />
            {fileName}
          </p>
        )}
      </div>

      <div className="flex gap-2 justify-end pt-4 border-t">
        <Button variant="outline" onClick={handleCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={!content.trim() || isUploading}>
          <Save className="w-4 h-4 mr-2" />
          {isUploading ? 'Enviando...' : 'Salvar'}
        </Button>
      </div>
    </div>
  );
};
