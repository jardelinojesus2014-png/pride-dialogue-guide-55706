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
      // Explicitly filter by current user's ID to ensure we only get their items
      // even if RLS allows admins to see all items
      const { data, error } = await supabase
        .from('script_checked_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const checkedMap: Record<string, boolean> = {};
      data?.forEach((item) => {
        // Double-check that we only include items for the current user
        if (item.user_id === user.id) {
          const key = `${item.section_id}-${item.item_id}`;
          checkedMap[key] = item.is_checked;
        }
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
    
    console.log('🔄 Toggle check:', { sectionId, itemId, newValue, userId: user.id });
    setCheckedItems((prev) => ({ ...prev, [key]: newValue }));

    try {
      const { data, error } = await supabase
        .from('script_checked_items')
        .upsert({
          user_id: user.id,
          section_id: sectionId,
          item_id: itemId,
          is_checked: newValue,
        }, {
          onConflict: 'user_id,section_id,item_id'
        })
        .select();

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }
      
      console.log('✅ Toggle successful:', data);
    } catch (error: any) {
      console.error('❌ Error toggling check:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      toast({
        title: 'Erro ao marcar item',
        description: error.message || 'Não foi possível salvar a marcação.',
        variant: 'destructive',
      });
      // Revert on error
      setCheckedItems((prev) => ({ ...prev, [key]: !newValue }));
    }
  };

  return { checkedItems, toggleCheck, loading };
};
