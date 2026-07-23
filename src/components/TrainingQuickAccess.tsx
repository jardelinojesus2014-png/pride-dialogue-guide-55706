import { Star, Clock, X, Building2, FolderOpen, Video, FileText, Image as ImageIcon, Music } from 'lucide-react';
import { ActivityItem } from '@/hooks/useTrainingActivity';

const timeAgo = (ts?: number) => {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'ontem';
  if (d < 7) return `${d}d`;
  const w = Math.floor(d / 7);
  return `${w}sem`;
};

const ItemIcon = ({ item }: { item: ActivityItem }) => {
  const cls = 'w-4 h-4';
  if (item.kind === 'operadora') return <Building2 className={cls} />;
  if (item.kind === 'category') return <FolderOpen className={cls} />;
  switch (item.contentType) {
    case 'video': return <Video className={cls} />;
    case 'pdf': return <FileText className={cls} />;
    case 'photo': return <ImageIcon className={cls} />;
    case 'audio': return <Music className={cls} />;
    default: return <FileText className={cls} />;
  }
};

interface TrainingQuickAccessProps {
  favorites: ActivityItem[];
  recents: ActivityItem[];
  onOpen: (item: ActivityItem) => void;
  onRemoveFavorite: (id: string) => void;
  onClearRecents: () => void;
}

export const TrainingQuickAccess = ({
  favorites,
  recents,
  onOpen,
  onRemoveFavorite,
  onClearRecents,
}: TrainingQuickAccessProps) => {
  if (favorites.length === 0 && recents.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Favoritos */}
      <section>
        <header className="flex items-center gap-2 mb-2.5 px-1">
          <Star className="w-4 h-4 text-accent fill-accent" />
          <h3 className="text-sm font-bold text-foreground">Favoritos</h3>
        </header>
        {favorites.length === 0 ? (
          <p className="text-xs text-muted-foreground px-1 py-3">
            Toque na ⭐ de uma operadora ou treinamento para salvar aqui.
          </p>
        ) : (
          <ul className="space-y-2">
            {favorites.map((item) => (
              <li key={item.id}>
                <div
                  onClick={() => onOpen(item)}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 hover:border-accent/50 hover:shadow-sm transition-all cursor-pointer"
                >
                  <Star className="w-4 h-4 text-accent fill-accent flex-shrink-0" />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-foreground truncate">{item.title}</span>
                    {item.subtitle && (
                      <span className="block text-xs text-muted-foreground truncate">{item.subtitle}</span>
                    )}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(item.id);
                    }}
                    className="flex-shrink-0 p-1 rounded-full text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted hover:text-foreground transition-all"
                    title="Remover dos favoritos"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Acessados recentemente */}
      <section>
        <header className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-bold text-foreground">Acessados recentemente</h3>
          </div>
          {recents.length > 0 && (
            <button
              onClick={onClearRecents}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Limpar
            </button>
          )}
        </header>
        {recents.length === 0 ? (
          <p className="text-xs text-muted-foreground px-1 py-3">Seus acessos recentes aparecerão aqui.</p>
        ) : (
          <ul className="space-y-2">
            {recents.map((item) => (
              <li key={item.id}>
                <div
                  onClick={() => onOpen(item)}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 hover:border-accent/50 hover:shadow-sm transition-all cursor-pointer"
                >
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    <ItemIcon item={item} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-foreground truncate">{item.title}</span>
                    {item.subtitle && (
                      <span className="block text-xs text-muted-foreground truncate">{item.subtitle}</span>
                    )}
                  </span>
                  <span className="flex-shrink-0 text-xs text-muted-foreground">{timeAgo(item.ts)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
