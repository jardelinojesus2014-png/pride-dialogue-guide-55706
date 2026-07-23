import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit2, FolderOpen, Building2, BookOpen, Video, FileText, Headphones, Image, X, Save, GraduationCap, Construction, Star, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTrainingCategories, useTrainingCategoryContent, TrainingCategory } from '@/hooks/useTrainingCategories';
import { useTrainingSearch, TrainingSearchItem } from '@/hooks/useTrainingSearch';
import { useTrainingActivity, ActivityItem } from '@/hooks/useTrainingActivity';
import { useAuth } from '@/hooks/useAuth';
import { TrainingSearchBar } from './TrainingSearchBar';
import { TrainingQuickAccess } from './TrainingQuickAccess';
import { TrainingAdminPanel } from './TrainingAdminPanel';
import { logTrainingEvent } from '@/lib/trainingEvents';

interface TrainingCategoriesSectionProps {
  isAdmin: boolean;
  userViewMode: boolean;
}

const ICON_OPTIONS = [
  { value: 'folder', label: 'Pasta', icon: FolderOpen },
  { value: 'building-2', label: 'Prédio', icon: Building2 },
  { value: 'book-open', label: 'Livro', icon: BookOpen },
  { value: 'video', label: 'Vídeo', icon: Video },
  { value: 'file-text', label: 'Documento', icon: FileText },
  { value: 'headphones', label: 'Áudio', icon: Headphones },
  { value: 'graduation-cap', label: 'Graduação', icon: GraduationCap },
];

export const getIconComponent = (iconName: string) => {
  const iconOption = ICON_OPTIONS.find(opt => opt.value === iconName);
  return iconOption?.icon || FolderOpen;
};

