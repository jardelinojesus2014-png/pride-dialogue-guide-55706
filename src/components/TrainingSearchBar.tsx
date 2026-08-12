import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, Video, FileText, Image as ImageIcon, Music, Building2, FolderOpen, ExternalLink, BookOpen } from 'lucide-react';
import { TrainingSearchItem } from '@/hooks/useTrainingSearch';

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

interface TrainingSearchBarProps {
  items: TrainingSearchItem[];
  onSelect: (item: TrainingSearchItem) => void;
  onSearch?: (query: string) => void;
  className?: string;
  /** Quando informado, a busca fica restrita a `items` e oferece a opção de buscar em `allItems` */
  allItems?: TrainingSearchItem[];
  scopeLabel?: string;
  placeholder?: string;
}


const kindLabel = (it: TrainingSearchItem) => {
  if (it.kind === 'operadora') return 'Operadora';
  if (it.kind === 'category') return 'Categoria';
  if (it.kind === 'topic') return 'Tópico';
  switch (it.contentType) {
    case 'video': return 'Vídeo';
    case 'pdf': return 'PDF';
    case 'photo': return 'Foto';
    case 'audio': return 'Áudio';
    default: return 'Conteúdo';
  }
};

const ItemIcon = ({ it }: { it: TrainingSearchItem }) => {
  const cls = 'w-4 h-4';
  if (it.kind === 'operadora') return <Building2 className={cls} />;
  if (it.kind === 'category') return <FolderOpen className={cls} />;
  if (it.kind === 'topic') return <BookOpen className={cls} />;
  switch (it.contentType) {
    case 'video': return <Video className={cls} />;
    case 'pdf': return <FileText className={cls} />;
    case 'photo': return <ImageIcon className={cls} />;
    case 'audio': return <Music className={cls} />;
    default: return <FileText className={cls} />;
  }
};

export const TrainingSearchBar = ({
  items,
  onSelect,
  onSearch,
  className,
  allItems,
  scopeLabel,
  placeholder,
}: TrainingSearchBarProps) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [global, setGlobal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;

  // Registra a busca (analytics) ~0,9s depois que o usuário para de digitar
  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) return;
    const t = setTimeout(() => onSearchRef.current?.(q), 900);
    return () => clearTimeout(t);
  }, [query]);

  const source = global && allItems ? allItems : items;

  const match = (list: TrainingSearchItem[], q: string) => {
    const terms = q.split(/\s+/);
    return list.filter((it) => {
      const hay = normalize(
        [it.title, it.parentName, it.description, kindLabel(it)].filter(Boolean).join(' ')
      );
      return terms.every((t) => hay.includes(t));
    });
  };

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return [];
    return match(source, q).slice(0, 8);
  }, [query, source]);

  const globalCount = useMemo(() => {
    const q = normalize(query.trim());
    if (!q || !allItems || global || results.length > 0) return 0;
    return match(allItems, q).length;
  }, [query, allItems, global, results.length]);


  useEffect(() => {
    setHighlight(0);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (it: TrainingSearchItem) => {
    setOpen(false);
    setQuery('');
    onSelect(it);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => (h + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => (h - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(results[highlight]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className || ''}`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={
            placeholder ||
            (scopeLabel && !global
              ? `Pesquisar em ${scopeLabel}...`
              : 'Pesquisar operadora, documento, vídeo, regra...')
          }

          className="w-full h-14 pl-12 pr-11 rounded-2xl border border-border bg-card text-base text-foreground placeholder:text-muted-foreground shadow-md focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Limpar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && query.trim() && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-popover shadow-xl overflow-hidden animate-fade-in">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              Nenhum resultado para <span className="font-semibold text-foreground">"{query}"</span>
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((it, idx) => (
                <li key={it.key}>
                  <button
                    onMouseEnter={() => setHighlight(idx)}
                    onClick={() => handleSelect(it)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                      idx === highlight ? 'bg-accent/15' : 'hover:bg-muted/60'
                    }`}
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                      <ItemIcon it={it} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold text-foreground truncate">{it.title}</span>
                      <span className="block text-xs text-muted-foreground truncate">
                        {kindLabel(it)}
                        {it.parentName ? ` · ${it.parentName}` : ''}
                      </span>
                    </span>
                    {it.kind === 'content' && (
                      <ExternalLink className="flex-shrink-0 w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
