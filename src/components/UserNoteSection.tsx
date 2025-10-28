import { useState } from 'react';
import { StickyNote, Save, X } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useQualificationUserNotes, useUpsertUserNote, useDeleteUserNote } from '@/hooks/useQualificationUserNotes';

interface UserNoteSectionProps {
  itemId: string;
}

export const UserNoteSection = ({ itemId }: UserNoteSectionProps) => {
  const { data: notes = [] } = useQualificationUserNotes(itemId);
  const upsertNote = useUpsertUserNote();
  const deleteNote = useDeleteUserNote();
  const [showNote, setShowNote] = useState(false);
  const [noteText, setNoteText] = useState('');

  const userNote = notes[0]; // Each user has only one note per item

  const handleToggle = () => {
    if (!showNote && userNote) {
      setNoteText(userNote.note);
    }
    setShowNote(!showNote);
  };

  const handleSave = () => {
    if (noteText.trim()) {
      upsertNote.mutate({
        itemId,
        note: noteText.trim(),
        noteId: userNote?.id,
      });
      setShowNote(false);
    }
  };

  const handleDelete = () => {
    if (userNote && confirm('Tem certeza que deseja excluir sua nota?')) {
      deleteNote.mutate({ noteId: userNote.id, itemId });
      setNoteText('');
      setShowNote(false);
    }
  };

  return (
    <>
      <button
        onClick={handleToggle}
        className={`${
          showNote || userNote ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-muted hover:bg-muted/80'
        } p-2 rounded-lg transition-all duration-300 group relative flex-shrink-0`}
        title="Nota pessoal"
      >
        <StickyNote
          className={`w-4 h-4 ${
            showNote || userNote ? 'text-yellow-600 dark:text-yellow-400' : 'text-muted-foreground'
          }`}
        />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg">
          Nota Pessoal
        </span>
      </button>

      {showNote && (
        <div className="absolute top-full left-0 right-0 mt-2 z-20 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-4 shadow-lg space-y-2">
          <Textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Adicione suas observações pessoais aqui..."
            rows={3}
            className="w-full p-3 rounded-lg border-2 border-yellow-400 dark:border-yellow-600 bg-white dark:bg-gray-900 focus:border-yellow-500 focus:outline-none transition-colors text-sm text-foreground"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={!noteText.trim()} className="bg-yellow-500 hover:bg-yellow-600 text-white">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
            {userNote && (
              <Button size="sm" variant="outline" onClick={handleDelete}>
                Excluir Nota
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => setShowNote(false)}>
              <X className="w-4 h-4 mr-2" />
              Fechar
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
