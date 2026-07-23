import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface OperadoraTopic {
  id: string;
  operadora_id: string;
  title: string;
  body: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// A tabela operadora_topics não faz parte dos tipos gerados; acesso solto.
const db = supabase as any;

export const useOperadoraTopics = (operadoraId: string | null | undefined) => {
  const [topics, setTopics] = useState<OperadoraTopic[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTopics = useCallback(async () => {
    if (!operadoraId) {
      setTopics([]);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await db
        .from('operadora_topics')
        .select('*')
        .eq('operadora_id', operadoraId)
        .order('display_order', { ascending: true });
      if (error) throw error;
      setTopics((data || []) as OperadoraTopic[]);
    } catch (error) {
      console.error('Error fetching operadora topics:', error);
    } finally {
      setLoading(false);
    }
  }, [operadoraId]);

  const addTopic = async (title: string, body: string) => {
    if (!operadoraId) return;
    try {
      const { error } = await db.from('operadora_topics').insert({
        operadora_id: operadoraId,
        title,
        body: body || null,
        display_order: topics.length,
      });
      if (error) throw error;
      toast.success('Tópico adicionado!');
      fetchTopics();
    } catch (error) {
      console.error('Error adding topic:', error);
      toast.error('Erro ao adicionar tópico');
    }
  };

  const updateTopic = async (id: string, title: string, body: string) => {
    try {
      const { error } = await db
        .from('operadora_topics')
        .update({ title, body: body || null, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      toast.success('Tópico atualizado!');
      fetchTopics();
    } catch (error) {
      console.error('Error updating topic:', error);
      toast.error('Erro ao atualizar tópico');
    }
  };

  const deleteTopic = async (id: string) => {
    try {
      const { error } = await db.from('operadora_topics').delete().eq('id', id);
      if (error) throw error;
      toast.success('Tópico removido!');
      fetchTopics();
    } catch (error) {
      console.error('Error deleting topic:', error);
      toast.error('Erro ao remover tópico');
    }
  };

  // Move um tópico para cima/baixo, trocando a ordem com o vizinho
  const moveTopic = async (id: string, direction: 'up' | 'down') => {
    const index = topics.findIndex((t) => t.id === id);
    if (index < 0) return;
    const swapWith = direction === 'up' ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= topics.length) return;

    const a = topics[index];
    const b = topics[swapWith];
    // Atualização otimista
    const reordered = [...topics];
    reordered[index] = b;
    reordered[swapWith] = a;
    setTopics(reordered);

    try {
      await Promise.all([
        db.from('operadora_topics').update({ display_order: b.display_order }).eq('id', a.id),
        db.from('operadora_topics').update({ display_order: a.display_order }).eq('id', b.id),
      ]);
      fetchTopics();
    } catch (error) {
      console.error('Error reordering topics:', error);
      fetchTopics();
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  return { topics, loading, addTopic, updateTopic, deleteTopic, moveTopic, refetch: fetchTopics };
};
