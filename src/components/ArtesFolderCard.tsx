import { useState, useRef, useEffect } from 'react';
import { Folder, Pencil, Check, X } from 'lucide-react';
import { useSectionTitles, useUpdateSectionTitle } from '@/hooks/useSectionTitles';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArtesFolderDialog } from '@/components/ArtesFolderDialog';

const FOLDER_KEY = 'artes_folder';
const DEFAULT_NAME = 'Pasta de Artes';

interface ArtesFolderCardProps {
  isAdmin: boolean;
}

export const ArtesFolderCard = ({ isAdmin }: ArtesFolderCardProps) => {
  const { data: titles } = useSectionTitles();
  const updateTitle = useUpdateSectionTitle();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const folderName = titles?.[FOLDER_KEY]?.title || DEFAULT_NAME;

  useEffect(() => {
    if (editing) {
      setName(folderName);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [editing, folderName]);

  const handleSave = () => {
    if (name.trim() && name.trim() !== folderName) {
      updateTitle.mutate({ sectionKey: FOLDER_KEY, title: name.trim() });
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setEditing(false);
  };

  return (
    <>
      <div
        className="group relative bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center p-6 min-h-[180px]"
        onClick={!editing ? () => setDialogOpen(true) : undefined}
      >
        <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
          <Folder className="w-9 h-9 text-primary" />
        </div>

        {editing ? (
          <div className="flex items-center gap-1.5 w-full max-w-[200px]" onClick={e => e.stopPropagation()}>
            <Input
              ref={inputRef}
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 text-sm text-center"
            />
            <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={handleSave}>
              <Check className="w-4 h-4 text-green-600" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => setEditing(false)}>
              <X className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-foreground text-center leading-tight">{folderName}</span>
            {isAdmin && (
              <button
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
                onClick={e => { e.stopPropagation(); setEditing(true); }}
                title="Renomear pasta"
              >
                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
        )}
      </div>

      <ArtesFolderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        folderName={folderName}
        isAdmin={isAdmin}
      />
    </>
  );
};
