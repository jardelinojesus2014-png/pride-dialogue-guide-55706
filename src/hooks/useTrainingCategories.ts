import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TrainingCategory {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  display_order: number;
  is_operadoras_section: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface TrainingCategoryContent {
  id: string;
  category_id: string;
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

export const useTrainingCategories = () => {
  const [categories, setCategories] = useState<TrainingCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('training_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCategories((data || []) as TrainingCategory[]);
    } catch (error) {
      console.error('Error fetching training categories:', error);
      toast.error('Erro ao carregar categorias de treinamento');
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (title: string, description: string, icon: string) => {
    try {
      const { error } = await supabase
        .from('training_categories')
        .insert({
          title,
          description: description || null,
          icon,
          display_order: categories.length,
          is_operadoras_section: false
        });

      if (error) throw error;

      toast.success('Categoria adicionada com sucesso!');
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Erro ao adicionar categoria');
    }
  };

  const updateCategory = async (id: string, title: string, description: string, icon: string) => {
    try {
      const { error } = await supabase
        .from('training_categories')
        .update({ title, description: description || null, icon })
        .eq('id', id);

      if (error) throw error;

      toast.success('Categoria atualizada com sucesso!');
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Erro ao atualizar categoria');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('training_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Categoria removida com sucesso!');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Erro ao remover categoria');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { 
    categories, 
    loading, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    refetch: fetchCategories 
  };
};

export const useTrainingCategoryContent = (categoryId: string | null) => {
  const [content, setContent] = useState<TrainingCategoryContent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchContent = async () => {
    if (!categoryId) {
      setContent([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('training_category_content')
        .select('*')
        .eq('category_id', categoryId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setContent((data || []) as TrainingCategoryContent[]);
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
    if (!categoryId) return;

    try {
      let fileUrl: string;
      let filePath: string | null = null;

      if (typeof fileOrUrl === 'string') {
        fileUrl = fileOrUrl;
      } else {
        const fileExt = fileOrUrl.name.split('.').pop();
        const fileName = `training/${categoryId}/${Date.now()}.${fileExt}`;

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
        .from('training_category_content')
        .insert({
          category_id: categoryId,
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
        .from('training_category_content')
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

  useEffect(() => {
    fetchContent();
  }, [categoryId]);

  return { content, loading, addContent, deleteContent, refetch: fetchContent };
};
