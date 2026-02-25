import { useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface AddCampaignDialogProps {
  onAdd: (campaign: {
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
}

export const AddCampaignDialog = ({ onAdd }: AddCampaignDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [operadoraName, setOperadoraName] = useState('');
  const [status, setStatus] = useState('ativa');
  const [campaignType, setCampaignType] = useState('campanha');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [detailsContent, setDetailsContent] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

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
    setCampaignType('campanha'); setStartDate(''); setEndDate('');
    setTagsStr(''); setDetailsContent(''); setBannerFile(null); setLogoFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Campanha
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Campanha</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Título *</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nome da campanha" />
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
            <div>
              <Label>Tipo</Label>
              <Select value={campaignType} onValueChange={setCampaignType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="campanha">Campanha</SelectItem>
                  <SelectItem value="comunicado">Comunicado</SelectItem>
                  <SelectItem value="promocao">Promoção</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            <Input value={tagsStr} onChange={e => setTagsStr(e.target.value)} placeholder="Carnaval, Desconto, 50OFF" />
          </div>
          <div>
            <Label>Detalhes / Regras</Label>
            <Textarea value={detailsContent} onChange={e => setDetailsContent(e.target.value)} placeholder="Regras e detalhes da campanha..." rows={4} />
          </div>
          <div>
            <Label>Banner da Campanha</Label>
            <Input type="file" accept="image/*" onChange={e => setBannerFile(e.target.files?.[0] || null)} />
          </div>
          <div>
            <Label>Logo da Operadora</Label>
            <Input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] || null)} />
          </div>
          <Button onClick={handleSubmit} disabled={saving || !title || !operadoraName} className="w-full">
            {saving ? 'Salvando...' : 'Adicionar Campanha'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
