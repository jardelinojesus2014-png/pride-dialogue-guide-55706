import { useState } from 'react';
import { Plus, Folder, Image, Sparkles, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFolderArtes } from '@/hooks/useFolderArtes';
import { GenericItemCard } from '@/components/GenericItemCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ArtesFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderName: string;
  isAdmin: boolean;
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

export const ArtesFolderDialog = ({ open, onOpenChange, folderName, isAdmin }: ArtesFolderDialogProps) => {
  const { artes, loading, addArte, updateArte, deleteArte, addCreativeFiles } = useFolderArtes();
  const [showAddForm, setShowAddForm] = useState(false);

  // Add form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [operadoraName, setOperadoraName] = useState('');
  const [status, setStatus] = useState('ativa');
  const [campaignType, setCampaignType] = useState('arte');
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
        if (data.tags?.length > 0) setTagsStr(data.tags.join(', '));
        toast.success('Informações extraídas com IA!');
      } catch {
        toast.error('Não foi possível extrair informações. Preencha manualmente.');
      } finally {
        setAnalyzing(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!title || !operadoraName) return;
    setSaving(true);
    try {
      await addArte({
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
      resetForm();
      setShowAddForm(false);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setTitle(''); setDescription(''); setOperadoraName(''); setStatus('ativa');
    setCampaignType('arte'); setStartDate(''); setEndDate('');
    setTagsStr(''); setDetailsContent(''); setBannerFile(null); setLogoFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Folder className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold">{folderName}</DialogTitle>
          </div>
        </DialogHeader>

        {/* Add button for admins */}
        {isAdmin && !showAddForm && (
          <Button onClick={() => setShowAddForm(true)} className="gap-2 w-fit">
            <Plus className="w-4 h-4" />
            Nova Arte
          </Button>
        )}

        {/* Add form */}
        {showAddForm && (
          <div className="border border-border rounded-xl p-4 space-y-4 bg-muted/30">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><Label>Título *</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nome da arte" /></div>
              <div><Label>Operadora *</Label><Input value={operadoraName} onChange={e => setOperadoraName(e.target.value)} placeholder="Nome da operadora" /></div>
            </div>
            <div><Label>Descrição</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descrição breve" rows={2} /></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                    <SelectItem value="arte">Arte</SelectItem>
                    <SelectItem value="banner">Banner</SelectItem>
                    <SelectItem value="post">Post</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Data Início</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
              <div><Label>Data Fim</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
            </div>
            <div><Label>Tags</Label><Input value={tagsStr} onChange={e => setTagsStr(e.target.value)} placeholder="Tag1, Tag2" /></div>
            <div><Label>Detalhes / Regras</Label><Textarea value={detailsContent} onChange={e => setDetailsContent(e.target.value)} placeholder="Regras e detalhes..." rows={3} /></div>
            <div><Label>Logo da Operadora</Label><Input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] || null)} /></div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={saving || analyzing || !title || !operadoraName} className="flex-1">
                {saving ? 'Salvando...' : 'Adicionar Arte'}
              </Button>
              <Button variant="outline" onClick={() => { resetForm(); setShowAddForm(false); }}>Cancelar</Button>
            </div>
          </div>
        )}

        {/* Grid of artes */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : artes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Image className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>Nenhuma arte na pasta</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {artes.map(item => (
              <GenericItemCard
                key={item.id}
                item={{
                  ...item,
                  banner_image_url: item.banner_image_url || item.file_url,
                  tags: item.tags || [],
                  creative_file_urls: item.creative_file_urls || [],
                  creative_file_paths: item.creative_file_paths || [],
                  creative_file_names: item.creative_file_names || [],
                }}
                isAdmin={isAdmin}
                label="Arte"
                onDelete={deleteArte}
                onUpdate={updateArte}
                onAddCreatives={addCreativeFiles}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
