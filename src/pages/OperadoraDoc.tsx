import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Star, ChevronRight as ChevronRightIcon, ChevronDown, Plus, Pencil, Trash2,
  ArrowUp, ArrowDown, BookOpen, GripVertical, FileDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useOperadoras, Operadora } from '@/hooks/useOperadoras';
import { useOperadoraTopics, OperadoraTopic } from '@/hooks/useOperadoraTopics';
import { useDragReorder } from '@/hooks/useDragReorder';
import { useTopicDeepLink, scrollToTopicEl } from '@/hooks/useTopicDeepLink';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useAuth } from '@/hooks/useAuth';
import { useTrainingActivity } from '@/hooks/useTrainingActivity';
import { useTrainingCategories } from '@/hooks/useTrainingCategories';
import { useTrainingSearch, TrainingSearchItem } from '@/hooks/useTrainingSearch';
import { RichContent } from '@/components/RichContent';
import { RichContentEditor } from '@/components/RichContentEditor';
import { MainTabsNav } from '@/components/MainTabsNav';
import { AppHeader } from '@/components/AppHeader';
import { OperadoraVideos } from '@/components/OperadoraVideos';
import { OperadoraLogo } from '@/components/OperadoraLogo';
import { TrainingSearchBar } from '@/components/TrainingSearchBar';
import { logTrainingEvent } from '@/lib/trainingEvents';
import { exportDocToPdf } from '@/lib/exportDocPdf';
import { ExpandedOperadoraContent } from '@/components/OperadorasSection';

