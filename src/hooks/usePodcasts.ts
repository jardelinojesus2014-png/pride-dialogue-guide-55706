import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface Podcast {
  id: string;
  title: string;
  file_path: string;
  file_url: string;
  duration_seconds: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const usePodcasts = () => {
  const { user } = useAuth();
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPodcasts();
  }, []);

  const loadPodcasts = async () => {
    try {
      const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPodcasts(data || []);
    } catch (error: any) {
      console.error('Error loading podcasts:', error);
      toast({
        title: 'Erro ao carregar podcasts',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadPodcast = async (
    title: string,
    audioBlob: Blob,
    durationSeconds?: number
  ): Promise<Podcast | null> => {
    if (!user) return null;

    try {
      const fileName = `podcasts/${Date.now()}.webm`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(fileName, audioBlob, {
          contentType: audioBlob.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('audio-files')
        .getPublicUrl(fileName);

      const { data, error } = await supabase
        .from('podcasts')
        .insert({
          title,
          file_path: fileName,
          file_url: publicUrl,
          duration_seconds: durationSeconds,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Podcast salvo com sucesso!',
        description: `"${title}" foi adicionado.`,
      });

      await loadPodcasts();
      return data;
    } catch (error: any) {
      console.error('Error uploading podcast:', error);
      toast({
        title: 'Erro ao salvar podcast',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const deletePodcast = async (podcastId: string) => {
    if (!user) return;

    try {
      const podcast = podcasts.find(p => p.id === podcastId);
      if (!podcast) return;

      const { error: storageError } = await supabase.storage
        .from('audio-files')
        .remove([podcast.file_path]);

      if (storageError) throw storageError;

      const { error } = await supabase
        .from('podcasts')
        .delete()
        .eq('id', podcastId);

      if (error) throw error;

      toast({
        title: 'Podcast excluído',
        description: 'O podcast foi removido com sucesso.',
      });

      await loadPodcasts();
    } catch (error: any) {
      console.error('Error deleting podcast:', error);
      toast({
        title: 'Erro ao excluir podcast',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return {
    podcasts,
    loading,
    uploadPodcast,
    deletePodcast,
    refreshPodcasts: loadPodcasts,
  };
};