export const TrainingCategoriesSection = ({ isAdmin, userViewMode }: TrainingCategoriesSectionProps) => {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useTrainingCategories();
  const { items: searchItems } = useTrainingSearch();
  const { user } = useAuth();
  const { favorites, recents, isFavorite, toggleFavorite, removeFavorite, addRecent, clearRecents } = useTrainingActivity(user?.id);
  const navigate = useNavigate();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TrainingCategory | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newIcon, setNewIcon] = useState('folder');
  const [newShowBanner, setNewShowBanner] = useState(false);
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');

  const showAdminControls = isAdmin && !userViewMode;

  const handleAddCategory = async () => {
    if (!newTitle.trim()) return;
    await addCategory(newTitle, newDescription, newIcon, newShowBanner, newBannerSubtitle);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const resetForm = () => {
    setNewTitle('');
    setNewDescription('');
    setNewIcon('folder');
    setNewShowBanner(false);
    setNewBannerSubtitle('');
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !newTitle.trim()) return;
    await updateCategory(editingCategory.id, newTitle, newDescription, newIcon, newShowBanner, newBannerSubtitle);
    setEditingCategory(null);
    resetForm();
  };

  const handleDeleteCategory = async (category: TrainingCategory) => {
    if (category.is_operadoras_section) {
      return; // Cannot delete the operadoras section
    }
    if (confirm(`Tem certeza que deseja excluir a categoria "${category.title}"?`)) {
      await deleteCategory(category.id);
    }
  };

  const openEditDialog = (category: TrainingCategory) => {
    setEditingCategory(category);
    setNewTitle(category.title);
    setNewDescription(category.description || '');
    setNewIcon(category.icon);
    setNewShowBanner(category.show_banner);
    setNewBannerSubtitle(category.banner_subtitle || '');
  };

  // Navega para a página da categoria (Central de conhecimento)
  const goToCategory = (categoryId: string) => navigate(`/central/${categoryId}`);

  // Navega direto para a página (documentação) da operadora
  const goToOperadora = (operadoraId: string) => navigate(`/operadora/${operadoraId}`);

  // Conversores para o formato de favoritos/recentes
  const categoryActivity = (category: TrainingCategory): ActivityItem => ({
    id: `category:${category.id}`,
    kind: 'category',
    title: category.title,
    refId: category.id,
  });

  const searchItemToActivity = (it: TrainingSearchItem): ActivityItem => {
    if (it.kind === 'operadora') {
      return { id: `operadora:${it.parentId}`, kind: 'operadora', title: it.title, refId: it.parentId };
    }
    if (it.kind === 'category') {
      return { id: `category:${it.parentId}`, kind: 'category', title: it.title, refId: it.parentId };
    }
    return {
      id: `content:${it.key}`,
      kind: 'content',
      title: it.title,
      subtitle: it.parentName,
      contentType: it.contentType,
      fileUrl: it.fileUrl,
    };
  };

  // Abre um item (favorito, recente ou resultado de busca) e registra em "recentes"
  const openActivity = (item: ActivityItem) => {
    if (item.kind === 'content' && item.fileUrl) {
      window.open(item.fileUrl, '_blank', 'noopener,noreferrer');
    } else if (item.kind === 'operadora' && item.refId) {
      goToOperadora(item.refId);
    } else if (item.kind === 'category' && item.refId) {
      goToCategory(item.refId);
    }
    addRecent(item);
  };

  const handleSearchSelect = (it: TrainingSearchItem) => {
    if (it.kind === 'topic' && it.parentId) {
      const anchor = it.topicId ? `#topic-${it.topicId}` : '';
      if (it.parentType === 'category') {
        navigate(`/central/${it.parentId}${anchor}`);
        addRecent({ id: `category:${it.parentId}`, kind: 'category', title: it.parentName || it.title, refId: it.parentId });
      } else {
        navigate(`/operadora/${it.parentId}${anchor}`);
        addRecent({ id: `operadora:${it.parentId}`, kind: 'operadora', title: it.parentName || it.title, refId: it.parentId });
      }
      return;
    }
    openActivity(searchItemToActivity(it));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles de admin: painel de analytics + nova categoria */}
      {showAdminControls && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowAdminPanel((v) => !v)}
              className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-sm font-medium transition-colors ${
                showAdminPanel ? 'bg-accent text-accent-foreground' : 'bg-accent/10 text-primary hover:bg-accent/20'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              {showAdminPanel ? 'Ocultar painel' : 'Painel do admin'}
            </button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-foreground">
                  <Plus className="w-3.5 h-3.5" />
                  Nova Categoria
                </Button>
              </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Categoria de Treinamento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Nome da categoria"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Descrição (opcional)</label>
                  <Textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Descrição da categoria"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Ícone</label>
                  <Select value={newIcon} onValueChange={setNewIcon}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map((option) => {
                        const IconComp = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <IconComp className="w-4 h-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Construction className="w-4 h-4 text-orange-500" />
                    <Label htmlFor="show-banner-add" className="text-sm font-medium">
                      Exibir banner "Em Construção"
                    </Label>
                  </div>
                  <Switch
                    id="show-banner-add"
                    checked={newShowBanner}
                    onCheckedChange={setNewShowBanner}
                  />
                </div>
                {newShowBanner && (
                  <div>
                    <label className="text-sm font-medium">Subtítulo do Banner</label>
                    <Input
                      value={newBannerSubtitle}
                      onChange={(e) => setNewBannerSubtitle(e.target.value)}
                      placeholder="Ex: Essa seção está sendo desenvolvida..."
                    />
                  </div>
                )}
                <Button onClick={handleAddCategory} className="w-full">
                  Adicionar Categoria
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          </div>
          {showAdminPanel && <TrainingAdminPanel />}
        </div>
      )}

      {/* Barra de pesquisa — grande e centralizada */}
      <div className="w-full max-w-2xl mx-auto">
        <TrainingSearchBar
          items={searchItems}
          onSelect={handleSearchSelect}
          onSearch={(q) => logTrainingEvent(user?.id, 'search', null, q)}
          className="w-full"
        />
      </div>

      {/* Favoritos + Acessados recentemente */}
      <TrainingQuickAccess
        favorites={favorites}
        recents={recents}
        onOpen={openActivity}
        onRemoveFavorite={removeFavorite}
        onClearRecents={clearRecents}
      />

      {/* Edit Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium">Título</label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Nome da categoria"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descrição (opcional)</label>
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Descrição da categoria"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Ícone</label>
              <Select value={newIcon} onValueChange={setNewIcon}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((option) => {
                    const IconComp = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <IconComp className="w-4 h-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Construction className="w-4 h-4 text-orange-500" />
                <Label htmlFor="show-banner-edit" className="text-sm font-medium">
                  Exibir banner "Em Construção"
                </Label>
              </div>
              <Switch
                id="show-banner-edit"
                checked={newShowBanner}
                onCheckedChange={setNewShowBanner}
              />
            </div>
            {newShowBanner && (
              <div>
                <label className="text-sm font-medium">Subtítulo do Banner</label>
                <Input
                  value={newBannerSubtitle}
                  onChange={(e) => setNewBannerSubtitle(e.target.value)}
                  placeholder="Ex: Essa seção está sendo desenvolvida..."
                />
              </div>
            )}
            <Button onClick={handleUpdateCategory} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Áreas de conhecimento */}
      <h2 className="text-base font-bold text-foreground pt-2 flex items-center gap-2">
        <span className="inline-block w-1 h-5 rounded-full bg-accent" />
        Áreas de conhecimento
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => {
          const IconComponent = getIconComponent(category.icon);

          return (
            <div key={category.id} className="relative group">
              <button
                onClick={() => {
                  addRecent(categoryActivity(category));
                  goToCategory(category.id);
                }}
                className="w-full h-full px-6 py-7 rounded-2xl border border-border bg-card text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-accent/50"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                    <IconComponent className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-lg text-primary">{category.title}</h3>
                  {category.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 max-w-md">
                      {category.description}
                    </p>
                  )}
                </div>
              </button>

              {/* Favoritar (todos os usuários) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(categoryActivity(category));
                }}
                className={`absolute top-2 left-2 p-1.5 rounded-full transition-all z-10 ${
                  isFavorite(`category:${category.id}`)
                    ? 'text-accent'
                    : 'text-muted-foreground/40 opacity-0 group-hover:opacity-100 hover:text-accent'
                }`}
                title={isFavorite(`category:${category.id}`) ? 'Remover dos favoritos' : 'Favoritar'}
              >
                <Star className={`w-4 h-4 ${isFavorite(`category:${category.id}`) ? 'fill-accent' : ''}`} />
              </button>

              {/* Admin actions */}
              {showAdminControls && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditDialog(category);
                    }}
                    className="p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                    title="Editar categoria"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  {!category.is_operadoras_section && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category);
                      }}
                      className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                      title="Excluir categoria"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Content Section for non-operadoras categories
