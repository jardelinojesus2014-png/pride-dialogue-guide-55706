import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CategoryTopic {
  id: string;
  category_id: string;
  title: string;
  body: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// A tabela category_topics não faz parte dos tipos gerados; acesso solto.
const db = supabase as any;

export const useCategoryTopics = (categoryId: string | null | undefined) => {
  const [topics, setTopics] = useState<CategoryTopic[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTopics = useCallback(async () => {
    if (!categoryId) {
      setTopics([]);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await db
        .from('category_topics')
        .select('*')
        .eq('category_id', categoryId)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });
      if (error) throw error;
      setTopics((data || []) as CategoryTopic[]);
    } catch (error) {
      console.error('Error fetching category topics:', error);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  const addTopic = async (title: string, body: string) => {
    if (!categoryId) return;
    try {
      const { error } = await db.from('category_topics').insert({
        category_id: categoryId,
        title,
        body: body || null,
        display_order: topics.length,
      });
      if (error) throw error;
      toast.success('Tópico adicionado!');
      fetchTopics();
    } catch (error) {
      console.error('Error adding category topic:', error);
      toast.error('Erro ao adicionar tópico');
    }
  };

  const updateTopic = async (id: string, title: string, body: string) => {
    try {
      const { error } = await db
        .from('category_topics')
        .update({ title, body: body || null, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      toast.success('Tópico atualizado!');
      fetchTopics();
    } catch (error) {
      console.error('Error updating category topic:', error);
      toast.error('Erro ao atualizar tópico');
    }
  };

  const deleteTopic = async (id: string) => {
    try {
      const { error } = await db.from('category_topics').delete().eq('id', id);
      if (error) throw error;
      toast.success('Tópico removido!');
      fetchTopics();
    } catch (error) {
      console.error('Error deleting category topic:', error);
      toast.error('Erro ao remover tópico');
    }
  };

  // Regrava display_order sequencial de todos (ordens duplicadas quebravam a troca simples)
  const moveTopic = async (id: string, direction: 'up' | 'down') => {
    const index = topics.findIndex((t) => t.id === id);
    if (index < 0) return;
    const swapWith = direction === 'up' ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= topics.length) return;

    const reordered = [...topics];
    [reordered[index], reordered[swapWith]] = [reordered[swapWith], reordered[index]];
    setTopics(reordered.map((t, i) => ({ ...t, display_order: i })));

    try {
      const results = await Promise.all(
        reordered.map((t, i) =>
          db.from('category_topics').update({ display_order: i }).eq('id', t.id),
        ),
      );
      const failed = results.find((r: any) => r?.error);
      if (failed) throw failed.error;
      fetchTopics();
    } catch (error) {
      console.error('Error reordering category topics:', error);
      toast.error('Erro ao reordenar tópicos');
      fetchTopics();
    }
  };


  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  return { topics, loading, addTopic, updateTopic, deleteTopic, moveTopic, refetch: fetchTopics };
};
