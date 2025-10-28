import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

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
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: reflections, isLoading } = useQuery({
    queryKey: ['purpose-reflections', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_purpose_reflections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PurposeReflection[];
    },
    enabled: !!user,
  });

  const saveMutation = useMutation({
    mutationFn: async (reflection: Omit<PurposeReflection, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      // Check if user already has a reflection
      const { data: existing } = await supabase
        .from('user_purpose_reflections')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existing) {
        // Update existing reflection
        const { data, error } = await supabase
          .from('user_purpose_reflections')
          .update(reflection)
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Insert new reflection
        const { data, error } = await supabase
          .from('user_purpose_reflections')
          .insert({
            ...reflection,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purpose-reflections'] });
      toast.success('Suas reflexões foram salvas com sucesso! 🎯');
    },
    onError: (error) => {
      console.error('Error saving reflection:', error);
      toast.error('Erro ao salvar suas reflexões. Tente novamente.');
    },
  });

  return {
    reflections,
    isLoading,
    saveReflection: saveMutation.mutate,
    isSaving: saveMutation.isPending,
  };
};

// Hook for admin to view all reflections
export const useAllPurposeReflections = () => {
  const { data: reflections, isLoading } = useQuery({
    queryKey: ['all-purpose-reflections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_purpose_reflections')
        .select(`
          *,
          profiles (email)
        `)
        .order('created_at', { ascending: false});

      if (error) throw error;
      return data;
    },
  });

  return {
    reflections,
    isLoading,
  };
};
