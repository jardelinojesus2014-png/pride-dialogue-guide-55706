import { useState } from 'react';
import { Edit, Check, X, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useUpdateSectionTitle, useSectionTitles } from '@/hooks/useSectionTitles';

interface DashboardCardData {
  key: string;
  title: string;
  defaultDescription: string;
  icon: JSX.Element;
  onClick: () => void;
}

interface DashboardSectionProps {
  cards: DashboardCardData[];
  isAdmin: boolean;
  userViewMode: boolean;
}

const EditableDescription = ({
  sectionKey,
  title,
  defaultDescription,
  effectiveIsAdmin,
}: {
  sectionKey: string;
  title: string;
  defaultDescription: string;
  effectiveIsAdmin: boolean;
}) => {
  const { data: sectionTitles = {} } = useSectionTitles();
  const stored = sectionTitles[sectionKey]?.subtitle;
  const description = stored ?? defaultDescription;
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(description);
  const update = useUpdateSectionTitle();

  const handleSave = () => {
    update.mutate(
      { sectionKey, title, subtitle: draft },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  if (isEditing && effectiveIsAdmin) {
    return (
      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={4}
          className="text-sm"
          placeholder="Descrição da aba"
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} disabled={update.isPending} className="bg-green-600 hover:bg-green-700">
            <Check className="w-4 h-4 mr-1" /> Salvar
          </Button>
          <Button size="sm" variant="outline" onClick={() => { setDraft(description); setIsEditing(false); }}>
            <X className="w-4 h-4 mr-1" /> Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{description}</p>
      {effectiveIsAdmin && (
        <Button
          size="sm"
          variant="ghost"
          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0"
          onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
          title="Editar descrição"
        >
          <Edit className="w-3.5 h-3.5" />
        </Button>
      )}
    </div>
  );
};

export const DashboardSection = ({ cards, isAdmin, userViewMode }: DashboardSectionProps) => {
  const effectiveIsAdmin = isAdmin && !userViewMode;

  return (
    <div className="flex flex-col gap-4">
      {cards.map((card) => (
        <button
          key={card.key}
          onClick={card.onClick}
          className="group text-left bg-card rounded-xl shadow-lg border-2 border-primary/30 hover:border-accent hover:shadow-xl transition-all p-5 flex flex-col gap-3 hover:-translate-y-1"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center text-accent flex-shrink-0">
              {card.icon}
            </div>
            <h3 className="text-lg font-black text-foreground flex-1 whitespace-pre-line">
              {card.title.replace(/\n/g, ' ')}
            </h3>
            <ArrowRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>
          <EditableDescription
            sectionKey={`dashboard_card_${card.key}`}
            title={card.title}
            defaultDescription={card.defaultDescription}
            effectiveIsAdmin={effectiveIsAdmin}
          />
        </button>
      ))}
    </div>
  );
};
