import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import { useTrainingCategories } from '@/hooks/useTrainingCategories';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useAuth } from '@/hooks/useAuth';
import { useTrainingActivity, ActivityItem } from '@/hooks/useTrainingActivity';
import { useTrainingSearch, TrainingSearchItem } from '@/hooks/useTrainingSearch';
import { Operadora } from '@/hooks/useOperadoras';
import { OperadorasSection } from '@/components/OperadorasSection';
import { TrainingSearchBar } from '@/components/TrainingSearchBar';
import { CategoryDoc } from '@/components/CategoryDoc';
import { MainTabsNav } from '@/components/MainTabsNav';
import { AppHeader } from '@/components/AppHeader';
import { getIconComponent } from '@/components/TrainingCategoriesSection';
import { logTrainingEvent } from '@/lib/trainingEvents';

const Central = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const { categories, loading } = useTrainingCategories();
  const { isAdmin } = useIsAdmin();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite, addRecent } = useTrainingActivity(user?.id);
  const { items: searchItems } = useTrainingSearch();

  const current = categories.find((c) => c.id === categoryId);

  // Dentro de uma área, a busca fica restrita ao conteúdo desta área
  const scopedSearchItems = useMemo(() => {
    if (!current) return [];
    if (current.is_operadoras_section) {
      return searchItems.filter((it) => it.kind === 'operadora' || it.parentType === 'operadora');
    }
    return searchItems.filter((it) => it.parentType === 'category' && it.parentId === current.id);
  }, [searchItems, current?.id, current?.is_operadoras_section]);


  // Registra o acesso à área (analytics do admin)
  useEffect(() => {
    if (current) logTrainingEvent(user?.id, 'category_view', current.id, current.title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id, user?.id]);

  const operadoraActivity = (op: Operadora): ActivityItem => ({
    id: `operadora:${op.id}`,
    kind: 'operadora',
    title: op.name,
    refId: op.id,
  });

  const searchItemToActivity = (it: TrainingSearchItem): ActivityItem => {
    if (it.kind === 'operadora') {
      return { id: `operadora:${it.parentId}`, kind: 'operadora', title: it.title, refId: it.parentId };
    }
    if (it.kind === 'category') {
      return { id: `category:${it.parentId}`, kind: 'category', title: it.title, refId: it.parentId };
    }
    return {
      id: `content:${it.key}`,
      kind: 'content',
      title: it.title,
      subtitle: it.parentName,
      contentType: it.contentType,
      fileUrl: it.fileUrl,
    };
  };

  const handleSearchSelect = (it: TrainingSearchItem) => {
    if (it.kind === 'content' && it.fileUrl) {
      window.open(it.fileUrl, '_blank', 'noopener,noreferrer');
    } else if (it.kind === 'operadora' && it.parentId) {
      navigate(`/operadora/${it.parentId}`);
    } else if (it.kind === 'topic' && it.parentId) {
      const anchor = it.topicId ? `#topic-${it.topicId}` : '';
      if (it.parentType === 'category') navigate(`/central/${it.parentId}${anchor}`);
      else navigate(`/operadora/${it.parentId}${anchor}`);
    } else if (it.kind === 'category' && it.parentId) {
      navigate(`/central/${it.parentId}`);
    }
    if (it.kind === 'topic' && it.parentType === 'category') {
      addRecent({ id: `category:${it.parentId}`, kind: 'category', title: it.parentName || it.title, refId: it.parentId });
    } else if (it.kind === 'topic') {
      addRecent({ id: `operadora:${it.parentId}`, kind: 'operadora', title: it.parentName || it.title, refId: it.parentId });
    } else {
      addRecent(searchItemToActivity(it));
    }
  };

  const goBack = () => navigate('/?tab=treinamentos');

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  if (!current) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg text-muted-foreground">Área não encontrada.</p>
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent/90"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Cabeçalho + navegação principal congelados no topo */}
        <div data-sticky-header className="sticky top-0 z-50 -mx-4 -mt-6 px-4 pt-4 pb-2 mb-4 bg-background">
          <div className="mb-3">
            <AppHeader />
          </div>
          <MainTabsNav activeKey="tab_treinamentos" />
        </div>

        {/* Cabeçalho */}
        <div className="rounded-2xl bg-gradient-hero p-6 sm:p-8 shadow-xl mb-6">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Central de conhecimento</p>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">{current.title}</h1>
          {current.description && (
            <p className="text-white/80 mt-2 max-w-2xl">{current.description}</p>
          )}
        </div>

        {/* Corpo: barra lateral de áreas + conteúdo */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          {/* Barra lateral */}
          <aside className="lg:sticky lg:top-[210px] h-fit">
            <div className="rounded-2xl border border-border bg-card p-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-2">
                Áreas
              </p>
              <nav className="space-y-1">
                {categories.map((cat) => {
                  const Icon = getIconComponent(cat.icon);
                  const active = cat.id === current.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => navigate(`/central/${cat.id}`)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        active ? 'bg-accent/15 text-primary' : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-accent' : 'text-muted-foreground'}`} />
                      <span className="truncate text-left">{cat.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Conteúdo principal */}
          <main className="min-w-0">
            {/* Barra de pesquisa fixa no topo do conteúdo */}
            <div data-sticky-header className="sticky top-[210px] z-30 mb-6">
              <TrainingSearchBar
                items={scopedSearchItems}
                allItems={searchItems}
                scopeLabel={current.title}
                onSelect={handleSearchSelect}
                onSearch={(q) => logTrainingEvent(user?.id, 'search', null, q)}
                className="w-full"
              />
            </div>


            {/* Banner "Em Construção" */}
            {current.show_banner && (
              <div className="bg-card rounded-2xl shadow-md p-8 text-center border border-border mb-6">
                <div className="inline-block bg-gradient-to-r from-orange-500 to-red-600 rounded-full p-4 mb-4 shadow-2xl">
                  <Construction className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-black text-primary mb-2">🚧 Em Construção</h2>
                {current.banner_subtitle && (
                  <p className="text-lg text-muted-foreground">{current.banner_subtitle}</p>
                )}
              </div>
            )}

            {current.is_operadoras_section ? (
              <OperadorasSection
                embedded
                isAdmin={isAdmin}
                userViewMode={false}
                isOperadoraFavorite={isFavorite}
                onToggleOperadoraFavorite={(op) => toggleFavorite(operadoraActivity(op))}
                onOperadoraOpened={(op) => addRecent(operadoraActivity(op))}
              />
            ) : (
              <CategoryDoc
                categoryId={current.id}
                categoryName={current.title}
                isAdmin={isAdmin}
                onClose={goBack}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Central;
