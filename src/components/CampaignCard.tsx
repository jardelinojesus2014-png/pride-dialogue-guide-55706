import { useState } from 'react';
import { Eye, Download, Trash2, Calendar, Tag, Edit2, Save, X, Upload, Image } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Campaign } from '@/hooks/useCampaigns';

interface CampaignCardProps {
  campaign: Campaign;
  isAdmin: boolean;
  onDelete?: (id: string, bannerPath: string | null) => void;
  onUpdate?: (id: string, updates: Partial<Campaign>) => void;
  onAddCreatives?: (campaignId: string, files: File[]) => void;
}

export const CampaignCard = ({ campaign, isAdmin, onDelete, onUpdate, onAddCreatives }: CampaignCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(campaign.title);
  const [editDescription, setEditDescription] = useState(campaign.description || '');
  const [editStatus, setEditStatus] = useState(campaign.status);
  const [editStartDate, setEditStartDate] = useState(campaign.start_date || '');
  const [editEndDate, setEditEndDate] = useState(campaign.end_date || '');
  const [editDetails, setEditDetails] = useState(campaign.details_content || '');
  const [editOperadora, setEditOperadora] = useState(campaign.operadora_name);
  const [editTags, setEditTags] = useState((campaign.tags || []).join(', '));

  const statusColor = campaign.status === 'ativa'
    ? 'bg-green-500/90 text-white hover:bg-green-500'
    : campaign.status === 'vencendo'
    ? 'bg-yellow-500/90 text-white hover:bg-yellow-500'
    : 'bg-muted text-muted-foreground';

  const statusLabel = campaign.status === 'ativa' ? 'Ativa' : campaign.status === 'vencendo' ? 'Vencendo' : 'Encerrada';

  const formatDate = (date: string | null) => {
    if (!date) return '';
    return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const handleSave = () => {
    if (!onUpdate) return;
    onUpdate(campaign.id, {
      title: editTitle,
      description: editDescription || null,
      status: editStatus,
      start_date: editStartDate || null,
      end_date: editEndDate || null,
      details_content: editDetails || null,
      operadora_name: editOperadora,
      tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(campaign.title);
    setEditDescription(campaign.description || '');
    setEditStatus(campaign.status);
    setEditStartDate(campaign.start_date || '');
    setEditEndDate(campaign.end_date || '');
    setEditDetails(campaign.details_content || '');
    setEditOperadora(campaign.operadora_name);
    setEditTags((campaign.tags || []).join(', '));
    setEditing(false);
  };

  const handleCreativeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onAddCreatives) {
      onAddCreatives(campaign.id, Array.from(files));
    }
  };

  // Get first creative as preview image, fallback to banner
  const previewImage = (campaign.creative_file_urls && campaign.creative_file_urls.length > 0)
    ? campaign.creative_file_urls[0]
    : campaign.banner_image_url;

  return (
    <>
      <Card className="overflow-hidden border border-border hover:border-primary/40 transition-all hover:shadow-lg group flex flex-col">
        {/* Creative Preview */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {previewImage ? (
            <img
              src={previewImage}
              alt={campaign.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image className="w-12 h-12 text-muted-foreground/30" />
            </div>
          )}
          {/* Status badge overlay */}
          <Badge className={`absolute top-2 left-2 ${statusColor} text-xs`}>
            {statusLabel}
          </Badge>
          {/* Admin actions overlay */}
          {isAdmin && (
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => setEditing(true)}>
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              {onDelete && (
                <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => onDelete(campaign.id, campaign.banner_image_path)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          )}
          {/* Creative count */}
          {campaign.creative_file_urls && campaign.creative_file_urls.length > 1 && (
            <Badge variant="secondary" className="absolute bottom-2 right-2 text-xs">
              +{campaign.creative_file_urls.length - 1} criativos
            </Badge>
          )}
        </div>

        <CardContent className="p-3 space-y-2 flex-1 flex flex-col">
          {/* Operadora */}
          <div className="flex items-center gap-1.5">
            {campaign.operadora_logo_url && (
              <img src={campaign.operadora_logo_url} alt={campaign.operadora_name} className="w-5 h-5 object-contain flex-shrink-0" />
            )}
            <span className="text-xs font-medium text-muted-foreground truncate">{campaign.operadora_name}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-foreground text-sm leading-tight line-clamp-2">{campaign.title}</h3>

          {/* Dates */}
          {(campaign.start_date || campaign.end_date) && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{formatDate(campaign.start_date)} — {formatDate(campaign.end_date)}</span>
            </div>
          )}

          {/* Rules summary */}
          {campaign.details_content && (
            <p className="text-xs text-muted-foreground line-clamp-2">{campaign.details_content}</p>
          )}

          {/* Tags */}
          {campaign.tags && campaign.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {campaign.tags.slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0">{tag}</Badge>
              ))}
              {campaign.tags.length > 3 && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">+{campaign.tags.length - 3}</Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-1.5 pt-1 mt-auto">
            <Button size="sm" onClick={() => setShowDetails(true)} className="flex-1 text-xs h-8">
              <Eye className="w-3 h-3 mr-1" />
              Detalhes
            </Button>
            {campaign.creative_file_urls && campaign.creative_file_urls.length > 0 && (
              <Button size="sm" variant="outline" className="text-xs h-8" asChild>
                <a href={campaign.creative_file_urls[0]} target="_blank" rel="noopener noreferrer">
                  <Download className="w-3 h-3" />
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog - Admin only */}
      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Campanha</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
            </div>
            <div>
              <Label>Operadora</Label>
              <Input value={editOperadora} onChange={e => setEditOperadora(e.target.value)} />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Status</Label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativa">Ativa</SelectItem>
                    <SelectItem value="vencendo">Vencendo</SelectItem>
                    <SelectItem value="encerrada">Encerrada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tags</Label>
                <Input value={editTags} onChange={e => setEditTags(e.target.value)} placeholder="tag1, tag2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Data Início</Label>
                <Input type="date" value={editStartDate} onChange={e => setEditStartDate(e.target.value)} />
              </div>
              <div>
                <Label>Data Fim</Label>
                <Input type="date" value={editEndDate} onChange={e => setEditEndDate(e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Resumo das Regras</Label>
              <Textarea value={editDetails} onChange={e => setEditDetails(e.target.value)} rows={4} placeholder="Regras e detalhes da campanha..." />
            </div>
            <div>
              <Label>Adicionar Criativos</Label>
              <Input type="file" accept="image/*,.pdf" multiple onChange={handleCreativeUpload} />
            </div>
            {campaign.creative_file_urls && campaign.creative_file_urls.length > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground">Criativos atuais ({campaign.creative_file_urls.length})</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {campaign.creative_file_urls.map((url, i) => (
                    <img key={i} src={url} alt={`Criativo ${i + 1}`} className="w-full aspect-square object-cover rounded border" />
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                <Save className="w-4 h-4 mr-1" /> Salvar
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-1" /> Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{campaign.title}</DialogTitle>
          </DialogHeader>

          {previewImage && (
            <img src={previewImage} alt={campaign.title} className="w-full rounded-lg" />
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={statusColor}>{statusLabel}</Badge>
              {campaign.operadora_logo_url && (
                <img src={campaign.operadora_logo_url} alt={campaign.operadora_name} className="w-6 h-6 object-contain" />
              )}
              <span className="text-sm text-muted-foreground">{campaign.operadora_name}</span>
            </div>

            {campaign.description && <p className="text-foreground">{campaign.description}</p>}

            {campaign.details_content && (
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">Regras da Campanha</h4>
                <p className="text-sm whitespace-pre-wrap">{campaign.details_content}</p>
              </div>
            )}

            {(campaign.start_date || campaign.end_date) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Vigência: {formatDate(campaign.start_date)} — {formatDate(campaign.end_date)}</span>
              </div>
            )}

            {campaign.tags && campaign.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {campaign.tags.map((tag, i) => (
                  <Badge key={i} variant="outline">{tag}</Badge>
                ))}
              </div>
            )}

            {campaign.creative_file_urls && campaign.creative_file_urls.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Criativos</h4>
                <div className="grid grid-cols-2 gap-2">
                  {campaign.creative_file_urls.map((url, i) => (
                    <div key={i} className="space-y-1">
                      <img src={url} alt={`Criativo ${i + 1}`} className="w-full aspect-video object-cover rounded border" />
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {campaign.creative_file_names?.[i] || `Arquivo ${i + 1}`}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
