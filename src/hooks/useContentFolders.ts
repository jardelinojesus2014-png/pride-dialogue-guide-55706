import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ContentFolder {
  id: string;
  name: string;
  tab_type: string;
  is_pinned: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useContentFolders = (tabType: string) => {
  const [folders, setFolders] = useState<ContentFolder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFolders = async () => {
    try {
      const { data, error } = await supabase
        .from('content_folders')
        .select('*')
        .eq('tab_type', tabType)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      setFolders((data || []) as ContentFolder[]);
    } catch (error) {
      console.error('Error fetching folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFolder = async (name: string = 'Nova Pasta') => {
    try {
      const { error } = await supabase.from('content_folders').insert({
        name,
        tab_type: tabType,
      });
      if (error) throw error;
      toast.success('Pasta criada!');
      fetchFolders();
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Erro ao criar pasta');
    }
  };

  const updateFolder = async (id: string, name: string) => {
    try {
      const { error } = await supabase.from('content_folders').update({ name }).eq('id', id);
      if (error) throw error;
      toast.success('Pasta renomeada!');
      fetchFolders();
    } catch (error) {
      console.error('Error updating folder:', error);
      toast.error('Erro ao renomear pasta');
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      const { error } = await supabase.from('content_folders').delete().eq('id', id);
      if (error) throw error;
      toast.success('Pasta removida!');
      fetchFolders();
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error('Erro ao remover pasta');
    }
  };

  const togglePinFolder = async (id: string) => {
    try {
      const folder = folders.find(f => f.id === id);
      if (!folder) return;
      const { error } = await supabase.from('content_folders').update({ is_pinned: !folder.is_pinned }).eq('id', id);
      if (error) throw error;
      toast.success(folder.is_pinned ? 'Pasta desafixada!' : 'Pasta fixada!');
      fetchFolders();
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error('Erro ao fixar/desafixar pasta');
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [tabType]);

  return { folders, loading, addFolder, updateFolder, deleteFolder, togglePinFolder, refetch: fetchFolders };
};
