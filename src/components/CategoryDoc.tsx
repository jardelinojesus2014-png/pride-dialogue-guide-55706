import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, BookOpen, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCategoryTopics, CategoryTopic } from '@/hooks/useCategoryTopics';
import { useDragReorder } from '@/hooks/useDragReorder';
import { useTopicDeepLink, scrollToTopicEl } from '@/hooks/useTopicDeepLink';
import { RichContent } from '@/components/RichContent';
import { RichContentEditor } from '@/components/RichContentEditor';
import { CategoryContentSection } from '@/components/TrainingCategoriesSection';


interface CategoryDocProps {
  categoryId: string;
  categoryName: string;
  isAdmin: boolean;
  onClose: () => void;
}

export const CategoryDoc = ({ categoryId, categoryName, isAdmin, onClose }: CategoryDocProps) => {
  const { topics, loading, addTopic, updateTopic, deleteTopic, moveTopic, reorderTopics } = useCategoryTopics(categoryId);
  const [editingTopic, setEditingTopic] = useState<CategoryTopic | null>(null);
  const [isTopicDialogOpen, setIsTopicDialogOpen] = useState(false);
  const { getItemProps, getItemClassName } = useDragReorder(topics, reorderTopics);


  // Rola até a âncora (#topic-...) quando vem de uma busca.
  // Offset maior: a Central tem nav de abas + barra de busca fixas no topo.
  useTopicDeepLink(!loading && topics.length > 0, undefined, 165);

  const openNewTopic = () => {
    setEditingTopic(null);
    setIsTopicDialogOpen(true);
  };
  const openEditTopic = (t: CategoryTopic) => {
    setEditingTopic(t);
    setIsTopicDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Sumário lateral + tópicos */}
      {(topics.length > 0 || isAdmin) && (
        <div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Nesta página
            </h2>
            {isAdmin && (
              <Button onClick={openNewTopic} variant="outline" size="sm" className="gap-1.5">
                <Plus className="w-4 h-4" /> Adicionar tópico
              </Button>
            )}
          </div>

          {/* Índice de âncoras */}
          {topics.length > 1 && (
            <nav className="flex flex-wrap gap-2 mb-6">
              {topics.map((t) => (
                <button
                  key={t.id}
                  onClick={() => scrollToTopicEl(t.id, 165)}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-muted text-foreground/80 hover:bg-accent/15 hover:text-accent transition-colors"
                >
                  {t.title}
                </button>
              ))}
            </nav>
          )}

          {loading ? (
            <div className="py-10 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent" />
            </div>
          ) : topics.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
              <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-50" />
              {isAdmin
                ? 'Nenhum tópico ainda. Clique em "Adicionar tópico" para criar a documentação desta área.'
                : 'A documentação desta área ainda está sendo preparada.'}
            </div>
          ) : (
            <div className="space-y-8">
              {topics.map((t, i) => (
                <section
                  key={t.id}
                  id={`topic-${t.id}`}
                  className={`scroll-mt-6 rounded-lg transition-shadow ${isAdmin ? getItemClassName(t.id) : ''}`}
                  {...(isAdmin ? getItemProps(t.id) : {})}
                >
                  <div className="flex items-center justify-between gap-2 border-b border-border pb-2 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {isAdmin && (
                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab active:cursor-grabbing flex-shrink-0" title="Arraste para reordenar" />
                      )}
                      <h3 className="text-xl font-bold text-foreground truncate">{t.title}</h3>
                    </div>
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
                  <RichContent content={t.body || ''} />
                </section>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Materiais e downloads (vídeos, PDFs, etc.) */}
      <CategoryContentSection
        categoryId={categoryId}
        categoryName={categoryName}
        showAdminControls={isAdmin}
        onClose={onClose}
      />

      {/* Dialog de edição */}
      <CategoryTopicDialog
        open={isTopicDialogOpen}
        onOpenChange={setIsTopicDialogOpen}
        topic={editingTopic}
        onSave={async (title, body) => {
          if (editingTopic) await updateTopic(editingTopic.id, title, body);
          else await addTopic(title, body);
          setIsTopicDialogOpen(false);
        }}
      />
    </div>
  );
};

interface CategoryTopicDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  topic: CategoryTopic | null;
  onSave: (title: string, body: string) => void;
}

const CategoryTopicDialog = ({ open, onOpenChange, topic, onSave }: CategoryTopicDialogProps) => {
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
            <Label htmlFor="cat-topic-title">Título</Label>
            <Input id="cat-topic-title" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Dia 01, Dia 02, Mensagem de fechamento..." />
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
