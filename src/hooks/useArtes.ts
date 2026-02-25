import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Arte {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  file_url: string;
  file_path: string | null;
  thumbnail_url: string | null;
  display_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useArtes = () => {
  const [artes, setArtes] = useState<Arte[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArtes = async () => {
    try {
      const { data, error } = await supabase
        .from('artes')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setArtes((data || []) as Arte[]);
    } catch (error) {
      console.error('Error fetching artes:', error);
      toast.error('Erro ao carregar artes');
    } finally {
      setLoading(false);
    }
  };

  const addArte = async (title: string, description: string, category: string, file: File) => {
    try {
      const ext = file.name.split('.').pop();
      const path = `artes/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from('campaigns').upload(path, file);
      if (uploadErr) throw uploadErr;
      const { data: { publicUrl } } = supabase.storage.from('campaigns').getPublicUrl(path);

      const { error } = await supabase.from('artes').insert({
        title,
        description: description || null,
        category: category || null,
        file_url: publicUrl,
        file_path: path,
        display_order: artes.length,
      });

      if (error) throw error;
      toast.success('Arte adicionada!');
      fetchArtes();
    } catch (error) {
      console.error('Error adding arte:', error);
      toast.error('Erro ao adicionar arte');
    }
  };

  const deleteArte = async (id: string, filePath: string | null) => {
    try {
      if (filePath) {
        await supabase.storage.from('campaigns').remove([filePath]);
      }
      const { error } = await supabase.from('artes').delete().eq('id', id);
      if (error) throw error;
      toast.success('Arte removida!');
      fetchArtes();
    } catch (error) {
      console.error('Error deleting arte:', error);
      toast.error('Erro ao remover arte');
    }
  };

  useEffect(() => {
    fetchArtes();
  }, []);

  return { artes, loading, addArte, deleteArte, refetch: fetchArtes };
};
