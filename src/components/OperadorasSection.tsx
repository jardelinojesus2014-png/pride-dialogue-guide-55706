import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ChevronDown, ChevronUp, ChevronRight, Video, FileText, Image, Music, ExternalLink, Download, Pencil, GraduationCap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useOperadoras, useOperadoraContent, Operadora, OperadoraContent } from '@/hooks/useOperadoras';
import { OperadoraContentDialog } from './OperadoraContentDialog';
import { EditableBanner } from './EditableBanner';
interface OperadorasSectionProps {
  isAdmin: boolean;
  userViewMode: boolean;
  isOperadoraFavorite?: (id: string) => boolean;
  onToggleOperadoraFavorite?: (op: Operadora) => void;
  onOperadoraOpened?: (op: Operadora) => void;
  embedded?: boolean;
}

export const OperadorasSection = ({
  isAdmin,
  userViewMode,
  isOperadoraFavorite,
  onToggleOperadoraFavorite,
  onOperadoraOpened,
  embedded,
}: OperadorasSectionProps) => {
  const { operadoras, loading, addOperadora, updateOperadoraLogo, deleteOperadora } = useOperadoras();
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLogo, setNewLogo] = useState<File | null>(null);

  const showAdminControls = isAdmin && !userViewMode;

  const handleAddOperadora = async () => {
    if (!newName.trim() || !newLogo) return;
    await addOperadora(newName.trim(), newLogo);
    setNewName('');
    setNewLogo(null);
    setShowAddDialog(false);
  };

  const handleDeleteOperadora = async (operadora: Operadora) => {
    if (confirm(`Tem certeza que deseja excluir a operadora "${operadora.name}"? Todos os conteúdos serão removidos.`)) {
      await deleteOperadora(operadora.id, operadora.logo_path);
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-2xl shadow-xl p-6 border border-border/60">
        <div className="h-7 w-64 bg-muted rounded-lg animate-pulse mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl border border-border/40 bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={embedded ? '' : 'bg-card rounded-2xl shadow-xl p-6 sm:p-8 border border-border/60'}>
      {!embedded && <EditableBanner sectionKey="banner_operadoras" isAdmin={isAdmin} userViewMode={userViewMode} />}
      <div className={`flex flex-col sm:flex-row sm:items-center gap-4 mb-8 ${embedded ? 'sm:justify-end' : 'sm:justify-between'}`}>
        {!embedded && (
          <div className="flex items-start gap-3">
            <div className="hidden sm:flex flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-accent items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-primary tracking-tight">Treinamentos de Operadoras</h2>
                {operadoras.length > 0 && (
                  <span className="text-xs font-bold text-accent-foreground bg-accent px-2 py-0.5 rounded-full">
                    {operadoras.length}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Selecione uma operadora para acessar vídeos, materiais e conteúdos de treinamento.
              </p>
            </div>
          </div>
        )}
        {showAdminControls && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Operadora
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Operadora</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="operadora-name">Nome da Operadora</Label>
                  <Input
                    id="operadora-name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ex: Unimed, Bradesco Saúde..."
                  />
                </div>
                <div>
                  <Label htmlFor="operadora-logo">Logo da Operadora</Label>
                  <Input
                    id="operadora-logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewLogo(e.target.files?.[0] || null)}
                  />
                </div>
                <Button 
                  onClick={handleAddOperadora} 
                  disabled={!newName.trim() || !newLogo}
                  className="w-full"
                >
                  Adicionar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {operadoras.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {showAdminControls 
              ? 'Nenhuma operadora cadastrada. Clique em "Adicionar Operadora" para começar.'
              : 'Nenhuma operadora cadastrada ainda.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {operadoras.map((operadora) => (
            <OperadoraCard
              key={operadora.id}
              operadora={operadora}
              isExpanded={false}
              onToggle={() => {
                onOperadoraOpened?.(operadora);
                navigate(`/operadora/${operadora.id}`);
              }}
              showAdminControls={showAdminControls}
              onDelete={() => handleDeleteOperadora(operadora)}
              onReplaceLogo={(file) => updateOperadoraLogo(operadora.id, file, operadora.logo_path)}
              isFavorite={isOperadoraFavorite?.(`operadora:${operadora.id}`) || false}
              onToggleFavorite={() => onToggleOperadoraFavorite?.(operadora)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface OperadoraCardProps {
  operadora: Operadora;
  isExpanded: boolean;
  onToggle: () => void;
  showAdminControls: boolean;
  onDelete: () => void;
  onReplaceLogo: (file: File) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const OperadoraCard = ({ operadora, isExpanded, onToggle, showAdminControls, onDelete, onReplaceLogo, isFavorite, onToggleFavorite }: OperadoraCardProps) => {
  // Detecta automaticamente a cor de fundo da marca (pixel do canto do logo)
  // para preencher o quadrado inteiro sem cortar o logo.
  const [bgColor, setBgColor] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setBgColor(null);
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const w = canvas.width;
        const h = canvas.height;

        // 1) Amostra os 4 cantos, considerando apenas os OPACOS (alpha alto)
        const corners = [
          ctx.getImageData(2, 2, 1, 1).data,
          ctx.getImageData(w - 3, 2, 1, 1).data,
          ctx.getImageData(2, h - 3, 1, 1).data,
          ctx.getImageData(w - 3, h - 3, 1, 1).data,
        ];
        const opaque = corners.filter((p) => p[3] > 200);

        if (opaque.length >= 2) {
          // Logo com fundo sólido → usa a cor de canto mais frequente
          const counts: Record<string, { rgb: string; n: number }> = {};
          opaque.forEach((p) => {
            const key = `${p[0]},${p[1]},${p[2]}`;
            counts[key] = counts[key] || { rgb: `rgb(${p[0]}, ${p[1]}, ${p[2]})`, n: 0 };
            counts[key].n += 1;
          });
          const best = Object.values(counts).sort((a, b) => b.n - a.n)[0];
          if (!cancelled && best) setBgColor(best.rgb);
          return;
        }

        // 2) Logo com fundo transparente → escolhe o fundo pela luminância do logo
        const data = ctx.getImageData(0, 0, w, h).data;
        let rs = 0, gs = 0, bs = 0, count = 0;
        for (let i = 0; i < data.length; i += 40) {
          if (data[i + 3] > 128) {
            rs += data[i];
            gs += data[i + 1];
            bs += data[i + 2];
            count += 1;
          }
        }
        if (count === 0) {
          if (!cancelled) setBgColor('#ffffff');
          return;
        }
        const lum = (0.299 * rs + 0.587 * gs + 0.114 * bs) / count;
        // Logo claro (ex: texto branco) → fundo escuro; logo escuro/colorido → fundo branco
        if (!cancelled) setBgColor(lum > 150 ? '#13234b' : '#ffffff');
      } catch {
        // Falha de CORS/leitura — mantém o fundo padrão
        if (!cancelled) setBgColor('#ffffff');
      }
    };
    img.src = operadora.logo_url;
    return () => {
      cancelled = true;
    };
  }, [operadora.logo_url]);

  return (
    <div className="relative group">
      <button
        onClick={onToggle}
        className={`w-full aspect-square rounded-2xl border overflow-hidden text-left transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl ${
          isExpanded
            ? 'border-accent ring-2 ring-accent/50 shadow-lg -translate-y-1'
            : 'border-border/40 hover:border-accent/60'
        }`}
      >
        <div
          className="relative w-full h-full transition-colors duration-300"
          style={{ backgroundColor: bgColor || '#ffffff' }}
        >
          {/* Logo aparece inteiro; o quadrado é pintado com a cor da marca */}
          <img
            src={operadora.logo_url}
            alt={operadora.name}
            crossOrigin="anonymous"
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay de dica no hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
            <span className="text-[11px] font-bold text-white bg-primary/80 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-0.5 shadow-lg">
              Ver treinamentos <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </button>

      {/* Favoritar (todos os usuários) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className={`absolute top-2 left-2 p-1.5 rounded-full transition-all z-10 ${
          isFavorite
            ? 'bg-white/90 text-accent shadow-lg'
            : 'bg-black/30 text-white opacity-0 group-hover:opacity-100 hover:bg-black/50'
        }`}
        title={isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
      >
        <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-accent' : ''}`} />
      </button>

      {showAdminControls && (
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          {/* Trocar logo */}
          <label
            onClick={(e) => e.stopPropagation()}
            className="cursor-pointer bg-blue-500 text-white rounded-full p-1.5 shadow-lg hover:bg-blue-600 hover:scale-110 transition-all"
            title="Trocar logo"
          >
            <Pencil className="w-3 h-3" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onReplaceLogo(file);
                e.target.value = '';
              }}
            />
          </label>
          {/* Excluir */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="bg-destructive text-destructive-foreground rounded-full p-1.5 shadow-lg hover:bg-destructive/90 hover:scale-110 transition-all"
            title="Excluir operadora"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

interface ExpandedOperadoraContentProps {
  operadoraId: string;
  operadoraName: string;
  showAdminControls: boolean;
  onClose: () => void;
  embedded?: boolean;
  hideVideos?: boolean;
}

export const ExpandedOperadoraContent = ({ operadoraId, operadoraName, showAdminControls, onClose, embedded, hideVideos }: ExpandedOperadoraContentProps) => {
  const { content: allContent, loading, addContent, deleteContent, updateContent } = useOperadoraContent(operadoraId);
  const content = hideVideos ? allContent.filter((c) => c.content_type !== 'video') : allContent;
  const [showContentDialog, setShowContentDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<OperadoraContent | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleEditClick = (item: OperadoraContent) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditDescription(item.description || '');
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    await updateContent(editingItem.id, editTitle, editDescription || null);
    setEditingItem(null);
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'pdf': return <FileText className="w-5 h-5" />;
      case 'photo': return <Image className="w-5 h-5" />;
      case 'audio': return <Music className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'video': return 'Vídeo';
      case 'pdf': return 'PDF';
      case 'photo': return 'Foto';
      case 'audio': return 'Áudio';
      default: return type;
    }
  };

  const formatVideoUrl = (url: string) => {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('/').pop()?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Google Drive
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1];
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
    return url;
  };

  const isEmbeddable = (url: string) => {
    return url.includes('youtube') || url.includes('youtu.be') || url.includes('drive.google.com');
  };

  return (
    <div className={embedded ? '' : 'mt-6 p-6 bg-muted/50 rounded-lg border-2 border-accent/30 scroll-mt-24'}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-primary flex items-center gap-2">
          {embedded ? 'Materiais e downloads' : `Conteúdos de ${operadoraName}`}
          {!embedded && <ChevronUp className="w-5 h-5 cursor-pointer hover:text-accent" onClick={onClose} />}
        </h3>
        {showAdminControls && (
          <>
            <Button 
              onClick={() => setShowContentDialog(true)}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Conteúdo
            </Button>
            <OperadoraContentDialog
              open={showContentDialog}
              onOpenChange={setShowContentDialog}
              onAdd={addContent}
            />
          </>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Conteúdo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
              />
            </div>
            <Button onClick={handleSaveEdit} disabled={!editTitle.trim()} className="w-full">
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {loading ? (
        <p className="text-muted-foreground">Carregando conteúdos...</p>
      ) : content.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          {showAdminControls 
            ? 'Nenhum conteúdo cadastrado. Clique em "Adicionar Conteúdo" para começar.'
            : 'Nenhum conteúdo disponível para esta operadora.'}
        </p>
      ) : (
        <div className="grid gap-4">
          {content.map((item) => (
            <div 
              key={item.id} 
              className="bg-card rounded-lg p-4 border border-border group relative"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                  {getContentIcon(item.content_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium bg-accent/20 text-accent px-2 py-0.5 rounded">
                      {getContentTypeLabel(item.content_type)}
                    </span>
                    <h4 className="font-semibold text-foreground truncate">{item.title}</h4>
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  )}
                  
                  {/* Content Preview */}
                  <div className="mt-3 flex justify-center">
                    {item.content_type === 'video' && isEmbeddable(item.file_url) ? (
                      <div className="aspect-video w-full max-w-2xl rounded-lg overflow-hidden">
                        <iframe
                          src={`${formatVideoUrl(item.file_url)}?rel=0&modestbranding=1&showinfo=0`}
                          className="w-full h-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                        />
                      </div>
                    ) : item.content_type === 'video' ? (
                      <video 
                        src={item.file_url} 
                        controls 
                        className="max-w-2xl w-full rounded-lg"
                      />
                    ) : item.content_type === 'photo' ? (
                      <img 
                        src={item.file_url} 
                        alt={item.title}
                        className="max-w-md rounded-lg"
                      />
                    ) : item.content_type === 'audio' ? (
                      <audio src={item.file_url} controls className="w-full max-w-md" />
                    ) : item.content_type === 'pdf' ? (
                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-accent hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Abrir PDF
                      </a>
                    ) : null}
                  </div>
                </div>

                {showAdminControls && (
                  <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="p-2 text-accent hover:bg-accent/10 rounded-lg"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Tem certeza que deseja excluir este conteúdo?')) {
                          deleteContent(item.id, item.file_path);
                        }
                      }}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
