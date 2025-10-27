import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface PodcastLink {
  id: string;
  name: string;
  url: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const usePodcastLinks = () => {
  const { user } = useAuth();
  const [podcastLinks, setPodcastLinks] = useState<PodcastLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPodcastLinks();
  }, []);

  const loadPodcastLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('podcast_links')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPodcastLinks(data || []);
    } catch (error: any) {
      console.error('Error loading podcast links:', error);
      toast({
        title: 'Erro ao carregar podcasts',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addPodcastLink = async (title: string, url: string): Promise<PodcastLink | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('podcast_links')
        .insert({
          name: title,
          url,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Podcast adicionado com sucesso!',
        description: `"${title}" foi vinculado.`,
      });

      await loadPodcastLinks();
      return data;
    } catch (error: any) {
      console.error('Error adding podcast link:', error);
      toast({
        title: 'Erro ao adicionar podcast',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const deletePodcastLink = async (podcastId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('podcast_links')
        .delete()
        .eq('id', podcastId);

      if (error) throw error;

      toast({
        title: 'Podcast excluído',
        description: 'O podcast foi removido com sucesso.',
      });

      await loadPodcastLinks();
    } catch (error: any) {
      console.error('Error deleting podcast link:', error);
      toast({
        title: 'Erro ao excluir podcast',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return {
    podcastLinks,
    loading,
    addPodcastLink,
    deletePodcastLink,
    refreshPodcastLinks: loadPodcastLinks,
  };
};
