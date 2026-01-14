import { useState } from 'react';
import { Edit, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useUpdateSectionTitle } from '@/hooks/useSectionTitles';

interface EditableSectionHeaderProps {
  sectionKey: string;
  title: string;
  subtitle?: string;
  isAdmin: boolean;
  userViewMode?: boolean;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export const EditableSectionHeader = ({
  sectionKey,
  title,
  subtitle,
  isAdmin,
  userViewMode = false,
  className = '',
  titleClassName = 'text-2xl font-black text-accent mb-2',
  subtitleClassName = 'text-accent/80',
}: EditableSectionHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editSubtitle, setEditSubtitle] = useState(subtitle || '');
  const updateTitle = useUpdateSectionTitle();

  const effectiveIsAdmin = isAdmin && !userViewMode;

  const handleSave = () => {
    updateTitle.mutate({
      sectionKey,
      title: editTitle,
      subtitle: editSubtitle,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(title);
    setEditSubtitle(subtitle || '');
    setIsEditing(false);
  };

  if (isEditing && effectiveIsAdmin) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center gap-2">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="text-xl font-bold"
            placeholder="Título"
          />
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={editSubtitle}
            onChange={(e) => setEditSubtitle(e.target.value)}
            className="text-sm"
            placeholder="Subtítulo (opcional)"
          />
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={updateTitle.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="w-4 h-4 mr-1" />
            Salvar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
          >
            <X className="w-4 h-4 mr-1" />
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative group`}>
      <h2 className={titleClassName}>{title}</h2>
      {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
      {effectiveIsAdmin && (
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsEditing(true)}
        >
          <Edit className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
