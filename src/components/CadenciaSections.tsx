import { useState } from 'react';
import { ChevronUp, Edit } from 'lucide-react';
import { ScriptSection } from './ScriptSection';
import { useCadenciaItems } from '@/hooks/useCadenciaItems';
import { useCadenciaDays } from '@/hooks/useCadenciaDays';
import { useScriptNotes } from '@/hooks/useScriptNotes';
import { useScriptCheckedItems } from '@/hooks/useScriptCheckedItems';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { CadenciaDayEditor } from './CadenciaDayEditor';
import { Button } from './ui/button';

interface CadenciaSectionsProps {
  darkMode: boolean;
  userViewMode?: boolean;
}

export const CadenciaSections = ({ darkMode, userViewMode = false }: CadenciaSectionsProps) => {
  const { items, loading: itemsLoading } = useCadenciaItems();
  const { days, isLoading: daysLoading, updateDay } = useCadenciaDays();
  const { notes, saveNote, loading: notesLoading } = useScriptNotes();
  const { checkedItems, toggleCheck, loading: checkedLoading } = useScriptCheckedItems();
  const { isAdmin } = useIsAdmin();
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [showNotes, setShowNotes] = useState<Record<string, boolean>>({});
  const [editingDay, setEditingDay] = useState<string | null>(null);

  // Group items by day
  const dayGroups = items.reduce((acc, item) => {
    if (!acc[item.day_id]) {
      acc[item.day_id] = [];
    }
    acc[item.day_id].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  // Create sections data structure with titles from database
  const daysData = Object.entries(dayGroups).map(([dayId, dayItems]) => {
    const dayInfo = days.find(d => d.day_id === dayId);
    
    return {
      id: dayId,
      title: dayInfo?.title || `DIA ${dayId.replace('dia', '')}`,
      subtitle: dayInfo?.subtitle || '',
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

  if (itemsLoading || daysLoading || notesLoading || checkedLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const editingDayData = editingDay ? days.find(d => d.day_id === editingDay) : null;

  const handleSaveDay = (id: string, updates: Partial<typeof editingDayData>) => {
    updateDay({ id, updates });
  };

  return (
    <>
      <div className="space-y-4 mb-8">
        {daysData.map((day) => {
          const dayInfo = days.find(d => d.day_id === day.id);
          
          return (
            <div key={day.id} className="relative">
              {isAdmin && !userViewMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -top-2 right-2 z-10"
                  onClick={() => setEditingDay(day.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              <ScriptSection
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
            </div>
          );
        })}
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

      {editingDayData && (
        <CadenciaDayEditor
          day={editingDayData}
          open={!!editingDay}
          onOpenChange={(open) => !open && setEditingDay(null)}
          onSave={handleSaveDay}
        />
      )}
    </>
  );
};
