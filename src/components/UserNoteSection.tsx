import { useState } from 'react';
import { Edit, Save, X, StickyNote } from 'lucide-react';
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
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState('');

  const userNote = notes[0]; // Each user has only one note per item

  const handleSave = () => {
    if (noteText.trim()) {
      upsertNote.mutate({
        itemId,
        note: noteText.trim(),
        noteId: userNote?.id,
      });
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setNoteText(userNote?.note || '');
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (userNote && confirm('Tem certeza que deseja excluir sua nota?')) {
      deleteNote.mutate({ noteId: userNote.id, itemId });
      setNoteText('');
    }
  };

  if (isEditing) {
    return (
      <div className="mt-3 bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-yellow-800 dark:text-yellow-200">
          <StickyNote className="w-4 h-4" />
          Minha Nota
        </div>
        <Textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Adicione suas observações pessoais aqui..."
          rows={3}
          className="bg-white dark:bg-gray-900"
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={!noteText.trim()}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
          <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  if (userNote) {
    return (
      <div className="mt-3 bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm font-bold text-yellow-800 dark:text-yellow-200 mb-2">
              <StickyNote className="w-4 h-4" />
              Minha Nota
            </div>
            <p className="text-sm text-foreground whitespace-pre-wrap">{userNote.note}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={handleEdit}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDelete}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleEdit}
      className="mt-3 w-full border-2 border-dashed border-yellow-400 hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950/20"
    >
      <StickyNote className="w-4 h-4 mr-2" />
      Adicionar Nota Pessoal
    </Button>
  );
};
