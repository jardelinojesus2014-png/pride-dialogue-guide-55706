import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CadenciaItem } from '@/hooks/useCadenciaItems';
import { Plus, X } from 'lucide-react';

interface CadenciaItemEditorProps {
  item: CadenciaItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (itemId: string, updates: Partial<CadenciaItem>) => Promise<void>;
}

export const CadenciaItemEditor = ({
  item,
  open,
  onOpenChange,
  onSave
}: CadenciaItemEditorProps) => {
  const [label, setLabel] = useState(item.label);
  const [script, setScript] = useState(item.script);
  const [note, setNote] = useState(item.note || '');
  const [tip, setTip] = useState(item.tip || '');
  const [collect, setCollect] = useState<string[]>(item.collect || []);
  const [newCollectItem, setNewCollectItem] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(item.id, {
      label,
      script,
      note: note || null,
      tip: tip || null,
      collect: collect.length > 0 ? collect : null
    });
    setSaving(false);
    onOpenChange(false);
  };

  const addCollectItem = () => {
    if (newCollectItem.trim()) {
      setCollect([...collect, newCollectItem.trim()]);
      setNewCollectItem('');
    }
  };

  const removeCollectItem = (index: number) => {
    setCollect(collect.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-primary">
            Editar Item da Cadência
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="label">Rótulo</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex: 📞 Ligações"
            />
          </div>

          <div>
            <Label htmlFor="script">Script / Conteúdo</Label>
            <Textarea
              id="script"
              value={script}
              onChange={(e) => setScript(e.target.value)}
              rows={6}
              placeholder="Digite o script ou conteúdo principal..."
            />
          </div>

          <div>
            <Label htmlFor="note">Observação (opcional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Observações adicionais..."
            />
          </div>

          <div>
            <Label htmlFor="tip">Dica (opcional)</Label>
            <Textarea
              id="tip"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              rows={2}
              placeholder="Dica ou alerta..."
            />
          </div>

          <div>
            <Label>Itens para Coletar (opcional)</Label>
            <div className="space-y-2">
              {collect.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input value={item} disabled className="flex-1" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeCollectItem(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newCollectItem}
                  onChange={(e) => setNewCollectItem(e.target.value)}
                  placeholder="Adicionar item para coletar..."
                  onKeyPress={(e) => e.key === 'Enter' && addCollectItem()}
                />
                <Button type="button" onClick={addCollectItem} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
