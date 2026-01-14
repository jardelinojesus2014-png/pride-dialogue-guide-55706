import { useState, useEffect } from 'react';
import { Edit, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useUpdateSectionTitle, useSectionTitles } from '@/hooks/useSectionTitles';
import { cn } from '@/lib/utils';

interface EditableAccordionTitleProps {
  sectionKey: string;
  defaultTitle: string;
  isAdmin: boolean;
  userViewMode?: boolean;
  className?: string;
}

export const EditableAccordionTitle = ({
  sectionKey,
  defaultTitle,
  isAdmin,
  userViewMode = false,
  className = '',
}: EditableAccordionTitleProps) => {
  const { data: sectionTitles = {} } = useSectionTitles();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const updateTitle = useUpdateSectionTitle();

  const currentTitle = sectionTitles[sectionKey]?.title || defaultTitle;

  useEffect(() => {
    setEditTitle(currentTitle);
  }, [currentTitle]);

  const effectiveIsAdmin = isAdmin && !userViewMode;

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    updateTitle.mutate({
      sectionKey,
      title: editTitle,
    });
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setEditTitle(currentTitle);
    setIsEditing(false);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEditing(true);
  };

  if (isEditing && effectiveIsAdmin) {
    return (
      <div className={cn("flex items-center gap-2", className)} onClick={(e) => e.stopPropagation()}>
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="text-lg font-bold flex-1"
          placeholder="Título da seção"
          onClick={(e) => e.stopPropagation()}
        />
        <Button
          size="sm"
          onClick={handleSave}
          disabled={updateTitle.isPending}
          className="bg-green-600 hover:bg-green-700"
        >
          <Check className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCancel}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("relative group inline-flex items-center gap-2", className)}>
      <h2 className="text-xl font-black text-primary">{currentTitle}</h2>
      {effectiveIsAdmin && (
        <Button
          size="sm"
          variant="ghost"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
          onClick={handleEditClick}
        >
          <Edit className="w-4 h-4 text-primary" />
        </Button>
      )}
    </div>
  );
};
