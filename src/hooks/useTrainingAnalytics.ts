import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const db = supabase as any;

interface RankItem {
  name: string;
  count: number;
}

export interface UserAccess {
  email: string;
  count: number;
  lastAt: string;
}

export interface TrainingAnalytics {
  loading: boolean;
  available: boolean; // false se a tabela ainda não existe
  accessesToday: number;
  searchesToday: number;
  lastAccess: string | null;
  topOperadora: RankItem | null;
  operadoraRanking: RankItem[];
  categoryRanking: RankItem[];
  topSearches: RankItem[];
  usersToday: UserAccess[];
}

const EMPTY: TrainingAnalytics = {
  loading: true,
  available: true,
  accessesToday: 0,
  searchesToday: 0,
  lastAccess: null,
  topOperadora: null,
  operadoraRanking: [],
  categoryRanking: [],
  topSearches: [],
  usersToday: [],
};

const rank = (rows: any[], type: string): RankItem[] => {
  const counts: Record<string, number> = {};
  rows
    .filter((r) => r.type === type && r.ref_name)
    .forEach((r) => {
      counts[r.ref_name] = (counts[r.ref_name] || 0) + 1;
    });
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

export const useTrainingAnalytics = (enabled: boolean) => {
  const [data, setData] = useState<TrainingAnalytics>(EMPTY);

  const load = useCallback(async () => {
    if (!enabled) return;
    setData((d) => ({ ...d, loading: true }));
    try {
      const [eventsRes, profilesRes] = await Promise.all([
        db
          .from('training_events')
          .select('user_id, type, ref_id, ref_name, created_at')
          .order('created_at', { ascending: false })
          .limit(5000),
        db.from('profiles').select('id, email'),
      ]);
      if (eventsRes.error) throw eventsRes.error;

      const list = (eventsRes.data || []) as any[];
      const emailMap = new Map<string, string>(
        ((profilesRes.data || []) as any[]).map((p) => [p.id, p.email || '']),
      );

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const isToday = (iso: string) => new Date(iso) >= startOfToday;

      const viewTypes = ['operadora_view', 'category_view', 'topic_view'];
      const accessesToday = list.filter((r) => viewTypes.includes(r.type) && isToday(r.created_at)).length;
      const searchesToday = list.filter((r) => r.type === 'search' && isToday(r.created_at)).length;
      const lastView = list.find((r) => viewTypes.includes(r.type));

      const operadoraRanking = rank(list, 'operadora_view');
      const categoryRanking = rank(list, 'category_view');
      const topSearches = rank(list, 'search').slice(0, 8);

      // Quem acessou hoje (a lista já vem ordenada do mais recente para o mais antigo)
      const byUser: Record<string, { count: number; lastAt: string }> = {};
      list.forEach((r) => {
        if (!r.user_id || !isToday(r.created_at)) return;
        if (!byUser[r.user_id]) byUser[r.user_id] = { count: 0, lastAt: r.created_at };
        byUser[r.user_id].count += 1;
      });
      const usersToday: UserAccess[] = Object.entries(byUser)
        .map(([uid, v]) => ({
          email: emailMap.get(uid) || 'Usuário sem e-mail',
          count: v.count,
          lastAt: v.lastAt,
        }))
        .sort((a, b) => b.count - a.count);

      setData({
        loading: false,
        available: true,
        accessesToday,
        searchesToday,
        lastAccess: lastView?.created_at || null,
        topOperadora: operadoraRanking[0] || null,
        operadoraRanking,
        categoryRanking,
        topSearches,
        usersToday,
      });
    } catch (e) {
      console.warn('training_events indisponível (rode a migração no Supabase):', e);
      setData({ ...EMPTY, loading: false, available: false });
    }
  }, [enabled]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...data, refetch: load };
};