const OperadoraDoc = () => {
  const { operadoraId } = useParams<{ operadoraId: string }>();
  const navigate = useNavigate();

  const { operadoras, loading, updateOperadoraMeta } = useOperadoras();
  const { topics, loading: topicsLoading, addTopic, updateTopic, deleteTopic, moveTopic, reorderTopics } =
    useOperadoraTopics(operadoraId);
  const { isAdmin } = useIsAdmin();
  const { getItemProps, getItemClassName, getHandleProps } = useDragReorder(topics, reorderTopics);
  const { user } = useAuth();
  const { isFavorite, toggleFavorite, addRecent } = useTrainingActivity(user?.id);
  const { categories } = useTrainingCategories();
  const { items: searchItems } = useTrainingSearch();

  const operadora = operadoras.find((o) => o.id === operadoraId);
  const index = operadoras.findIndex((o) => o.id === operadoraId);
  const prev = index > 0 ? operadoras[index - 1] : null;
  const next = index >= 0 && index < operadoras.length - 1 ? operadoras[index + 1] : null;

  // Busca restrita ao conteúdo desta operadora
  const scopedSearchItems = useMemo(() => {
    if (!operadora) return [];
    return searchItems.filter((it) =>
      (it.kind === 'operadora' && it.parentId === operadora.id) ||
      (it.parentType === 'operadora' && it.parentId === operadora.id)
    );
  }, [searchItems, operadora?.id]);

  const [editingTopic, setEditingTopic] = useState<OperadoraTopic | null>(null);
  const [isTopicDialogOpen, setIsTopicDialogOpen] = useState(false);
  const [isMetaDialogOpen, setIsMetaDialogOpen] = useState(false);
  const [openTopics, setOpenTopics] = useState<string[]>([]);
  const initRef = useRef(false);

  const toggleTopic = (id: string) =>
    setOpenTopics((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const openTopicId = (id: string) =>
    setOpenTopics((prev) => (prev.includes(id) ? prev : [...prev, id]));

  // Abre o tópico e rola até ele (índice lateral "Nesta página")
  const openAndScroll = (id: string) => {
    openTopicId(id);
    scrollToTopicEl(id, 100);
  };

  // Navega a partir de um resultado da busca local da operadora
  const handleSearchSelect = (it: TrainingSearchItem) => {
    if (it.kind === 'content' && it.fileUrl) {
      window.open(it.fileUrl, '_blank', 'noopener,noreferrer');
      addRecent({ id: `content:${it.key}`, kind: 'content', title: it.title, subtitle: it.parentName, contentType: it.contentType, fileUrl: it.fileUrl });
    } else if (it.kind === 'topic' && it.topicId) {
      openAndScroll(it.topicId);
      addRecent({ id: `operadora:${operadora?.id}`, kind: 'operadora', title: operadora?.name || it.title, refId: operadora?.id });
    } else if (it.kind === 'operadora' && it.parentId) {
      navigate(`/operadora/${it.parentId}`);
      addRecent({ id: `operadora:${it.parentId}`, kind: 'operadora', title: it.title, refId: it.parentId });
    }
  };

  // Abertura inicial: todos os tópicos já vêm abertos (leitura corrida).
  // O corretor recolhe o que não interessa.
  useEffect(() => {
    if (initRef.current || topics.length === 0) return;
    initRef.current = true;
    setOpenTopics(topics.map((t) => t.id));
  }, [topics]);

  const allOpen = topics.length > 0 && openTopics.length === topics.length;
  const toggleAll = () => setOpenTopics(allOpen ? [] : topics.map((t) => t.id));

  // Deep-link vindo da busca: abre o tópico e rola até ele (com retentativas)
  useTopicDeepLink(topics.length > 0, openTopicId, 100);

  // Registra o acesso à operadora (analytics do admin)
  useEffect(() => {
    if (operadora) logTrainingEvent(user?.id, 'operadora_view', operadora.id, operadora.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operadora?.id, user?.id]);


  const goOperadorasList = () => {
    const opCat = categories.find((c) => c.is_operadoras_section);
    navigate(opCat ? `/central/${opCat.id}` : '/?tab=treinamentos');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  if (!operadora) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg text-muted-foreground">Operadora não encontrada.</p>
        <Button onClick={goOperadorasList} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
      </div>
    );
  }

  const favId = `operadora:${operadora.id}`;
  const fav = isFavorite(favId);
  const operadoraFavItem = { id: favId, kind: 'operadora' as const, title: operadora.name, refId: operadora.id };

  const openNewTopic = () => {
    setEditingTopic(null);
    setIsTopicDialogOpen(true);
  };
  const openEditTopic = (t: OperadoraTopic) => {
    setEditingTopic(t);
    setIsTopicDialogOpen(true);
  };

  const handleExportPdf = () => {
    exportDocToPdf({
      title: operadora.name,
      subtitle: operadora.subtitle,
      meta: operadora.ans ? `ANS nº ${operadora.ans}` : null,
      logoUrl: operadora.logo_url,
      topics: topics.map((t) => ({ title: t.title, body: t.body })),
    });
    logTrainingEvent(user?.id, 'export_pdf', operadora.id, operadora.name);
  };



  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Cabeçalho + navegação principal congelados no topo */}
        <div data-sticky-header className="sticky top-0 z-50 -mx-4 -mt-6 px-4 pt-4 pb-2 mb-4 bg-background">
          <div className="mb-3">
            <AppHeader />
          </div>
          <MainTabsNav activeKey="tab_treinamentos" />
        </div>

        {/* Voltar para a lista de operadoras */}
        <button
          onClick={goOperadorasList}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para operadoras
        </button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-5">
          <button onClick={() => navigate('/?tab=treinamentos')} className="hover:text-foreground">Home</button>
          <ChevronRightIcon className="w-3.5 h-3.5" />
          <button onClick={goOperadorasList} className="hover:text-foreground">Operadoras</button>
          <ChevronRightIcon className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">{operadora.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
          {/* Sumário lateral */}
          <aside className="hidden lg:block">
            <div className="sticky top-[210px]">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                Nesta página
              </p>
              <nav className="space-y-0.5 border-l border-border">
                {topics.map((t) => {
                  const active = openTopics.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => openAndScroll(t.id)}
                      className={`block w-full text-left pl-3 -ml-px py-1.5 text-sm border-l-2 transition-colors ${
                        active
                          ? 'border-accent text-foreground font-medium'
                          : 'border-transparent text-muted-foreground hover:border-accent hover:text-foreground'
                      }`}
                    >
                      {t.title}
                    </button>
                  );
                })}
                <a
                  href="#materiais"
                  className="block pl-3 -ml-px py-1.5 text-sm text-muted-foreground border-l-2 border-transparent hover:border-accent hover:text-foreground transition-colors"
                >
                  Materiais e downloads
                </a>
              </nav>
            </div>
          </aside>

          {/* Conteúdo */}
          <main className="min-w-0">
            {/* Barra de pesquisa restrita a esta operadora */}
            <div className="mb-6">
              <TrainingSearchBar
                items={scopedSearchItems}
                allItems={searchItems}
                scopeLabel={operadora.name}
                onSelect={handleSearchSelect}
                onSearch={(q) => logTrainingEvent(user?.id, 'search', operadora?.id, q)}
                className="w-full"
              />
            </div>

            {/* Cabeçalho da operadora */}
            <div className="flex items-start gap-4 mb-6">
              <OperadoraLogo url={operadora.logo_url} name={operadora.name} className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-primary">{operadora.name}</h1>
                  <button
                    onClick={() => toggleFavorite(operadoraFavItem)}
                    className={`p-1 rounded-full transition-colors ${fav ? 'text-accent' : 'text-muted-foreground/50 hover:text-accent'}`}
                    title={fav ? 'Remover dos favoritos' : 'Favoritar'}
                  >
                    <Star className={`w-5 h-5 ${fav ? 'fill-accent' : ''}`} />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => setIsMetaDialogOpen(true)}
                      className="ml-1 text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                    >
                      <Pencil className="w-3 h-3" /> Editar cabeçalho
                    </button>
                  )}
                </div>
                {operadora.subtitle && <p className="text-sm text-muted-foreground mt-1">{operadora.subtitle}</p>}
                {operadora.ans && <p className="text-xs text-muted-foreground mt-0.5">ANS nº {operadora.ans}</p>}
                {operadora.tags && operadora.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {operadora.tags.map((tag, i) => (
                      <span key={i} className="text-xs font-medium bg-muted text-foreground/80 px-2.5 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Vídeo(s) no topo — minimizado, abre grande ao clicar */}
            <OperadoraVideos operadoraId={operadora.id} isAdmin={isAdmin} />

            {/* Tópicos */}
            {(topics.length > 1 || isAdmin) && (
              <div className="flex items-center justify-end gap-2 mb-4">
                {topics.length > 1 && (
                  <button
                    onClick={toggleAll}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-accent transition-colors px-2 py-1.5 rounded-lg hover:bg-muted"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${allOpen ? '' : '-rotate-90'}`} />
                    {allOpen ? 'Recolher tudo' : 'Expandir tudo'}
                  </button>
                )}
                {isAdmin && (
                  <Button onClick={openNewTopic} variant="outline" size="sm" className="gap-1.5">
                    <Plus className="w-4 h-4" /> Adicionar tópico
                  </Button>
                )}
              </div>
            )}

            {topicsLoading ? (
              <div className="py-10 flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent" />
              </div>
            ) : topics.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
                <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-50" />
                {isAdmin
                  ? 'Nenhum tópico ainda. Clique em "Adicionar tópico" para criar a documentação desta operadora.'
                  : 'A documentação desta operadora ainda está sendo preparada.'}
              </div>
            ) : (
              <div className="space-y-3">
                {topics.map((t, i) => {
                  const isOpen = openTopics.includes(t.id);
                  return (
                    <div
                      key={t.id}
                      id={`topic-${t.id}`}
                      className={`scroll-mt-24 rounded-2xl border bg-card overflow-hidden transition-colors ${
                        isOpen ? 'border-accent/50' : 'border-border hover:border-accent/40'
                      } ${isAdmin ? getItemClassName(t.id) : ''}`}
                      {...(isAdmin ? getItemProps(t.id) : {})}
                    >
                      <div className="flex items-center gap-2 px-4 py-3">
                        {isAdmin && (
                          <span title="Arraste para reordenar" {...getHandleProps(t.id)} className="cursor-grab active:cursor-grabbing flex-shrink-0">
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                          </span>
                        )}
                        <button
                          onClick={() => toggleTopic(t.id)}
                          className="flex-1 flex items-center gap-3 text-left min-w-0"
                        >
                          <ChevronDown className={`w-5 h-5 text-accent flex-shrink-0 transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`} />
                          <h3 className="text-base sm:text-lg font-bold text-foreground truncate">{t.title}</h3>
                        </button>
                        {isAdmin && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button onClick={() => moveTopic(t.id, 'up')} disabled={i === 0}
                              className="p-1.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-30" title="Mover para cima">
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => moveTopic(t.id, 'down')} disabled={i === topics.length - 1}
                              className="p-1.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-30" title="Mover para baixo">
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => openEditTopic(t)}
                              className="p-1.5 rounded hover:bg-muted text-accent" title="Editar tópico">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => { if (confirm(`Excluir o tópico "${t.title}"?`)) deleteTopic(t.id); }}
                              className="p-1.5 rounded hover:bg-destructive/10 text-destructive" title="Excluir tópico">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 border-t border-border">
                          <RichContent content={t.body || ''} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Materiais e downloads (vídeos embutidos, PDFs, etc.) */}
            <section id="materiais" className="scroll-mt-6 mt-10">
              <ExpandedOperadoraContent
                embedded
                hideVideos
                operadoraId={operadora.id}
                operadoraName={operadora.name}
                showAdminControls={isAdmin}
                onClose={() => {}}
              />
            </section>

            {/* Navegação anterior / próxima */}
            <div className="flex items-center justify-between gap-4 border-t border-border mt-10 pt-5">
              {prev ? (
                <button onClick={() => navigate(`/operadora/${prev.id}`)} className="group text-left">
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Anterior</span>
                  <span className="block font-semibold text-foreground group-hover:text-accent">{prev.name}</span>
                </button>
              ) : <span />}
              {next ? (
                <button onClick={() => navigate(`/operadora/${next.id}`)} className="group text-right">
                  <span className="text-xs text-muted-foreground flex items-center justify-end gap-1">Próxima <ArrowRight className="w-3 h-3" /></span>
                  <span className="block font-semibold text-foreground group-hover:text-accent">{next.name}</span>
                </button>
              ) : <span />}
            </div>
          </main>
        </div>
      </div>

      {/* Dialogs de edição (admin) */}
      <TopicDialog
        open={isTopicDialogOpen}
        onOpenChange={setIsTopicDialogOpen}
        topic={editingTopic}
        onSave={async (title, body) => {
          if (editingTopic) await updateTopic(editingTopic.id, title, body);
          else await addTopic(title, body);
          setIsTopicDialogOpen(false);
        }}
      />
      <MetaDialog
        open={isMetaDialogOpen}
        onOpenChange={setIsMetaDialogOpen}
        operadora={operadora}
        onSave={async (meta) => {
          await updateOperadoraMeta(operadora.id, meta);
          setIsMetaDialogOpen(false);
        }}
      />
    </div>
  );
};

// ---- Dialog: adicionar/editar tópico ----
interface TopicDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  topic: OperadoraTopic | null;
  onSave: (title: string, body: string) => void;
}

const TopicDialog = ({ open, onOpenChange, topic, onSave }: TopicDialogProps) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(topic?.title || '');
      setBody(topic?.body || '');
    }
  }, [open, topic]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{topic ? 'Editar tópico' : 'Novo tópico'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="topic-title">Título</Label>
            <Input id="topic-title" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Regras comerciais, Carências, Reembolso..." />
          </div>
          <div>
            <Label>Conteúdo</Label>
            <RichContentEditor
              value={body}
              onChange={setBody}
              placeholder="Escreva aqui. Cole prints (Ctrl+V), arraste imagens ou cole links do YouTube/Loom."
            />
          </div>
          <Button onClick={() => title.trim() && onSave(title.trim(), body)} disabled={!title.trim()} className="w-full">
            {topic ? 'Salvar alterações' : 'Adicionar tópico'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ---- Dialog: editar cabeçalho (subtítulo, tags, ANS) ----
interface MetaDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  operadora: Operadora;
  onSave: (meta: { subtitle: string | null; tags: string[] | null; ans: string | null }) => void;
}

const MetaDialog = ({ open, onOpenChange, operadora, onSave }: MetaDialogProps) => {
  const [subtitle, setSubtitle] = useState('');
  const [tags, setTags] = useState('');
  const [ans, setAns] = useState('');

  useEffect(() => {
    if (open) {
      setSubtitle(operadora.subtitle || '');
      setTags((operadora.tags || []).join(', '));
      setAns(operadora.ans || '');
    }
  }, [open, operadora]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar cabeçalho</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="meta-subtitle">Subtítulo</Label>
            <Input id="meta-subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Ex: Seguradora especializada em saúde · PME 3 a 199" />
          </div>
          <div>
            <Label htmlFor="meta-tags">Tags (separadas por vírgula)</Label>
            <Input id="meta-tags" value={tags} onChange={(e) => setTags(e.target.value)}
              placeholder="Ex: Seguradora, PME, Rede D'Or" />
          </div>
          <div>
            <Label htmlFor="meta-ans">Número ANS</Label>
            <Input id="meta-ans" value={ans} onChange={(e) => setAns(e.target.value)} placeholder="Ex: 005711" />
          </div>
          <Button
            onClick={() =>
              onSave({
                subtitle: subtitle.trim() || null,
                tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
                ans: ans.trim() || null,
              })
            }
            className="w-full"
          >
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OperadoraDoc;
