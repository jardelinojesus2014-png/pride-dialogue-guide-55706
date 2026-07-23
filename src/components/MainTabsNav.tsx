import { useNavigate } from 'react-router-dom';
import { ClipboardList, Workflow, BookOpen, GraduationCap, Palette, Star } from 'lucide-react';
import { useSectionTitles } from '@/hooks/useSectionTitles';
import logoPrideGold from '@/assets/Logo_Pride-2.png';
import logoPrideCircle from '@/assets/logo-pride-circle.png';

interface NavTab {
  key: string;
  kind: 'tab' | 'link';
  value?: string; // aba do Index → /?tab=value
  path?: string; // rota direta (links)
  short: string;
  icon: JSX.Element;
}

const TABS: NavTab[] = [
  { key: 'tab_dashboard', kind: 'tab', value: 'dashboard', short: 'Dashboard', icon: <img src={logoPrideCircle} alt="" className="w-6 h-6 object-contain flex-shrink-0" /> },
  { key: 'tab_prospeccao', kind: 'tab', value: 'prospeccao', short: 'Roteiro', icon: <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> },
  { key: 'tab_cadencia', kind: 'tab', value: 'cadencia', short: 'Cadência', icon: <Workflow className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> },
  { key: 'tab_materiais', kind: 'tab', value: 'fluxo', short: 'Materiais', icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> },
  { key: 'tab_pride', kind: 'tab', value: 'pride', short: 'Pride', icon: <img src={logoPrideGold} alt="" className="w-6 h-6 object-contain flex-shrink-0" /> },
  { key: 'tab_treinamentos', kind: 'tab', value: 'treinamentos', short: 'Treinamentos', icon: <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> },
  { key: 'tab_artes_campanhas', kind: 'link', path: '/artes-campanhas', short: 'Artes', icon: <Palette className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> },
  { key: 'tab_avaliacoes', kind: 'tab', value: 'avaliacoes', short: 'Avaliações', icon: <Star className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> },
];

/** Barra de navegação principal, para usar fora do Index (páginas Central/Operadora). */
export const MainTabsNav = ({ activeKey }: { activeKey?: string }) => {
  const navigate = useNavigate();
  const { data: sectionTitles = {} } = useSectionTitles();

  const ordered = [...TABS]
    .map((t, i) => ({ ...t, _o: sectionTitles[t.key]?.display_order ?? i, _i: i }))
    .sort((a, b) => a._o - b._o || a._i - b._i);

  const go = (t: NavTab) => {
    if (t.kind === 'link' && t.path) navigate(t.path);
    else if (t.value) navigate(`/?tab=${t.value}`);
  };

  return (
    <div className="w-full flex flex-nowrap items-center justify-start sm:justify-center h-auto p-2 bg-gradient-hero rounded-lg gap-2 overflow-x-auto shadow-xl">
      {ordered.map((t) => {
        const label = sectionTitles[t.key]?.subtitle || t.short;
        const active = t.key === activeKey;
        return (
          <button
            key={t.key}
            onClick={() => go(t)}
            className={`flex-shrink-0 min-w-[72px] py-1.5 px-2 rounded-lg transition-all ${
              active ? 'bg-accent text-accent-foreground' : 'text-accent/70 hover:bg-accent/20'
            }`}
            title={label}
          >
            <div className="flex flex-col items-center justify-center gap-1 min-h-[42px]">
              {t.icon}
              <span className="text-[11px] font-semibold text-center leading-tight max-w-[86px] line-clamp-2">
                {label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
