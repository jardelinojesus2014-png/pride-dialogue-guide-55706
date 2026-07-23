import { useState, useEffect, useCallback } from 'react';

export interface ActivityItem {
  id: string; // identificador único, ex: "operadora:<uuid>", "category:<uuid>", "content:<key>"
  kind: 'operadora' | 'category' | 'content';
  title: string;
  subtitle?: string;
  refId?: string; // id da operadora/categoria para navegação
  fileUrl?: string; // para conteúdos: abre o arquivo
  contentType?: string;
  ts?: number; // quando foi acessado/favoritado
}

const MAX_RECENTS = 6;
const MAX_FAVORITES = 30;

const FAV_KEY = (u: string) => `pride_train_favorites_${u}`;
const REC_KEY = (u: string) => `pride_train_recents_${u}`;

const read = (key: string): ActivityItem[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as ActivityItem[]) : [];
  } catch {
    return [];
  }
};

const write = (key: string, val: ActivityItem[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* ignore */
  }
};

/**
 * Guarda favoritos e itens acessados recentemente da aba de Treinamentos,
 * por usuário logado, no localStorage do navegador (por dispositivo).
 */
export const useTrainingActivity = (userId?: string | null) => {
  const u = userId || 'anon';
  const [favorites, setFavorites] = useState<ActivityItem[]>(() => read(FAV_KEY(u)));
  const [recents, setRecents] = useState<ActivityItem[]>(() => read(REC_KEY(u)));

  // Recarrega quando o usuário logado muda
  useEffect(() => {
    setFavorites(read(FAV_KEY(u)));
    setRecents(read(REC_KEY(u)));
  }, [u]);

  const isFavorite = useCallback((id: string) => favorites.some((f) => f.id === id), [favorites]);

  const toggleFavorite = useCallback(
    (item: ActivityItem) => {
      setFavorites((prev) => {
        const next = prev.some((f) => f.id === item.id)
          ? prev.filter((f) => f.id !== item.id)
          : [{ ...item, ts: Date.now() }, ...prev].slice(0, MAX_FAVORITES);
        write(FAV_KEY(u), next);
        return next;
      });
    },
    [u]
  );

  const removeFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const next = prev.filter((f) => f.id !== id);
        write(FAV_KEY(u), next);
        return next;
      });
    },
    [u]
  );

  const addRecent = useCallback(
    (item: ActivityItem) => {
      setRecents((prev) => {
        const next = [{ ...item, ts: Date.now() }, ...prev.filter((r) => r.id !== item.id)].slice(0, MAX_RECENTS);
        write(REC_KEY(u), next);
        return next;
      });
    },
    [u]
  );

  const clearRecents = useCallback(() => {
    setRecents([]);
    write(REC_KEY(u), []);
  }, [u]);

  return { favorites, recents, isFavorite, toggleFavorite, removeFavorite, addRecent, clearRecents };
};
