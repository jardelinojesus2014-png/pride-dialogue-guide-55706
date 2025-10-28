import { useState } from 'react';
import { ChevronUp, ChevronDown, Trash2, Save, X, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { ScriptItem } from '@/hooks/useScriptItems';

interface ScriptItemEditorProps {
  item: ScriptItem;
  onUpdate: (item: Partial<ScriptItem> & { id: string }) => void;
  onDelete: (id: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export const ScriptItemEditor = ({
  item,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: ScriptItemEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(item.label);
  const [script, setScript] = useState(item.script);
  const [alternatives, setAlternatives] = useState<string[]>(item.alternatives || []);
  const [tips, setTips] = useState<string[]>(item.tips || []);
  const [warnings, setWarnings] = useState<string[]>(item.warnings || []);
  const [collect, setCollect] = useState<string[]>(item.collect || []);
  
  const [newAlternative, setNewAlternative] = useState('');
  const [newTip, setNewTip] = useState('');
  const [newWarning, setNewWarning] = useState('');
  const [newCollect, setNewCollect] = useState('');

  const handleSave = () => {
    onUpdate({
      id: item.id,
      label,
      script,
      alternatives: alternatives.length > 0 ? alternatives : null,
      tips: tips.length > 0 ? tips : null,
      warnings: warnings.length > 0 ? warnings : null,
      collect: collect.length > 0 ? collect : null,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLabel(item.label);
    setScript(item.script);
    setAlternatives(item.alternatives || []);
    setTips(item.tips || []);
    setWarnings(item.warnings || []);
    setCollect(item.collect || []);
    setIsEditing(false);
  };

  const addAlternative = () => {
    if (newAlternative.trim()) {
      setAlternatives([...alternatives, newAlternative.trim()]);
      setNewAlternative('');
    }
  };

  const removeAlternative = (index: number) => {
    setAlternatives(alternatives.filter((_, i) => i !== index));
  };

  const addTip = () => {
    if (newTip.trim()) {
      setTips([...tips, newTip.trim()]);
      setNewTip('');
    }
  };

  const removeTip = (index: number) => {
    setTips(tips.filter((_, i) => i !== index));
  };

  const addWarning = () => {
    if (newWarning.trim()) {
      setWarnings([...warnings, newWarning.trim()]);
      setNewWarning('');
    }
  };

  const removeWarning = (index: number) => {
    setWarnings(warnings.filter((_, i) => i !== index));
  };

  const addCollect = () => {
    if (newCollect.trim()) {
      setCollect([...collect, newCollect.trim()]);
      setNewCollect('');
    }
  };

  const removeCollect = (index: number) => {
    setCollect(collect.filter((_, i) => i !== index));
  };

  if (!isEditing) {
    return (
      <div className="bg-muted/30 border-2 border-border rounded-lg p-4 mb-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-primary">{item.label}</h3>
          <div className="flex gap-2">
            <Button onClick={onMoveUp} disabled={!canMoveUp} size="sm" variant="outline">
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button onClick={onMoveDown} disabled={!canMoveDown} size="sm" variant="outline">
              <ChevronDown className="w-4 h-4" />
            </Button>
            <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
              Editar
            </Button>
            <Button onClick={() => onDelete(item.id)} size="sm" variant="destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{item.script}</p>
      </div>
    );
  }

  return (
    <div className="bg-card border-2 border-primary rounded-lg p-4 mb-3 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Editando Item</h3>
        <div className="flex gap-2">
          <Button onClick={handleSave} size="sm">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
          <Button onClick={handleCancel} size="sm" variant="outline">
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </div>

      {/* Label */}
      <div>
        <label className="block text-sm font-semibold mb-2">Título do Item</label>
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Ex: Saudação"
        />
      </div>

      {/* Script */}
      <div>
        <label className="block text-sm font-semibold mb-2">Script Principal</label>
        <Textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Digite o script aqui..."
          rows={4}
        />
      </div>

      {/* Alternatives */}
      <div>
        <label className="block text-sm font-semibold mb-2">📘 Alternativas</label>
        {alternatives.map((alt, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <Textarea
              value={alt}
              onChange={(e) => {
                const newAlts = [...alternatives];
                newAlts[idx] = e.target.value;
                setAlternatives(newAlts);
              }}
              className="flex-1 bg-blue-50 dark:bg-blue-950/20 border-blue-400 dark:border-blue-600"
              rows={2}
            />
            <Button onClick={() => removeAlternative(idx)} size="sm" variant="destructive">
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Textarea
            value={newAlternative}
            onChange={(e) => setNewAlternative(e.target.value)}
            placeholder="Adicionar alternativa..."
            className="flex-1 bg-blue-50 dark:bg-blue-950/20 border-blue-400 dark:border-blue-600"
            rows={2}
          />
          <Button onClick={addAlternative} size="sm" className="bg-blue-500 hover:bg-blue-600">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tips */}
      <div>
        <label className="block text-sm font-semibold mb-2">💡 Dicas</label>
        {tips.map((tip, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <Textarea
              value={tip}
              onChange={(e) => {
                const newTips = [...tips];
                newTips[idx] = e.target.value;
                setTips(newTips);
              }}
              className="flex-1 bg-accent/10 border-accent"
              rows={2}
            />
            <Button onClick={() => removeTip(idx)} size="sm" variant="destructive">
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Textarea
            value={newTip}
            onChange={(e) => setNewTip(e.target.value)}
            placeholder="Adicionar dica..."
            className="flex-1 bg-accent/10 border-accent"
            rows={2}
          />
          <Button onClick={addTip} size="sm" className="bg-accent hover:bg-accent/90">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Warnings */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-red-700 dark:text-red-400">⚠️ Atenção/Cuidado (o que NÃO fazer)</label>
        {warnings.map((warning, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <Textarea
              value={warning}
              onChange={(e) => {
                const newWarnings = [...warnings];
                newWarnings[idx] = e.target.value;
                setWarnings(newWarnings);
              }}
              className="flex-1 bg-red-50 dark:bg-red-950/20 border-red-500 dark:border-red-600"
              rows={2}
            />
            <Button onClick={() => removeWarning(idx)} size="sm" variant="destructive">
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Textarea
            value={newWarning}
            onChange={(e) => setNewWarning(e.target.value)}
            placeholder="Adicionar aviso do que NÃO fazer..."
            className="flex-1 bg-red-50 dark:bg-red-950/20 border-red-500 dark:border-red-600"
            rows={2}
          />
          <Button onClick={addWarning} size="sm" className="bg-red-500 hover:bg-red-600">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Collect */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-green-700 dark:text-green-400">📋 Informações a Coletar</label>
        {collect.map((info, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <Input
              value={info}
              onChange={(e) => {
                const newCollect = [...collect];
                newCollect[idx] = e.target.value;
                setCollect(newCollect);
              }}
              className="flex-1 bg-green-50 dark:bg-green-950/20 border-green-500 dark:border-green-600"
            />
            <Button onClick={() => removeCollect(idx)} size="sm" variant="destructive">
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input
            value={newCollect}
            onChange={(e) => setNewCollect(e.target.value)}
            placeholder="Adicionar informação a coletar..."
            className="flex-1 bg-green-50 dark:bg-green-950/20 border-green-500 dark:border-green-600"
          />
          <Button onClick={addCollect} size="sm" className="bg-green-500 hover:bg-green-600">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};