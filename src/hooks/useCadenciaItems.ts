import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface CadenciaItem {
  id: string;
  day_id: string;
  item_id: string;
  label: string;
  script: string;
  note: string | null;
  tip: string | null;
  collect: string[] | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useCadenciaItems = () => {
  const [items, setItems] = useState<CadenciaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    try {
      const { data, error } = await supabase
        .from('cadencia_items')
        .select('*')
        .order('day_id', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading cadencia items:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os itens da cadência.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const updateItem = async (itemId: string, updates: Partial<CadenciaItem>) => {
    try {
      const { error } = await supabase
        .from('cadencia_items')
        .update(updates)
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Item atualizado com sucesso."
      });

      await loadItems();
    } catch (error) {
      console.error('Error updating cadencia item:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o item.",
        variant: "destructive"
      });
    }
  };

  const addItem = async (item: Omit<CadenciaItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('cadencia_items')
        .insert(item);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Item adicionado com sucesso."
      });

      await loadItems();
    } catch (error) {
      console.error('Error adding cadencia item:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o item.",
        variant: "destructive"
      });
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cadencia_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Item excluído com sucesso."
      });

      await loadItems();
    } catch (error) {
      console.error('Error deleting cadencia item:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o item.",
        variant: "destructive"
      });
    }
  };

  return {
    items,
    loading,
    updateItem,
    addItem,
    deleteItem,
    refreshItems: loadItems
  };
};
