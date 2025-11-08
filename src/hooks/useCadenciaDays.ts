import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from './use-toast';

export interface CadenciaDay {
  id: string;
  day_id: string;
  title: string;
  subtitle: string;
  created_at: string;
  updated_at: string;
}

export const useCadenciaDays = () => {
  const queryClient = useQueryClient();

  const { data: days = [], isLoading } = useQuery({
    queryKey: ['cadencia_days'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cadencia_days')
        .select('*')
        .order('day_id');

      if (error) throw error;
      return data as CadenciaDay[];
    },
  });

  const updateDay = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CadenciaDay> }) => {
      const { error } = await supabase
        .from('cadencia_days')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cadencia_days'] });
      toast({
        title: 'Sucesso',
        description: 'Dia atualizado com sucesso',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar dia: ' + error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    days,
    isLoading,
    updateDay: updateDay.mutate,
  };
};
