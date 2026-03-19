import { useState } from 'react';
import { Plus, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AddGenericItemDialogProps {
  label: string;
  onAdd: (item: {
    title: string;
    description: string;
    operadora_name: string;
    status: string;
    campaign_type: string;
    start_date: string;
    end_date: string;
    tags: string[];
    details_content: string;
    bannerFile?: File;
    operadoraLogoFile?: File;
  }) => Promise<void>;
  typeOptions?: { value: string; label: string }[];
  externalOpen?: boolean;
  onExternalOpenChange?: (open: boolean) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const AddGenericItemDialog = ({ label, onAdd, typeOptions, externalOpen, onExternalOpenChange }: AddGenericItemDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen = isControlled ? (v: boolean) => onExternalOpenChange?.(v) : setInternalOpen;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [operadoraName, setOperadoraName] = useState('');
  const [status, setStatus] = useState('ativa');
  const [campaignType, setCampaignType] = useState(typeOptions?.[0]?.value || 'geral');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [detailsContent, setDetailsContent] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setBannerFile(file);
    if (file) {
      await analyzeImage(file);
    }
  };

  const analyzeImage = async (file: File) => {
    setAnalyzing(true);
    try {
      const base64 = await fileToBase64(file);
      const { data, error } = await supabase.functions.invoke('analyze-campaign-image', {
        body: { imageBase64: base64 },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description);
      if (data.operadora_name) setOperadoraName(data.operadora_name);
      if (data.campaign_type) setCampaignType(data.campaign_type);
      if (data.start_date) setStartDate(data.start_date);
      if (data.end_date) setEndDate(data.end_date);
      if (data.details_content) setDetailsContent(data.details_content);
      if (data.tags && data.tags.length > 0) setTagsStr(data.tags.join(', '));

      toast.success('Informações extraídas do criativo com sucesso!');
    } catch (err) {
      console.error('Error analyzing image:', err);
      toast.error('Não foi possível extrair informações da imagem. Preencha manualmente.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !operadoraName) return;
    setSaving(true);
    try {
      await onAdd({
        title,
        description,
        operadora_name: operadoraName,
        status,
        campaign_type: campaignType,
        start_date: startDate,
        end_date: endDate,
        tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean),
        details_content: detailsContent,
        bannerFile: bannerFile || undefined,
        operadoraLogoFile: logoFile || undefined,
      });
      setOpen(false);
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setTitle(''); setDescription(''); setOperadoraName(''); setStatus('ativa');
    setCampaignType(typeOptions?.[0]?.value || 'geral'); setStartDate(''); setEndDate('');
    setTagsStr(''); setDetailsContent(''); setBannerFile(null); setLogoFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nov{label === 'Arte' ? 'a' : 'o'} {label}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar {label}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-primary/30 rounded-lg p-4 bg-primary/5">
            <Label className="flex items-center gap-2 text-primary font-semibold mb-2">
              <Sparkles className="w-4 h-4" />
              Criativo *
            </Label>
            <p className="text-xs text-muted-foreground mb-2">
              Suba o criativo e as informações serão preenchidas automaticamente via IA
            </p>
            <Input type="file" accept="image/*" onChange={handleBannerChange} />
            {analyzing && (
              <div className="flex items-center gap-2 mt-2 text-sm text-primary">
                <Loader2 className="w-4 h-4 animate-spin" />
                Analisando criativo com IA...
              </div>
            )}
          </div>

          <div>
            <Label>Título *</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder={`Nome ${label === 'Arte' ? 'da' : 'do'} ${label.toLowerCase()}`} />
          </div>
          <div>
            <Label>Operadora *</Label>
            <Input value={operadoraName} onChange={e => setOperadoraName(e.target.value)} placeholder="Nome da operadora" />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descrição breve" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="vencendo">Vencendo</SelectItem>
                  <SelectItem value="encerrada">Encerrada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {typeOptions && typeOptions.length > 0 && (
              <div>
                <Label>Tipo</Label>
                <Select value={campaignType} onValueChange={setCampaignType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {typeOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Data Início</Label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label>Data Fim</Label>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Tags (separadas por vírgula)</Label>
            <Input value={tagsStr} onChange={e => setTagsStr(e.target.value)} placeholder="Tag1, Tag2, Tag3" />
          </div>
          <div>
            <Label>Detalhes / Regras</Label>
            <Textarea value={detailsContent} onChange={e => setDetailsContent(e.target.value)} placeholder="Regras e detalhes..." rows={4} />
          </div>
          <div>
            <Label>Logo da Operadora</Label>
            <Input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] || null)} />
          </div>
          <Button onClick={handleSubmit} disabled={saving || analyzing || !title || !operadoraName} className="w-full">
            {saving ? 'Salvando...' : `Adicionar ${label}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
