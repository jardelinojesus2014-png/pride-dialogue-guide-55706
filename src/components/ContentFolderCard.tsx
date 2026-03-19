import { useState, useRef, useEffect } from 'react';
import { Folder, Pencil, Check, X, Trash2, Pin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArtesFolderDialog } from '@/components/ArtesFolderDialog';
import { ContentFolder } from '@/hooks/useContentFolders';

interface ContentFolderCardProps {
  folder: ContentFolder;
  isAdmin: boolean;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onTogglePin?: (id: string) => void;
}

export const ContentFolderCard = ({ folder, isAdmin, onRename, onDelete, onTogglePin }: ContentFolderCardProps) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setName(folder.name);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [editing, folder.name]);

  const handleSave = () => {
    if (name.trim() && name.trim() !== folder.name) {
      onRename(folder.id, name.trim());
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
        className={`group relative bg-card border ${folder.is_pinned ? 'border-primary/60 ring-1 ring-primary/30' : 'border-border'} rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center p-6 min-h-[180px]`}
        onClick={!editing ? () => setDialogOpen(true) : undefined}
      >
        {folder.is_pinned && (
          <div className="absolute top-2 left-2 z-10">
            <Pin className="w-4 h-4 text-primary fill-primary" />
          </div>
        )}
        {isAdmin && !editing && (
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onTogglePin && (
              <button
                className="p-1.5 rounded-lg hover:bg-muted"
                onClick={e => { e.stopPropagation(); onTogglePin(folder.id); }}
                title={folder.is_pinned ? 'Desafixar' : 'Fixar'}
              >
                <Pin className={`w-4 h-4 ${folder.is_pinned ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
              </button>
            )}
            <button
              className="p-1.5 rounded-lg hover:bg-destructive/10"
              onClick={e => { e.stopPropagation(); onDelete(folder.id); }}
              title="Excluir pasta"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </button>
          </div>
        )}

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
            <span className="font-semibold text-sm text-foreground text-center leading-tight">{folder.name}</span>
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
        folderName={folder.name}
        isAdmin={isAdmin}
        folderId={folder.id}
      />
    </>
  );
};
