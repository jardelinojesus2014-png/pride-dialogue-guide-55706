import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from './use-toast';

interface SectionTitle {
  id: string;
  section_key: string;
  title: string;
  subtitle: string | null;
  created_at: string;
  updated_at: string;
}

export const useSectionTitles = () => {
  return useQuery({
    queryKey: ['section-titles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('section_titles')
        .select('*');

      if (error) throw error;
      
      // Convert to a map for easy access
      const titlesMap: Record<string, SectionTitle> = {};
      data?.forEach((item) => {
        titlesMap[item.section_key] = item;
      });
      
      return titlesMap;
    },
  });
};

export const useUpdateSectionTitle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      sectionKey, 
      title, 
      subtitle 
    }: { 
      sectionKey: string; 
      title: string; 
      subtitle?: string;
    }) => {
      const { data, error } = await supabase
        .from('section_titles')
        .upsert({
          section_key: sectionKey,
          title,
          subtitle: subtitle || null,
        }, {
          onConflict: 'section_key'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section-titles'] });
      toast({
        title: 'Título atualizado',
        description: 'O título foi atualizado com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar título',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
