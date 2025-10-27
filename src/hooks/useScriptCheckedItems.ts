import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export const useScriptCheckedItems = () => {
  const { user } = useAuth();
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCheckedItems();
    }
  }, [user]);

  const loadCheckedItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('script_checked_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const checkedMap: Record<string, boolean> = {};
      data?.forEach((item) => {
        const key = `${item.section_id}-${item.item_id}`;
        checkedMap[key] = item.is_checked;
      });

      setCheckedItems(checkedMap);
    } catch (error: any) {
      console.error('Error loading checked items:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = async (sectionId: string, itemId: string) => {
    if (!user) return;

    const key = `${sectionId}-${itemId}`;
    const newValue = !checkedItems[key];
    
    setCheckedItems((prev) => ({ ...prev, [key]: newValue }));

    try {
      const { error } = await supabase
        .from('script_checked_items')
        .upsert({
          user_id: user.id,
          section_id: sectionId,
          item_id: itemId,
          is_checked: newValue,
        }, {
          onConflict: 'user_id,section_id,item_id'
        });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error toggling check:', error);
      toast({
        title: 'Erro ao marcar item',
        description: 'Não foi possível salvar a marcação.',
        variant: 'destructive',
      });
      // Revert on error
      setCheckedItems((prev) => ({ ...prev, [key]: !newValue }));
    }
  };

  return { checkedItems, toggleCheck, loading };
};
