import { useState } from 'react';
import { Trash2, Save, X, ChevronUp, ChevronDown, Plus, Video, File } from 'lucide-react';
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
  const [descriptions, setDescriptions] = useState<string[]>(item.descriptions || []);
  const [tips, setTips] = useState<string[]>(item.tips || []);
  const [videoUrls, setVideoUrls] = useState<string[]>(item.video_urls || []);
  const [fileUrls, setFileUrls] = useState<string[]>(item.file_urls || []);
  const [fileNames, setFileNames] = useState<string[]>(item.file_names || []);
  const [spinType, setSpinType] = useState<'S' | 'P' | 'none'>(item.spin_type || 'none');
  const [examples, setExamples] = useState<string[]>(item.examples || []);
  
  const [newDescription, setNewDescription] = useState('');
  const [newTip, setNewTip] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newExample, setNewExample] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const convertYouTubeUrl = (url: string): string => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
    const match = url.match(youtubeRegex);
    
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    
    return url;
  };

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

      setFileUrls([...fileUrls, publicUrl]);
      setFileNames([...fileNames, file.name]);

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
    const processedVideoUrls = videoUrls.map(convertYouTubeUrl);
    
    onUpdate({
      id: item.id,
      content,
      descriptions: descriptions.length > 0 ? descriptions : null,
      tips: tips.length > 0 ? tips : null,
      video_urls: processedVideoUrls.length > 0 ? processedVideoUrls : null,
      file_urls: fileUrls.length > 0 ? fileUrls : null,
      file_names: fileNames.length > 0 ? fileNames : null,
      spin_type: spinType === 'none' ? null : spinType,
      examples: examples.length > 0 ? examples : null,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContent(item.content);
    setDescriptions(item.descriptions || []);
    setTips(item.tips || []);
    setVideoUrls(item.video_urls || []);
    setFileUrls(item.file_urls || []);
    setFileNames(item.file_names || []);
    setSpinType(item.spin_type || 'none');
    setExamples(item.examples || []);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 border-2 border-blue-400 dark:border-blue-600 rounded-lg p-4 flex items-center justify-between gap-4 group hover:shadow-lg transition-all">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            {item.spin_type && <SpinBadge type={item.spin_type} />}
            <span className="text-primary font-bold text-lg">•</span>
            <div className="flex-1 space-y-2">
              <span className="text-foreground font-bold">{item.content}</span>
              
              {item.descriptions && item.descriptions.map((desc, idx) => (
                <div key={idx} className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm text-foreground">
                  📝 {desc}
                </div>
              ))}
              
              {item.examples && item.examples.map((example, idx) => (
                <div key={idx} className="bg-purple-50 dark:bg-purple-950/20 border border-purple-300 dark:border-purple-700 rounded-lg p-3 text-sm text-foreground">
                  ✨ <strong>Exemplo:</strong> {example}
                </div>
              ))}
              
              {item.video_urls && item.video_urls.map((videoUrl, idx) => (
                <div key={idx} className="mt-3">
                  <div className="w-64 aspect-video rounded-lg overflow-hidden bg-black shadow-lg">
                    <iframe
                      src={videoUrl}
                      className="w-full h-full"
                      allowFullScreen
                      title={`${item.content} - Vídeo ${idx + 1}`}
                    />
                  </div>
                </div>
              ))}
              
              {item.file_names && item.file_urls && item.file_names.map((fileName, idx) => (
                <a
                  key={idx}
                  href={item.file_urls![idx]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-2 rounded-lg transition-colors mr-2"
                >
                  <File className="w-4 h-4" />
                  {fileName}
                </a>
              ))}
              
              {item.tips && item.tips.map((tip, idx) => (
                <div key={idx} className="bg-accent/10 border-l-4 border-accent p-4 rounded text-sm mt-3 ml-[-8px] mr-[-8px] animate-pulse">
                  <p className="text-foreground">
                    <span className="inline-block animate-[pulse_2s_ease-in-out_infinite]">💡</span> <strong>Dica:</strong> {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="outline" onClick={onMoveUp} disabled={!canMoveUp}>
            <ChevronUp className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={onMoveDown} disabled={!canMoveDown}>
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
            Editar
          </Button>
          <Button size="sm" variant="destructive" onClick={() => {
            if (confirm('Tem certeza que deseja excluir este item?')) {
              onDelete(item.id);
            }
          }}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border-2 border-primary rounded-lg p-6 space-y-4">
      <div className="space-y-2">
        <Label>Texto do Item *</Label>
        <Input value={content} onChange={(e) => setContent(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>SPIN - Tipo de Pergunta</Label>
        <Select value={spinType} onValueChange={(value: 'S' | 'P' | 'none') => setSpinType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhum</SelectItem>
            <SelectItem value="S">S - Situação</SelectItem>
            <SelectItem value="P">P - Problema</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Descriptions */}
      <div className="space-y-2">
        <Label>📝 Descrições</Label>
        {descriptions.map((desc, idx) => (
          <div key={idx} className="flex gap-2">
            <Input value={desc} onChange={(e) => {
              const newDescs = [...descriptions];
              newDescs[idx] = e.target.value;
              setDescriptions(newDescs);
            }} />
            <Button variant="ghost" size="sm" onClick={() => setDescriptions(descriptions.filter((_, i) => i !== idx))}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Nova descrição"
            onKeyPress={(e) => e.key === 'Enter' && newDescription && (setDescriptions([...descriptions, newDescription]), setNewDescription(''))}
          />
          <Button onClick={() => newDescription && (setDescriptions([...descriptions, newDescription]), setNewDescription(''))}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-2">
        <Label>✨ Exemplos</Label>
        {examples.map((ex, idx) => (
          <div key={idx} className="flex gap-2">
            <Input value={ex} onChange={(e) => {
              const newExs = [...examples];
              newExs[idx] = e.target.value;
              setExamples(newExs);
            }} />
            <Button variant="ghost" size="sm" onClick={() => setExamples(examples.filter((_, i) => i !== idx))}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input
            value={newExample}
            onChange={(e) => setNewExample(e.target.value)}
            placeholder="Novo exemplo"
            onKeyPress={(e) => e.key === 'Enter' && newExample && (setExamples([...examples, newExample]), setNewExample(''))}
          />
          <Button onClick={() => newExample && (setExamples([...examples, newExample]), setNewExample(''))}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Video URLs */}
      <div className="space-y-2">
        <Label><Video className="w-4 h-4 inline mr-2" />Vídeos</Label>
        {videoUrls.map((url, idx) => (
          <div key={idx} className="flex gap-2">
            <Input value={url} onChange={(e) => {
              const newUrls = [...videoUrls];
              newUrls[idx] = e.target.value;
              setVideoUrls(newUrls);
            }} />
            <Button variant="ghost" size="sm" onClick={() => setVideoUrls(videoUrls.filter((_, i) => i !== idx))}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input
            value={newVideoUrl}
            onChange={(e) => setNewVideoUrl(e.target.value)}
            placeholder="URL do YouTube"
            onKeyPress={(e) => e.key === 'Enter' && newVideoUrl && (setVideoUrls([...videoUrls, newVideoUrl]), setNewVideoUrl(''))}
          />
          <Button onClick={() => newVideoUrl && (setVideoUrls([...videoUrls, newVideoUrl]), setNewVideoUrl(''))}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label><File className="w-4 h-4 inline mr-2" />Arquivos</Label>
        {fileNames.map((name, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-muted p-2 rounded">
            <File className="w-4 h-4" />
            <span className="flex-1 text-sm">{name}</span>
            <Button variant="ghost" size="sm" onClick={() => {
              setFileNames(fileNames.filter((_, i) => i !== idx));
              setFileUrls(fileUrls.filter((_, i) => i !== idx));
            }}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
          disabled={isUploading}
        />
      </div>

      {/* Tips */}
      <div className="space-y-2">
        <Label>💡 Dicas (sempre aparecem no final)</Label>
        {tips.map((tip, idx) => (
          <div key={idx} className="flex gap-2">
            <Textarea
              value={tip}
              onChange={(e) => {
                const newTips = [...tips];
                newTips[idx] = e.target.value;
                setTips(newTips);
              }}
              rows={2}
            />
            <Button variant="ghost" size="sm" onClick={() => setTips(tips.filter((_, i) => i !== idx))}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Textarea
            value={newTip}
            onChange={(e) => setNewTip(e.target.value)}
            placeholder="Nova dica"
            rows={2}
          />
          <Button onClick={() => newTip && (setTips([...tips, newTip]), setNewTip(''))}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
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
