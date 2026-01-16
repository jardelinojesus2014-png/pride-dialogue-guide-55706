import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Video, FileText, Image, Music, ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useOperadoras, useOperadoraContent, Operadora } from '@/hooks/useOperadoras';
import { OperadoraContentDialog } from './OperadoraContentDialog';

interface OperadorasSectionProps {
  isAdmin: boolean;
  userViewMode: boolean;
}

export const OperadorasSection = ({ isAdmin, userViewMode }: OperadorasSectionProps) => {
  const { operadoras, loading, addOperadora, deleteOperadora } = useOperadoras();
  const [expandedOperadora, setExpandedOperadora] = useState<string | null>(null);
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
      <div className="bg-card rounded-lg shadow-xl p-12 text-center border-2 border-border">
        <p className="text-muted-foreground">Carregando operadoras...</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-xl p-6 border-2 border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-primary">🎓 Treinamentos de Operadoras</h2>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {operadoras.map((operadora) => (
            <OperadoraCard
              key={operadora.id}
              operadora={operadora}
              isExpanded={expandedOperadora === operadora.id}
              onToggle={() => setExpandedOperadora(
                expandedOperadora === operadora.id ? null : operadora.id
              )}
              showAdminControls={showAdminControls}
              onDelete={() => handleDeleteOperadora(operadora)}
            />
          ))}
        </div>
      )}

      {/* Expanded Content Area */}
      {expandedOperadora && (
        <ExpandedOperadoraContent
          operadoraId={expandedOperadora}
          operadoraName={operadoras.find(o => o.id === expandedOperadora)?.name || ''}
          showAdminControls={showAdminControls}
          onClose={() => setExpandedOperadora(null)}
        />
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
}

const OperadoraCard = ({ operadora, isExpanded, onToggle, showAdminControls, onDelete }: OperadoraCardProps) => {
  return (
    <div className="relative group">
      <button
        onClick={onToggle}
        className={`w-full aspect-square rounded-lg border-2 transition-all duration-200 overflow-hidden bg-white hover:shadow-lg hover:scale-105 ${
          isExpanded 
            ? 'border-accent ring-2 ring-accent/50 shadow-lg' 
            : 'border-border hover:border-accent/50'
        }`}
      >
        <img
          src={operadora.logo_url}
          alt={operadora.name}
          className="w-full h-full object-contain p-2"
        />
      </button>
      
      {showAdminControls && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-destructive/90"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}

      <p className="text-center text-xs font-medium mt-2 text-foreground truncate">
        {operadora.name}
      </p>
    </div>
  );
};

interface ExpandedOperadoraContentProps {
  operadoraId: string;
  operadoraName: string;
  showAdminControls: boolean;
  onClose: () => void;
}

const ExpandedOperadoraContent = ({ operadoraId, operadoraName, showAdminControls, onClose }: ExpandedOperadoraContentProps) => {
  const { content, loading, addContent, deleteContent } = useOperadoraContent(operadoraId);
  const [showContentDialog, setShowContentDialog] = useState(false);

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
    <div className="mt-6 p-6 bg-muted/50 rounded-lg border-2 border-accent/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-primary flex items-center gap-2">
          Conteúdos de {operadoraName}
          <ChevronUp className="w-5 h-5 cursor-pointer hover:text-accent" onClick={onClose} />
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
                  <div className="mt-3">
                    {item.content_type === 'video' && isEmbeddable(item.file_url) ? (
                      <div className="aspect-video w-full max-w-2xl rounded-lg overflow-hidden">
                        <iframe
                          src={formatVideoUrl(item.file_url)}
                          className="w-full h-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
                  <button
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir este conteúdo?')) {
                        deleteContent(item.id, item.file_path);
                      }
                    }}
                    className="flex-shrink-0 p-2 text-destructive hover:bg-destructive/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
