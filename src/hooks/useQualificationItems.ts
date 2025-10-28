import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface QualificationItem {
  id: string;
  category: string;
  content: string;
  descriptions?: string[] | null;
  tips?: string[] | null;
  warnings?: string[] | null;
  video_urls?: string[] | null;
  file_urls?: string[] | null;
  file_names?: string[] | null;
  spin_type?: 'S' | 'P' | null;
  examples?: string[] | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useQualificationItems = () => {
  return useQuery({
    queryKey: ['qualification-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('qualification_items')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as QualificationItem[];
    },
  });
};

export const useUpdateQualificationItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: Partial<QualificationItem> & { id: string }) => {
      const { error } = await supabase
        .from('qualification_items')
        .update({
          content: item.content,
          descriptions: item.descriptions,
          tips: item.tips,
          warnings: item.warnings,
          video_urls: item.video_urls,
          file_urls: item.file_urls,
          file_names: item.file_names,
          spin_type: item.spin_type,
          examples: item.examples,
          display_order: item.display_order,
        })
        .eq('id', item.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qualification-items'] });
      toast({
        title: 'Item atualizado',
        description: 'As alterações foram salvas com sucesso.',
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

export const useDeleteQualificationItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('qualification_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qualification-items'] });
      toast({
        title: 'Item removido',
        description: 'O item foi excluído com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao remover',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useAddQualificationItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: Omit<QualificationItem, 'id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase
        .from('qualification_items')
        .insert(item);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qualification-items'] });
      toast({
        title: 'Item adicionado',
        description: 'O novo item foi criado com sucesso.',
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
