import { useState } from 'react';
import { Plus, Trash2, Edit2, ChevronUp, FolderOpen, Building2, BookOpen, Video, FileText, Headphones, Image, X, Save, GraduationCap, Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTrainingCategories, useTrainingCategoryContent, TrainingCategory } from '@/hooks/useTrainingCategories';
import { OperadorasSection } from './OperadorasSection';

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

const getIconComponent = (iconName: string) => {
  const iconOption = ICON_OPTIONS.find(opt => opt.value === iconName);
  return iconOption?.icon || FolderOpen;
};

export const TrainingCategoriesSection = ({ isAdmin, userViewMode }: TrainingCategoriesSectionProps) => {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useTrainingCategories();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Controls */}
      {showAdminControls && (
        <div className="flex justify-end">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Plus className="w-4 h-4 mr-2" />
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
      )}

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

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const IconComponent = getIconComponent(category.icon);
          const isExpanded = expandedCategory === category.id;

          return (
            <div key={category.id} className="relative group">
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                className={`w-full p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-lg hover:scale-105 bg-card ${
                  isExpanded
                    ? 'border-accent ring-2 ring-accent/50 shadow-lg'
                    : 'border-border hover:border-accent/50'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-full bg-accent/10">
                    <IconComponent className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-bold text-center text-foreground">{category.title}</h3>
                  {category.description && (
                    <p className="text-sm text-muted-foreground text-center line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
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

      {/* Expanded Category Content */}
      {expandedCategory && (() => {
        const expandedCat = categories.find(c => c.id === expandedCategory);
        return (
          <div className="mt-6 space-y-4">
            {/* Under Construction Banner */}
            {expandedCat?.show_banner && (
              <div className="bg-card rounded-lg shadow-xl p-8 text-center border-2 border-border">
                <div className="inline-block bg-gradient-to-r from-orange-500 to-red-600 rounded-full p-4 mb-4 shadow-2xl">
                  <Construction className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-black text-primary mb-2">🚧 Em Construção</h2>
                {expandedCat.banner_subtitle && (
                  <p className="text-lg text-muted-foreground">
                    {expandedCat.banner_subtitle}
                  </p>
                )}
              </div>
            )}
            
            {expandedCat?.is_operadoras_section ? (
              <OperadorasSection isAdmin={isAdmin} userViewMode={userViewMode} />
            ) : (
              <CategoryContentSection
                categoryId={expandedCategory}
                categoryName={expandedCat?.title || ''}
                showAdminControls={showAdminControls}
                onClose={() => setExpandedCategory(null)}
              />
            )}
          </div>
        );
      })()}

      {/* Minimize Button */}
      {expandedCategory && (
        <button
          onClick={() => setExpandedCategory(null)}
          className="fixed bottom-6 right-6 bg-gradient-hero hover:opacity-90 text-accent font-bold px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 transition-all duration-300 hover:scale-110 z-50 border-2 border-accent"
          title="Minimizar todas as seções"
        >
          <ChevronUp className="w-5 h-5" />
          <span className="hidden sm:inline">Minimizar Tudo</span>
        </button>
      )}
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

const CategoryContentSection = ({ categoryId, categoryName, showAdminControls, onClose }: CategoryContentSectionProps) => {
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
