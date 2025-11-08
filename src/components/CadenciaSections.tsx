import { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { ScriptSection } from './ScriptSection';
import { useCadenciaItems } from '@/hooks/useCadenciaItems';
import { useScriptNotes } from '@/hooks/useScriptNotes';
import { useScriptCheckedItems } from '@/hooks/useScriptCheckedItems';

interface CadenciaSectionsProps {
  darkMode: boolean;
  userViewMode?: boolean;
}

export const CadenciaSections = ({ darkMode, userViewMode = false }: CadenciaSectionsProps) => {
  const { items, loading: itemsLoading } = useCadenciaItems();
  const { notes, saveNote, loading: notesLoading } = useScriptNotes();
  const { checkedItems, toggleCheck, loading: checkedLoading } = useScriptCheckedItems();
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [showNotes, setShowNotes] = useState<Record<string, boolean>>({});

  // Group items by day
  const dayGroups = items.reduce((acc, item) => {
    if (!acc[item.day_id]) {
      acc[item.day_id] = [];
    }
    acc[item.day_id].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  // Create sections data structure
  const daysData = Object.entries(dayGroups).map(([dayId, dayItems]) => {
    const dayNumber = dayId.replace('dia', '');
    const firstItem = dayItems[0];
    
    return {
      id: dayId,
      title: `DIA ${dayNumber}`,
      subtitle: firstItem ? 
        (dayId === 'dia1' ? 'Primeiro contato - Apresentação e qualificação inicial' :
         dayId === 'dia2' ? 'Follow-up - Reforço com vídeo institucional' :
         dayId === 'dia3' ? 'Reengajamento - Credibilidade com avaliações' :
         'Encerramento - Última tentativa e disponibilização') : '',
      colorClass: 'bg-accent/10',
      items: dayItems.map(item => ({
        id: item.id,
        section_id: item.day_id,
        item_id: item.item_id,
        label: item.label,
        script: item.script,
        alternatives: null,
        tips: item.tip ? [item.tip] : null,
        warnings: item.note ? [item.note] : null,
        collect: item.collect,
        response_options: null,
        display_order: item.display_order
      }))
    };
  }).sort((a, b) => a.id.localeCompare(b.id));

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleToggleCheck = (sectionId: string, itemId: string) => {
    toggleCheck(sectionId, itemId);
  };

  const handleNoteChange = (sectionId: string, itemId: string, value: string) => {
    saveNote(sectionId, itemId, value);
  };

  const toggleNotes = (sectionId: string, itemId: string) => {
    const key = `${sectionId}-${itemId}`;
    setShowNotes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const closeAllSections = () => {
    setExpandedSections({});
  };

  const hasExpandedSections = Object.values(expandedSections).some((val) => val === true);

  if (itemsLoading || notesLoading || checkedLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 mb-8">
        {daysData.map((day) => (
          <ScriptSection
            key={day.id}
            section={day}
            darkMode={darkMode}
            isExpanded={expandedSections[day.id] || false}
            onToggle={() => toggleSection(day.id)}
            checkedItems={checkedItems}
            onToggleCheck={handleToggleCheck}
            notes={notes}
            onNoteChange={handleNoteChange}
            showNotes={showNotes}
            onToggleNotes={toggleNotes}
            userViewMode={userViewMode}
          />
        ))}
      </div>

      {hasExpandedSections && (
        <button
          onClick={closeAllSections}
          className="fixed bottom-6 right-6 bg-gradient-hero hover:opacity-90 text-accent font-bold px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 transition-all duration-300 hover:scale-110 z-50 border-2 border-accent"
          title="Minimizar todas as etapas"
        >
          <ChevronUp className="w-5 h-5" />
          <span className="hidden sm:inline">Minimizar Tudo</span>
        </button>
      )}
    </>
  );
};
