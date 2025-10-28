import { useState } from 'react';
import { Info, Edit, Plus } from 'lucide-react';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { QualificationItemEditor } from './QualificationItemEditor';
import { SpinBadge } from './SpinBadge';
import {
  useQualificationItems,
  useUpdateQualificationItem,
  useDeleteQualificationItem,
  useAddQualificationItem,
} from '@/hooks/useQualificationItems';

interface QualificationInfoSectionProps {
  darkMode: boolean;
}

export const QualificationInfoSection = ({ darkMode }: QualificationInfoSectionProps) => {
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItemCategory, setNewItemCategory] = useState<'qualificacao' | 'utilizacao' | 'agendamento'>('qualificacao');
  const { data: items = [], isLoading } = useQualificationItems();
  const updateItem = useUpdateQualificationItem();
  const deleteItem = useDeleteQualificationItem();
  const addItem = useAddQualificationItem();

  const qualificacaoItems = items.filter(
    (item) => item.category === 'qualificacao' || item.category === 'qualificacao_contato'
  );
  const utilizacaoItems = items.filter((item) => item.category === 'utilizacao');
  const agendamentoItems = items.filter((item) => item.category === 'agendamento');

  const handleMoveItem = (itemId: string, direction: 'up' | 'down') => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const newOrder = direction === 'up' ? item.display_order - 1.5 : item.display_order + 1.5;
    updateItem.mutate({ id: itemId, display_order: newOrder });
  };

  const handleAddNewItem = (content: string) => {
    const maxOrder = Math.max(...items.map(i => i.display_order), 0);
    addItem.mutate({
      category: newItemCategory,
      content,
      display_order: maxOrder + 1,
      description: null,
      tip: null,
      video_url: null,
      file_url: null,
      file_name: null,
      spin_type: null,
    });
    setIsAddingNew(false);
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'qualificacao':
      case 'qualificacao_contato':
        return 'QUALIFICAÇÃO DO PLANO (informações)';
      case 'utilizacao':
        return 'DADOS DA UTILIZAÇÃO';
      case 'agendamento':
        return 'AGENDAMENTO DO ATENDIMENTO DA OPORTUNIDADE';
      default:
        return category;
    }
  };

  const renderItems = (categoryItems: typeof items) => {
    if (isLoading) {
      return <p className="text-muted-foreground">Carregando...</p>;
    }

    return (
      <div className="space-y-3 text-foreground">
        {categoryItems.map((item, index) => {
          return (
            <div key={item.id}>
              {isEditMode && isAdmin ? (
                <QualificationItemEditor
                  item={item}
                  onUpdate={(updated) => updateItem.mutate(updated)}
                  onDelete={(id) => deleteItem.mutate(id)}
                  onMoveUp={() => handleMoveItem(item.id, 'up')}
                  onMoveDown={() => handleMoveItem(item.id, 'down')}
                  canMoveUp={index > 0}
                  canMoveDown={index < categoryItems.length - 1}
                />
              ) : (
                <div>
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 border-2 border-blue-400 dark:border-blue-600 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      {item.spin_type && <SpinBadge type={item.spin_type} />}
                      <span className="text-primary font-bold text-lg">•</span>
                      <div className="flex-1">
                        <span className="font-bold text-foreground">{item.content}</span>
                        {item.description && (
                          <div className="mt-2 bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm">
                            📝 {item.description}
                          </div>
                        )}
                        {item.tip && (
                          <div className="bg-accent/10 border-l-4 border-accent p-3 rounded text-sm mt-2">
                            <p className="text-foreground">
                              💡 <strong>Dica:</strong> {item.tip}
                            </p>
                          </div>
                        )}
                        {item.video_url && (
                          <div className="mt-3">
                            <div className="w-64 aspect-video rounded-lg overflow-hidden bg-black shadow-lg">
                              <iframe
                                src={item.video_url}
                                className="w-full h-full"
                                allowFullScreen
                                title={item.content}
                              />
                            </div>
                          </div>
                        )}
                        {item.file_url && item.file_name && (
                          <a
                            href={item.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-2 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-2 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            {item.file_name}
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="bg-card rounded-lg shadow-xl p-6 sm:p-8 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-full p-3 shadow-lg">
            <Info className="w-6 h-6 text-primary-foreground" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-primary">
            Informações Necessárias na Qualificação
          </h2>
        </div>
        {!adminLoading && isAdmin && (
          <div className="flex gap-2">
            <Button
              onClick={() => setIsAddingNew(true)}
              variant="outline"
              className="gap-2"
            >
              <Plus className="w-5 h-5" />
              Novo Item
            </Button>
            <Button
              onClick={() => setIsEditMode(!isEditMode)}
              variant={isEditMode ? 'destructive' : 'default'}
              className="gap-2"
            >
              <Edit className="w-5 h-5" />
              {isEditMode ? 'Sair da Edição' : 'Editar Seção'}
            </Button>
          </div>
        )}
      </div>

      {isAddingNew && (
        <div className="bg-card border-2 border-primary rounded-lg p-6 mb-6 space-y-4">
          <h3 className="font-bold text-lg">Adicionar Novo Item</h3>
          <div className="space-y-2">
            <Label>Categoria</Label>
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value as any)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
            >
              <option value="qualificacao">Qualificação do Plano</option>
              <option value="utilizacao">Dados da Utilização</option>
              <option value="agendamento">Agendamento do Atendimento</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Texto do Item</Label>
            <Input
              id="new-item-content"
              placeholder="Ex: Tempo de Plano atual"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  handleAddNewItem(e.currentTarget.value);
                }
              }}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsAddingNew(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                const input = document.getElementById('new-item-content') as HTMLInputElement;
                if (input?.value.trim()) {
                  handleAddNewItem(input.value);
                }
              }}
            >
              Adicionar
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* QUALIFICAÇÃO DO PLANO */}
        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="text-xl font-black text-accent mb-4">
            {getCategoryTitle('qualificacao')}
          </h3>
          {renderItems(qualificacaoItems)}
        </div>

        {/* DADOS DA UTILIZAÇÃO */}
        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="text-xl font-black text-accent mb-4">
            {getCategoryTitle('utilizacao')}
          </h3>
          {renderItems(utilizacaoItems)}
        </div>

        {/* AGENDAMENTO DO ATENDIMENTO DA OPORTUNIDADE */}
        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="text-xl font-black text-accent mb-4">
            {getCategoryTitle('agendamento')}
          </h3>
          {renderItems(agendamentoItems)}
        </div>
      </div>
    </section>
  );
};
