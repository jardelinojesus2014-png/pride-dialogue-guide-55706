import { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useUpdateSectionTitle, useSectionTitles } from '@/hooks/useSectionTitles';
import { cn } from '@/lib/utils';

interface EditableTabTitleProps {
  sectionKey: string;
  defaultTitle: string;
  defaultShortTitle?: string;
  isAdmin: boolean;
  userViewMode?: boolean;
  icon?: React.ReactNode;
  showShortOnMobile?: boolean;
  className?: string;
  iconOnly?: boolean;
  showEdit?: boolean;
  showLabel?: boolean;
}

export const EditableTabTitle = ({
  sectionKey,
  defaultTitle,
  defaultShortTitle,
  isAdmin,
  userViewMode = false,
  icon,
  showShortOnMobile = true,
  className = '',
  showEdit = false,
}: EditableTabTitleProps) => {
  const { data: sectionTitles = {} } = useSectionTitles();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editShortTitle, setEditShortTitle] = useState('');
  const updateTitle = useUpdateSectionTitle();

  const currentTitle = sectionTitles[sectionKey]?.title || defaultTitle;
  const currentShortTitle = sectionTitles[sectionKey]?.subtitle || defaultShortTitle || '';

  const effectiveIsAdmin = isAdmin && !userViewMode;
  const label = currentShortTitle || currentTitle.replace(/\n/g, ' ');

  // Preenche os campos quando o modal abre
  useEffect(() => {
    if (isEditing) {
      setEditTitle(currentTitle);
      setEditShortTitle(currentShortTitle);
    }
  }, [isEditing, currentTitle, currentShortTitle]);

  const openEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEditing(true);
  };

  const handleSave = () => {
    updateTitle.mutate({ sectionKey, title: editTitle, subtitle: editShortTitle });
    setIsEditing(false);
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-1 min-h-[42px]", className)} title={label}>
      {icon}
      <div className="flex items-center gap-1">
        <span className="text-[11px] font-semibold text-center leading-tight max-w-[86px] line-clamp-2">
          {label}
        </span>
        {effectiveIsAdmin && showEdit && (
          <button
            type="button"
            onClick={openEdit}
            className="flex-shrink-0 flex items-center justify-center h-4 w-4 rounded bg-black/25 hover:bg-black/40 transition-colors"
            title="Editar nome da aba"
          >
            <Edit className="w-2.5 h-2.5" />
          </button>
        )}
      </div>

      {/* Modal de edição do nome da aba */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Editar nome da aba</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor={`tab-title-${sectionKey}`}>Nome</Label>
              <Input
                id={`tab-title-${sectionKey}`}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Nome da aba"
              />
            </div>
            {showShortOnMobile && (
              <div>
                <Label htmlFor={`tab-short-${sectionKey}`}>Nome curto (exibido na barra)</Label>
                <Input
                  id={`tab-short-${sectionKey}`}
                  value={editShortTitle}
                  onChange={(e) => setEditShortTitle(e.target.value)}
                  placeholder="Ex: Treinamentos, Materiais..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Deixe curto para a barra de abas ficar organizada. Se vazio, usa o nome completo.
                </p>
              </div>
            )}
            <Button onClick={handleSave} disabled={updateTitle.isPending || !editTitle.trim()} className="w-full">
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
