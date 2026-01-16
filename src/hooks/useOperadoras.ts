import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Operadora {
  id: string;
  name: string;
  logo_url: string;
  logo_path: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface OperadoraContent {
  id: string;
  operadora_id: string;
  content_type: 'video' | 'pdf' | 'photo' | 'audio';
  title: string;
  description: string | null;
  file_url: string;
  file_path: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export const useOperadoras = () => {
  const [operadoras, setOperadoras] = useState<Operadora[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOperadoras = async () => {
    try {
      const { data, error } = await supabase
        .from('operadoras')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setOperadoras(data || []);
    } catch (error) {
      console.error('Error fetching operadoras:', error);
      toast.error('Erro ao carregar operadoras');
    } finally {
      setLoading(false);
    }
  };

  const addOperadora = async (name: string, logoFile: File) => {
    try {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `logos/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('operadoras')
        .upload(fileName, logoFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('operadoras')
        .getPublicUrl(fileName);

      const { error } = await supabase
        .from('operadoras')
        .insert({
          name,
          logo_url: publicUrl,
          logo_path: fileName,
          display_order: operadoras.length
        });

      if (error) throw error;

      toast.success('Operadora adicionada com sucesso!');
      fetchOperadoras();
    } catch (error) {
      console.error('Error adding operadora:', error);
      toast.error('Erro ao adicionar operadora');
    }
  };

  const deleteOperadora = async (id: string, logoPath: string | null) => {
    try {
      if (logoPath) {
        await supabase.storage.from('operadoras').remove([logoPath]);
      }

      const { error } = await supabase
        .from('operadoras')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Operadora removida com sucesso!');
      fetchOperadoras();
    } catch (error) {
      console.error('Error deleting operadora:', error);
      toast.error('Erro ao remover operadora');
    }
  };

  useEffect(() => {
    fetchOperadoras();
  }, []);

  return { operadoras, loading, addOperadora, deleteOperadora, refetch: fetchOperadoras };
};

export const useOperadoraContent = (operadoraId: string | null) => {
  const [content, setContent] = useState<OperadoraContent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchContent = async () => {
    if (!operadoraId) {
      setContent([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('operadora_content')
        .select('*')
        .eq('operadora_id', operadoraId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setContent((data || []) as OperadoraContent[]);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Erro ao carregar conteúdo');
    } finally {
      setLoading(false);
    }
  };

  const addContent = async (
    contentType: 'video' | 'pdf' | 'photo' | 'audio',
    title: string,
    description: string,
    fileOrUrl: File | string
  ) => {
    if (!operadoraId) return;

    try {
      let fileUrl: string;
      let filePath: string | null = null;

      if (typeof fileOrUrl === 'string') {
        fileUrl = fileOrUrl;
      } else {
        const fileExt = fileOrUrl.name.split('.').pop();
        const fileName = `content/${operadoraId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('operadoras')
          .upload(fileName, fileOrUrl);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('operadoras')
          .getPublicUrl(fileName);

        fileUrl = publicUrl;
        filePath = fileName;
      }

      const { error } = await supabase
        .from('operadora_content')
        .insert({
          operadora_id: operadoraId,
          content_type: contentType,
          title,
          description: description || null,
          file_url: fileUrl,
          file_path: filePath,
          display_order: content.length
        });

      if (error) throw error;

      toast.success('Conteúdo adicionado com sucesso!');
      fetchContent();
    } catch (error) {
      console.error('Error adding content:', error);
      toast.error('Erro ao adicionar conteúdo');
    }
  };

  const deleteContent = async (id: string, filePath: string | null) => {
    try {
      if (filePath) {
        await supabase.storage.from('operadoras').remove([filePath]);
      }

      const { error } = await supabase
        .from('operadora_content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Conteúdo removido com sucesso!');
      fetchContent();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Erro ao remover conteúdo');
    }
  };

  const updateContent = async (id: string, title: string, description: string | null) => {
    try {
      const { error } = await supabase
        .from('operadora_content')
        .update({ title, description })
        .eq('id', id);

      if (error) throw error;

      toast.success('Conteúdo atualizado com sucesso!');
      fetchContent();
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Erro ao atualizar conteúdo');
    }
  };

  useEffect(() => {
    fetchContent();
  }, [operadoraId]);

  return { content, loading, addContent, deleteContent, updateContent, refetch: fetchContent };
};
