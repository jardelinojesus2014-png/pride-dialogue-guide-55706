import { supabase } from '@/integrations/supabase/client';

const db = supabase as any;

export type TrainingEventType = 'operadora_view' | 'category_view' | 'topic_view' | 'search';

/**
 * Registra um evento de uso da área de Treinamentos (fire-and-forget).
 * Usado para o painel de analytics do admin.
 */
export async function logTrainingEvent(
  userId: string | null | undefined,
  type: TrainingEventType,
  refId?: string | null,
  refName?: string | null,
) {
  if (!userId) return;
  try {
    await db.from('training_events').insert({
      user_id: userId,
      type,
      ref_id: refId ?? null,
      ref_name: refName ?? null,
    });
  } catch {
    // silencioso — analytics nunca deve quebrar a navegação
  }
}
