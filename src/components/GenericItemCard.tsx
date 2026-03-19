import { useState } from 'react';
import { Eye, Download, Trash2, Calendar, Edit2, Save, X, Archive, Image, Pin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export interface GenericItem {
  id: string;
  title: string;
  description: string | null;
  operadora_name: string;
  operadora_logo_url: string | null;
  banner_image_url: string | null;
  banner_image_path: string | null;
  status: string;
  campaign_type: string;
  start_date: string | null;
  end_date: string | null;
  tags: string[];
  details_content: string | null;
  creative_file_urls: string[];
  creative_file_paths: string[];
  creative_file_names: string[];
}

interface GenericItemCardProps {
  item: GenericItem;
  isAdmin: boolean;
  label: string;
  onDelete?: (id: string, bannerPath: string | null) => void;
  onUpdate?: (id: string, updates: Partial<GenericItem>) => void;
  onAddCreatives?: (itemId: string, files: File[]) => void;
  onArchive?: (id: string) => void;
  onTogglePin?: (id: string) => void;
}

export const GenericItemCard = ({ item, isAdmin, label, onDelete, onUpdate, onAddCreatives, onArchive, onTogglePin }: GenericItemCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editDescription, setEditDescription] = useState(item.description || '');
  const [editStatus, setEditStatus] = useState(item.status);
  const [editStartDate, setEditStartDate] = useState(item.start_date || '');
  const [editEndDate, setEditEndDate] = useState(item.end_date || '');
  const [editDetails, setEditDetails] = useState(item.details_content || '');
  const [editOperadora, setEditOperadora] = useState(item.operadora_name);
  const [editTags, setEditTags] = useState((item.tags || []).join(', '));

  const statusColor = item.status === 'ativa'
    ? 'bg-green-500/90 text-white hover:bg-green-500'
    : item.status === 'vencendo'
    ? 'bg-yellow-500/90 text-white hover:bg-yellow-500'
    : item.status === 'arquivada'
    ? 'bg-blue-500/90 text-white hover:bg-blue-500'
    : 'bg-muted text-muted-foreground';

  const statusLabel = item.status === 'ativa' ? 'Ativa' : item.status === 'vencendo' ? 'Vencendo' : item.status === 'arquivada' ? 'Arquivada' : 'Encerrada';

  const formatDate = (date: string | null) => {
    if (!date) return '';
    return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const handleSave = () => {
    if (!onUpdate) return;
    onUpdate(item.id, {
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
    setEditTitle(item.title);
    setEditDescription(item.description || '');
    setEditStatus(item.status);
    setEditStartDate(item.start_date || '');
    setEditEndDate(item.end_date || '');
    setEditDetails(item.details_content || '');
    setEditOperadora(item.operadora_name);
    setEditTags((item.tags || []).join(', '));
    setEditing(false);
  };

  const handleCreativeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onAddCreatives) {
      onAddCreatives(item.id, Array.from(files));
    }
  };

  const previewImage = (item.creative_file_urls && item.creative_file_urls.length > 0)
    ? item.creative_file_urls[0]
    : item.banner_image_url;

  return (
    <>
      <Card className={`overflow-hidden border ${(item as any).is_pinned ? 'border-primary/60 ring-1 ring-primary/30' : 'border-border'} hover:border-primary/40 transition-all hover:shadow-lg group flex flex-col rounded-xl relative`}>
        {(item as any).is_pinned && (
          <div className="absolute top-2 left-2 z-10">
            <Pin className="w-4 h-4 text-primary fill-primary" />
          </div>
        )}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {previewImage ? (
            <img src={previewImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image className="w-12 h-12 text-muted-foreground/30" />
            </div>
          )}
          {isAdmin && (
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {onTogglePin && (
                <Button size="icon" variant="secondary" className="h-7 w-7 rounded-full shadow" title={(item as any).is_pinned ? 'Desafixar' : 'Fixar'} onClick={() => onTogglePin(item.id)}>
                  <Pin className={`w-3.5 h-3.5 ${(item as any).is_pinned ? 'fill-primary text-primary' : ''}`} />
                </Button>
              )}
              <Button size="icon" variant="secondary" className="h-7 w-7 rounded-full shadow" onClick={() => setEditing(true)}>
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              {onArchive && (
                <Button size="icon" variant="secondary" className="h-7 w-7 rounded-full shadow" title={item.status === 'arquivada' ? 'Desarquivar' : 'Arquivar'} onClick={() => onArchive(item.id)}>
                  <Archive className="w-3.5 h-3.5" />
                </Button>
              )}
              {onDelete && (
                <Button size="icon" variant="destructive" className="h-7 w-7 rounded-full shadow" onClick={() => onDelete(item.id, item.banner_image_path)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-2.5 flex-1 flex flex-col">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              {item.operadora_logo_url && (
                <img src={item.operadora_logo_url} alt={item.operadora_name} className="w-5 h-5 object-contain flex-shrink-0" />
              )}
              <span className="text-xs font-medium text-muted-foreground truncate">{item.operadora_name}</span>
            </div>
            <Badge className={`${statusColor} text-[10px] px-2 py-0.5 flex-shrink-0 rounded-full`}>{statusLabel}</Badge>
          </div>

          <h3 className="font-bold text-foreground text-sm leading-tight line-clamp-2">{item.title}</h3>
          {item.description && <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>}

          {(item.start_date || item.end_date) && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{formatDate(item.start_date)} — {formatDate(item.end_date)}</span>
            </div>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 4).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-[10px] px-2 py-0.5 rounded-full font-normal">{tag}</Badge>
              ))}
              {item.tags.length > 4 && (
                <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full font-normal">+{item.tags.length - 4}</Badge>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-2 mt-auto">
            <Button size="sm" onClick={() => setShowDetails(true)} className="flex-1 text-xs h-9 rounded-lg">
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              Ver detalhes
            </Button>
            {(item.creative_file_urls?.length > 0 || item.banner_image_url) && (
              <Button size="sm" variant="outline" className="flex-1 text-xs h-9 rounded-lg" onClick={() => {
                const url = item.creative_file_urls?.[0] || item.banner_image_url!;
                fetch(url).then(res => res.blob()).then(blob => {
                  const a = document.createElement('a');
                  a.href = URL.createObjectURL(blob);
                  a.download = item.creative_file_names?.[0] || `${item.title}.png`;
                  a.click();
                  URL.revokeObjectURL(a.href);
                });
              }}>
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Baixar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar {label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Título</Label><Input value={editTitle} onChange={e => setEditTitle(e.target.value)} /></div>
            <div><Label>Operadora</Label><Input value={editOperadora} onChange={e => setEditOperadora(e.target.value)} /></div>
            <div><Label>Descrição</Label><Textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} rows={2} /></div>
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
              <div><Label>Tags</Label><Input value={editTags} onChange={e => setEditTags(e.target.value)} placeholder="tag1, tag2" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Data Início</Label><Input type="date" value={editStartDate} onChange={e => setEditStartDate(e.target.value)} /></div>
              <div><Label>Data Fim</Label><Input type="date" value={editEndDate} onChange={e => setEditEndDate(e.target.value)} /></div>
            </div>
            <div><Label>Detalhes / Regras</Label><Textarea value={editDetails} onChange={e => setEditDetails(e.target.value)} rows={4} placeholder="Regras e detalhes..." /></div>
            <div><Label>Adicionar Criativos</Label><Input type="file" accept="image/*,.pdf" multiple onChange={handleCreativeUpload} /></div>
            {item.creative_file_urls && item.creative_file_urls.length > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground">Criativos atuais ({item.creative_file_urls.length})</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {item.creative_file_urls.map((url, i) => (
                    <img key={i} src={url} alt={`Criativo ${i + 1}`} className="w-full aspect-square object-cover rounded border" />
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1"><Save className="w-4 h-4 mr-1" /> Salvar</Button>
              <Button variant="outline" onClick={handleCancel}><X className="w-4 h-4 mr-1" /> Cancelar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden">
          <div className="flex flex-col md:flex-row h-auto md:max-h-[75vh]">
            {previewImage && (
              <div className="md:w-1/2 flex-shrink-0 bg-muted flex items-center justify-center p-4">
                <img src={previewImage} alt={item.title} className="max-w-full max-h-[65vh] object-contain rounded-lg" />
              </div>
            )}
            <div className={`flex-1 p-6 flex flex-col gap-3 justify-center ${!previewImage ? 'w-full' : ''}`}>
              <DialogHeader className="p-0 space-y-1">
                <DialogTitle className="text-xl font-bold">{item.title}</DialogTitle>
              </DialogHeader>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={statusColor}>{statusLabel}</Badge>
                {item.operadora_logo_url && <img src={item.operadora_logo_url} alt={item.operadora_name} className="w-6 h-6 object-contain" />}
                <span className="text-sm text-muted-foreground">{item.operadora_name}</span>
              </div>
              {item.description && <p className="text-sm text-foreground">{item.description}</p>}
              {item.details_content && (
                <div className="bg-muted rounded-lg p-3">
                  <h4 className="font-semibold text-xs mb-1.5 text-foreground">Regras</h4>
                  <p className="text-xs whitespace-pre-wrap text-muted-foreground leading-relaxed">{item.details_content}</p>
                </div>
              )}
              {(item.start_date || item.end_date) && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Vigência: {formatDate(item.start_date)} — {formatDate(item.end_date)}</span>
                </div>
              )}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag, i) => <Badge key={i} variant="outline" className="text-xs rounded-full">{tag}</Badge>)}
                </div>
              )}
              {(item.creative_file_urls?.length > 0 || item.banner_image_url) && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {item.creative_file_urls?.length > 0 ? (
                    item.creative_file_urls.map((url, i) => (
                      <Button key={i} size="sm" variant="outline" className="text-xs h-8 rounded-lg" onClick={() => {
                        fetch(url).then(res => res.blob()).then(blob => {
                          const a = document.createElement('a');
                          a.href = URL.createObjectURL(blob);
                          a.download = item.creative_file_names?.[i] || `criativo-${i + 1}`;
                          a.click();
                          URL.revokeObjectURL(a.href);
                        });
                      }}>
                        <Download className="w-3 h-3 mr-1.5" />
                        {item.creative_file_names?.[i] || `Arquivo ${i + 1}`}
                      </Button>
                    ))
                  ) : (
                    <Button size="sm" variant="outline" className="text-xs h-8 rounded-lg" onClick={() => {
                      fetch(item.banner_image_url!).then(res => res.blob()).then(blob => {
                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(blob);
                        a.download = `${item.title}.png`;
                        a.click();
                        URL.revokeObjectURL(a.href);
                      });
                    }}>
                      <Download className="w-3 h-3 mr-1.5" />
                      Baixar Criativo
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
