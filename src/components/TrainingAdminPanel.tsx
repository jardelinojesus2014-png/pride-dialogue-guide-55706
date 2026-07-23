import { Eye, Search, Clock, Building2, RefreshCw, BarChart3, Users } from 'lucide-react';
import { useTrainingAnalytics } from '@/hooks/useTrainingAnalytics';

const fmtLastAccess = (iso: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sameDay = d >= today;
  return sameDay
    ? d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

const StatCard = ({ icon: Icon, label, value }: { icon: typeof Eye; label: string; value: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-card p-4">
    <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
      <Icon className="w-4 h-4" />
      <span className="text-xs font-medium">{label}</span>
    </div>
    <p className="text-2xl font-black text-primary truncate">{value}</p>
  </div>
);

const RankingList = ({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: { name: string; count: number }[];
  emptyText: string;
}) => {
  const max = items[0]?.count || 1;
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h4 className="text-sm font-bold text-foreground mb-4">{title}</h4>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">{emptyText}</p>
      ) : (
        <ul className="space-y-2.5">
          {items.slice(0, 8).map((it, i) => (
            <li key={it.name} className="flex items-center gap-3">
              <span className="w-5 text-xs font-bold text-muted-foreground flex-shrink-0">{i + 1}º</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground truncate">{it.name}</span>
                  <span className="text-xs font-semibold text-muted-foreground flex-shrink-0">{it.count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${(it.count / max) * 100}%` }} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const TrainingAdminPanel = () => {
  const a = useTrainingAnalytics(true);

  if (!a.available) {
    return (
      <div className="rounded-2xl border border-amber-300 bg-amber-50/70 dark:bg-amber-950/20 p-5 text-sm text-amber-800 dark:text-amber-200">
        <p className="font-semibold mb-1">📊 Painel ainda não ativado</p>
        <p>
          Para registrar e ver os acessos, rode a migração <code>training_events</code> no SQL editor da Lovable.
          Depois disso, os dados começam a aparecer conforme a equipe usa a plataforma.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-primary/20 bg-gradient-hero p-5 sm:p-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-black text-accent leading-tight">Painel do admin</h3>
            <p className="text-xs text-accent/70">Analytics de uso dos treinamentos</p>
          </div>
        </div>
        <button
          onClick={a.refetch}
          className="flex items-center gap-1.5 text-xs font-medium text-accent/80 hover:text-accent px-3 py-1.5 rounded-lg hover:bg-accent/10 transition-colors"
          title="Atualizar"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${a.loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Eye} label="Acessos hoje" value={a.accessesToday} />
        <StatCard icon={Building2} label="Operadora mais acessada" value={a.topOperadora?.name || '—'} />
        <StatCard icon={Clock} label="Último acesso" value={fmtLastAccess(a.lastAccess)} />
        <StatCard icon={Search} label="Buscas hoje" value={a.searchesToday} />
      </div>

      {/* Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RankingList
          title="🏆 Operadoras mais acessadas"
          items={a.operadoraRanking}
          emptyText="Nenhum acesso registrado ainda."
        />
        <RankingList
          title="🔎 Buscas mais frequentes"
          items={a.topSearches}
          emptyText="Nenhuma busca registrada ainda."
        />
      </div>

      {a.categoryRanking.length > 0 && (
        <RankingList
          title="📚 Áreas mais acessadas"
          items={a.categoryRanking}
          emptyText="Nenhum acesso registrado ainda."
        />
      )}

      {/* Quem acessou hoje */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-accent" />
          Quem acessou hoje ({a.usersToday.length})
        </h4>
        {a.usersToday.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Ninguém acessou hoje ainda.</p>
        ) : (
          <ul className="space-y-2">
            {a.usersToday.map((u) => (
              <li key={u.email} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2.5 min-w-0">
                  <span className="w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0 uppercase">
                    {u.email.charAt(0)}
                  </span>
                  <span className="truncate text-sm font-medium text-foreground">{u.email}</span>
                </span>
                <span className="flex items-center gap-4 flex-shrink-0 text-xs text-muted-foreground">
                  <span>{u.count} {u.count === 1 ? 'acesso' : 'acessos'}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {fmtLastAccess(u.lastAt)}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
