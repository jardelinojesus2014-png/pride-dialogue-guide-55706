import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PurposeReflection {
  id: string;
  user_id: string;
  why: string | null;
  why_here: string | null;
  what_control: string | null;
  improve_what: string | null;
  strengths: string | null;
  what_today: string | null;
  created_at: string;
  updated_at: string;
}

export const usePurposeReflections = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reflections, isLoading } = useQuery({
    queryKey: ['purpose-reflections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_purpose_reflections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PurposeReflection[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (reflection: Omit<PurposeReflection, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if user already has a reflection
      const { data: existing } = await supabase
        .from('user_purpose_reflections')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from('user_purpose_reflections')
          .update(reflection)
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new
        const { data, error } = await supabase
          .from('user_purpose_reflections')
          .insert([{ ...reflection, user_id: user.id }])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purpose-reflections'] });
      toast({
        title: 'Reflexões salvas!',
        description: 'Suas respostas foram registradas com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar suas reflexões. Tente novamente.',
        variant: 'destructive',
      });
      console.error('Error saving reflection:', error);
    },
  });

  return {
    reflections,
    isLoading,
    saveReflection: saveMutation.mutate,
    isSaving: saveMutation.isPending,
  };
};

export const useUserReflection = () => {
  const { toast } = useToast();

  const { data: reflection, isLoading } = useQuery({
    queryKey: ['user-purpose-reflection'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_purpose_reflections')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as PurposeReflection | null;
    },
  });

  return {
    reflection,
    isLoading,
  };
};
