import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from './use-toast';

export interface CadenciaAttachment {
  id: string;
  cadencia_item_id: string;
  attachment_type: 'audio' | 'video' | 'pdf';
  title: string;
  file_url: string;
  file_path: string | null;
  duration_seconds: number | null;
  display_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useCadenciaAttachments = (cadenciaItemId?: string) => {
  const queryClient = useQueryClient();

  const { data: attachments = [], isLoading } = useQuery({
    queryKey: ['cadencia_attachments', cadenciaItemId],
    queryFn: async () => {
      let query = supabase
        .from('cadencia_item_attachments')
        .select('*')
        .order('display_order', { ascending: true });

      if (cadenciaItemId) {
        query = query.eq('cadencia_item_id', cadenciaItemId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CadenciaAttachment[];
    },
    enabled: !!cadenciaItemId,
  });

  const addAttachment = useMutation({
    mutationFn: async (attachment: {
      cadencia_item_id: string;
      attachment_type: 'audio' | 'video' | 'pdf';
      title: string;
      file_url: string;
      file_path?: string;
      duration_seconds?: number;
    }) => {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('cadencia_item_attachments')
        .insert({
          ...attachment,
          created_by: userData.user?.id,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cadencia_attachments'] });
      toast({ title: 'Sucesso', description: 'Anexo adicionado com sucesso!' });
    },
    onError: (error: any) => {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    },
  });

  const deleteAttachment = useMutation({
    mutationFn: async (attachment: CadenciaAttachment) => {
      // Delete from storage if it has a file_path
      if (attachment.file_path) {
        await supabase.storage
          .from('cadencia_attachments')
          .remove([attachment.file_path]);
      }
      const { error } = await supabase
        .from('cadencia_item_attachments')
        .delete()
        .eq('id', attachment.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cadencia_attachments'] });
      toast({ title: 'Sucesso', description: 'Anexo removido com sucesso!' });
    },
    onError: (error: any) => {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    },
  });

  return {
    attachments,
    isLoading,
    addAttachment: addAttachment.mutate,
    deleteAttachment: deleteAttachment.mutate,
    isAdding: addAttachment.isPending,
  };
};
