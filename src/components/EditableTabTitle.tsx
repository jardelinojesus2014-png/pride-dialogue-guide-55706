import { useState, useEffect } from 'react';
import { Edit, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
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
}: EditableTabTitleProps) => {
  const { data: sectionTitles = {} } = useSectionTitles();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editShortTitle, setEditShortTitle] = useState('');
  const updateTitle = useUpdateSectionTitle();

  const currentTitle = sectionTitles[sectionKey]?.title || defaultTitle;
  const currentShortTitle = sectionTitles[sectionKey]?.subtitle || defaultShortTitle || '';

  useEffect(() => {
    setEditTitle(currentTitle);
    setEditShortTitle(currentShortTitle);
  }, [currentTitle, currentShortTitle]);

  const effectiveIsAdmin = isAdmin && !userViewMode;

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    updateTitle.mutate({
      sectionKey,
      title: editTitle,
      subtitle: editShortTitle,
    });
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setEditTitle(currentTitle);
    setEditShortTitle(currentShortTitle);
    setIsEditing(false);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEditing(true);
  };

  if (isEditing && effectiveIsAdmin) {
    return (
      <div className={cn("flex flex-col gap-2 p-2 min-w-[200px]", className)} onClick={(e) => e.stopPropagation()}>
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="text-xs font-bold h-8"
          placeholder="Título completo"
          onClick={(e) => e.stopPropagation()}
        />
        {showShortOnMobile && (
          <Input
            value={editShortTitle}
            onChange={(e) => setEditShortTitle(e.target.value)}
            className="text-xs h-7"
            placeholder="Título curto (mobile)"
            onClick={(e) => e.stopPropagation()}
          />
        )}
        <div className="flex gap-1 justify-center">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={updateTitle.isPending}
            className="bg-green-600 hover:bg-green-700 h-7 px-2 text-xs"
          >
            <Check className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            className="h-7 px-2 text-xs"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative group flex items-center justify-center gap-1.5", className)}>
      {icon}
      {showShortOnMobile ? (
        <>
          <span className="hidden md:inline text-center leading-tight whitespace-pre-line">
            {currentTitle}
          </span>
          <span className="md:hidden">{currentShortTitle || currentTitle}</span>
        </>
      ) : (
        <span>{currentTitle}</span>
      )}
      {effectiveIsAdmin && (
        <Button
          size="sm"
          variant="ghost"
          className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 p-0 bg-accent/80 hover:bg-accent"
          onClick={handleEditClick}
        >
          <Edit className="w-3 h-3 text-accent-foreground" />
        </Button>
      )}
    </div>
  );
};
