import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export const useScriptNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  const loadNotes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('script_notes')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const notesMap: Record<string, string> = {};
      data?.forEach((note) => {
        const key = `${note.section_id}-${note.item_id}`;
        notesMap[key] = note.note;
      });

      setNotes(notesMap);
    } catch (error: any) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async (sectionId: string, itemId: string, note: string) => {
    if (!user) return;

    const key = `${sectionId}-${itemId}`;
    setNotes((prev) => ({ ...prev, [key]: note }));

    try {
      const { error } = await supabase
        .from('script_notes')
        .upsert({
          user_id: user.id,
          section_id: sectionId,
          item_id: itemId,
          note: note,
        }, {
          onConflict: 'user_id,section_id,item_id'
        });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error saving note:', error);
      toast({
        title: 'Erro ao salvar anotação',
        description: 'Não foi possível salvar a anotação.',
        variant: 'destructive',
      });
    }
  };

  return { notes, saveNote, loading };
};
