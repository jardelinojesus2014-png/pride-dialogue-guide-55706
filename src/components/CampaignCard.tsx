import { useState } from 'react';
import { Eye, Download, Trash2, Calendar, Tag, Edit2, Save, X, Upload, Image, Archive } from 'lucide-react';
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
  onArchive?: (id: string) => void;
}

export const CampaignCard = ({ campaign, isAdmin, onDelete, onUpdate, onAddCreatives, onArchive }: CampaignCardProps) => {
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
    : campaign.status === 'arquivada'
    ? 'bg-blue-500/90 text-white hover:bg-blue-500'
    : 'bg-muted text-muted-foreground';

  const statusLabel = campaign.status === 'ativa' ? 'Ativa' : campaign.status === 'vencendo' ? 'Vencendo' : campaign.status === 'arquivada' ? 'Arquivada' : 'Encerrada';

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
      <Card className="overflow-hidden border border-border hover:border-primary/40 transition-all hover:shadow-lg group flex flex-col rounded-xl">
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
          {/* Admin actions overlay */}
          {isAdmin && (
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="secondary" className="h-7 w-7 rounded-full shadow" onClick={() => setEditing(true)}>
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              {onArchive && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-7 w-7 rounded-full shadow"
                  title={campaign.status === 'arquivada' ? 'Desarquivar' : 'Arquivar'}
                  onClick={() => onArchive(campaign.id)}
                >
                  <Archive className="w-3.5 h-3.5" />
                </Button>
              )}
              {onDelete && (
                <Button size="icon" variant="destructive" className="h-7 w-7 rounded-full shadow" onClick={() => onDelete(campaign.id, campaign.banner_image_path)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-2.5 flex-1 flex flex-col">
          {/* Operadora + Status */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              {campaign.operadora_logo_url && (
                <img src={campaign.operadora_logo_url} alt={campaign.operadora_name} className="w-5 h-5 object-contain flex-shrink-0" />
              )}
              <span className="text-xs font-medium text-muted-foreground truncate">{campaign.operadora_name}</span>
            </div>
            <Badge className={`${statusColor} text-[10px] px-2 py-0.5 flex-shrink-0 rounded-full`}>
              {statusLabel}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="font-bold text-foreground text-sm leading-tight line-clamp-2">{campaign.title}</h3>

          {/* Description */}
          {campaign.description && (
            <p className="text-xs text-muted-foreground line-clamp-1">{campaign.description}</p>
          )}

          {/* Dates */}
          {(campaign.start_date || campaign.end_date) && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{formatDate(campaign.start_date)} — {formatDate(campaign.end_date)}</span>
            </div>
          )}

          {/* Tags */}
          {campaign.tags && campaign.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {campaign.tags.slice(0, 4).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-[10px] px-2 py-0.5 rounded-full font-normal">{tag}</Badge>
              ))}
              {campaign.tags.length > 4 && (
                <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full font-normal">+{campaign.tags.length - 4}</Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2 mt-auto">
            <Button size="sm" onClick={() => setShowDetails(true)} className="flex-1 text-xs h-9 rounded-lg">
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              Ver detalhes
            </Button>
            {(campaign.creative_file_urls?.length > 0 || campaign.banner_image_url) && (
              <Button size="sm" variant="outline" className="flex-1 text-xs h-9 rounded-lg" asChild>
                <a href={campaign.creative_file_urls?.[0] || campaign.banner_image_url!} target="_blank" rel="noopener noreferrer" download>
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Baixar
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
        <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden">
          <div className="flex flex-col md:flex-row h-auto md:max-h-[75vh]">
            {/* Left: Creative Image */}
            {previewImage && (
              <div className="md:w-1/2 flex-shrink-0 bg-muted flex items-center justify-center p-4">
                <img src={previewImage} alt={campaign.title} className="max-w-full max-h-[65vh] object-contain rounded-lg" />
              </div>
            )}

            {/* Right: Info */}
            <div className={`flex-1 p-6 flex flex-col gap-3 justify-center ${!previewImage ? 'w-full' : ''}`}>
              <DialogHeader className="p-0 space-y-1">
                <DialogTitle className="text-xl font-bold">{campaign.title}</DialogTitle>
              </DialogHeader>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={statusColor}>{statusLabel}</Badge>
                {campaign.operadora_logo_url && (
                  <img src={campaign.operadora_logo_url} alt={campaign.operadora_name} className="w-6 h-6 object-contain" />
                )}
                <span className="text-sm text-muted-foreground">{campaign.operadora_name}</span>
              </div>

              {campaign.description && <p className="text-sm text-foreground">{campaign.description}</p>}

              {campaign.details_content && (
                <div className="bg-muted rounded-lg p-3">
                  <h4 className="font-semibold text-xs mb-1.5 text-foreground">Regras da Campanha</h4>
                  <p className="text-xs whitespace-pre-wrap text-muted-foreground leading-relaxed">{campaign.details_content}</p>
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
                    <Badge key={i} variant="outline" className="text-xs rounded-full">{tag}</Badge>
                  ))}
                </div>
              )}

              {campaign.creative_file_urls && campaign.creative_file_urls.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {campaign.creative_file_urls.map((url, i) => (
                    <Button key={i} size="sm" variant="outline" className="text-xs h-8 rounded-lg" asChild>
                      <a href={url} target="_blank" rel="noopener noreferrer" download>
                        <Download className="w-3 h-3 mr-1.5" />
                        {campaign.creative_file_names?.[i] || `Arquivo ${i + 1}`}
                      </a>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
