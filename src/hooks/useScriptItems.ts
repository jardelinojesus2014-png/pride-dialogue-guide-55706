import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from './use-toast';

export interface ResponseOption {
  client_response: string;
  suggested_conduct: string;
}

export interface ScriptItem {
  id: string;
  section_id: string;
  item_id: string;
  label: string;
  script: string;
  alternatives?: string[] | null;
  tips?: string[] | null;
  warnings?: string[] | null;
  collect?: string[] | null;
  response_options?: ResponseOption[] | null;
  display_order: number;
}

export const useScriptItems = (sectionId?: string) => {
  return useQuery({
    queryKey: ['script_items', sectionId],
    queryFn: async () => {
      let query = supabase
        .from('script_items')
        .select('*')
        .order('display_order');
      
      if (sectionId) {
        query = query.eq('section_id', sectionId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Convert Json type to ResponseOption[]
      return (data || []).map(item => ({
        ...item,
        response_options: item.response_options as unknown as ResponseOption[] | null,
      })) as ScriptItem[];
    },
  });
};

export const useUpdateScriptItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: Partial<ScriptItem> & { id: string }) => {
      const { error } = await supabase
        .from('script_items')
        .update({
          ...item,
          response_options: item.response_options as any,
        })
        .eq('id', item.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['script_items'] });
      toast({
        title: 'Item atualizado',
        description: 'O item foi atualizado com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteScriptItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('script_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['script_items'] });
      toast({
        title: 'Item excluído',
        description: 'O item foi excluído com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao excluir',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useAddScriptItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: Omit<ScriptItem, 'id'>) => {
      const { error } = await supabase
        .from('script_items')
        .insert({
          ...item,
          response_options: item.response_options as any,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['script_items'] });
      toast({
        title: 'Item adicionado',
        description: 'O item foi adicionado com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao adicionar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};