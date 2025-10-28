import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface QualificationUserNote {
  id: string;
  item_id: string;
  user_id: string;
  note: string;
  created_at: string;
  updated_at: string;
}

export const useQualificationUserNotes = (itemId: string) => {
  return useQuery({
    queryKey: ['qualification-user-notes', itemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('qualification_user_notes')
        .select('*')
        .eq('item_id', itemId);

      if (error) throw error;
      return data as QualificationUserNote[];
    },
  });
};

export const useUpsertUserNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, note, noteId }: { itemId: string; note: string; noteId?: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      
      if (noteId) {
        // Update existing note
        const { error } = await supabase
          .from('qualification_user_notes')
          .update({ note })
          .eq('id', noteId);

        if (error) throw error;
      } else {
        // Insert new note
        const { error } = await supabase
          .from('qualification_user_notes')
          .insert({
            item_id: itemId,
            user_id: userData.user?.id,
            note,
          });

        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['qualification-user-notes', variables.itemId] });
      toast({
        title: 'Nota salva',
        description: 'Sua nota foi salva com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao salvar nota',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteUserNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ noteId, itemId }: { noteId: string; itemId: string }) => {
      const { error } = await supabase
        .from('qualification_user_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      return itemId;
    },
    onSuccess: (itemId) => {
      queryClient.invalidateQueries({ queryKey: ['qualification-user-notes', itemId] });
      toast({
        title: 'Nota excluída',
        description: 'Sua nota foi removida.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao excluir nota',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
