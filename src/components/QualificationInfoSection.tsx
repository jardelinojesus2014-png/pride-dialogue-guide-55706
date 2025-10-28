import { useState } from 'react';
import { Info, Edit, Plus } from 'lucide-react';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { Button } from './ui/button';
import { QualificationItemEditor } from './QualificationItemEditor';
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
  const { data: items = [], isLoading } = useQualificationItems();
  const updateItem = useUpdateQualificationItem();
  const deleteItem = useDeleteQualificationItem();

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

    const hasContactHeader = categoryItems.some(
      (item) => item.category === 'qualificacao_contato'
    );

    return (
      <div className="space-y-3 text-foreground">
        {categoryItems.map((item, index) => {
          const isFirstContact = hasContactHeader && item.category === 'qualificacao_contato' && index === categoryItems.findIndex((i) => i.category === 'qualificacao_contato');
          
          return (
            <div key={item.id}>
              {isFirstContact && (
                <div className="mt-4 mb-2 font-bold text-accent">
                  Informações do contato:
                </div>
              )}
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
                <div className={isFirstContact ? 'ml-4' : ''}>
                  <div className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <div className="flex-1">
                      <span>{item.content}</span>
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
          <Button
            onClick={() => setIsEditMode(!isEditMode)}
            variant={isEditMode ? 'destructive' : 'default'}
            className="gap-2"
          >
            <Edit className="w-5 h-5" />
            {isEditMode ? 'Sair da Edição' : 'Editar Seção'}
          </Button>
        )}
      </div>

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