interface CategoryContentSectionProps {
  categoryId: string;
  categoryName: string;
  showAdminControls: boolean;
  onClose: () => void;
}

export const CategoryContentSection = ({ categoryId, categoryName, showAdminControls, onClose }: CategoryContentSectionProps) => {
  const { content, loading, addContent, deleteContent } = useTrainingCategoryContent(categoryId);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [contentType, setContentType] = useState<'video' | 'pdf' | 'photo' | 'audio'>('video');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleAddContent = async () => {
    if (!title.trim()) return;
    
    const fileOrUrl = file || fileUrl;
    if (!fileOrUrl) return;

    await addContent(contentType, title, description, fileOrUrl);
    setTitle('');
    setDescription('');
    setFileUrl('');
    setFile(null);
    setIsAddDialogOpen(false);
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'pdf': return FileText;
      case 'audio': return Headphones;
      case 'photo': return Image;
      default: return FileText;
    }
  };

  return (
    <div className="bg-card rounded-lg border-2 border-border p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">{categoryName}</h3>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>

      {showAdminControls && (
        <div className="mb-6">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Conteúdo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Conteúdo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium">Tipo de Conteúdo</label>
                  <Select value={contentType} onValueChange={(v) => setContentType(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Vídeo</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="audio">Áudio</SelectItem>
                      <SelectItem value="photo">Foto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título do conteúdo"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Descrição (opcional)</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição"
                  />
                </div>
                {contentType === 'video' ? (
                  <div>
                    <label className="text-sm font-medium">URL do Vídeo (YouTube, Vimeo, etc.)</label>
                    <Input
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-sm font-medium">Arquivo</label>
                    <Input
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      accept={
                        contentType === 'pdf' ? '.pdf' :
                        contentType === 'audio' ? 'audio/*' :
                        'image/*'
                      }
                    />
                  </div>
                )}
                <Button onClick={handleAddContent} className="w-full">
                  Adicionar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
        </div>
      ) : content.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          Nenhum conteúdo disponível nesta categoria.
        </p>
      ) : (
        <div className="grid gap-4">
          {content.map((item) => {
            const IconComp = getContentIcon(item.content_type);
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border border-border"
              >
                <div className="p-2 bg-accent/10 rounded-lg">
                  <IconComp className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{item.title}</h4>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-accent text-accent-foreground rounded text-sm hover:bg-accent/90"
                  >
                    Abrir
                  </a>
                  {showAdminControls && (
                    <button
                      onClick={() => deleteContent(item.id, item.file_path)}
                      className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrainingCategoriesSection;
