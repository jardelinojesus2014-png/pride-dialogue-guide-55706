import { useState } from 'react';
import { Trash2, Save, X, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
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

  const handleSave = () => {
    onUpdate({
      id: item.id,
      content,
      description: description || null,
      tip: tip || null,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContent(item.content);
    setDescription(item.description || '');
    setTip(item.tip || '');
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-between gap-4 group hover:bg-muted/50 transition-colors">
        <div className="flex-1">
          <div className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <div className="flex-1">
              <span className="text-foreground">{item.content}</span>
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

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={handleCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={!content.trim()}>
          <Save className="w-4 h-4 mr-2" />
          Salvar
        </Button>
      </div>
    </div>
  );
};
