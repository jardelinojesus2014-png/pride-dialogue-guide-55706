import { useState } from 'react';
import { ChevronUp, AlertTriangle } from 'lucide-react';
import { ScriptSection } from './ScriptSection';
import { sectionsData } from '@/data/sectionsData';
import { useScriptNotes } from '@/hooks/useScriptNotes';
import { useScriptCheckedItems } from '@/hooks/useScriptCheckedItems';

interface ScriptSectionsProps {
  darkMode: boolean;
  userViewMode?: boolean;
}

export const ScriptSections = ({ darkMode, userViewMode = false }: ScriptSectionsProps) => {
  const { notes, saveNote, loading: notesLoading } = useScriptNotes();
  const { checkedItems, toggleCheck, loading: checkedLoading } = useScriptCheckedItems();
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [showNotes, setShowNotes] = useState<Record<string, boolean>>({});

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

  if (notesLoading || checkedLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {/* Banner de alerta antes da etapa 1 */}
      <div className="mb-6 bg-red-600 dark:bg-red-700 rounded-xl p-4 border-2 border-red-700 dark:border-red-500 shadow-lg">
        <div className="flex items-center justify-center gap-3">
          <AlertTriangle className="w-5 h-5 text-white flex-shrink-0" />
          <p className="text-white font-bold text-sm sm:text-base text-center">
            A ordem dos fatores altera o resultado
          </p>
          <AlertTriangle className="w-5 h-5 text-white flex-shrink-0" />
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {sectionsData.map((section) => (
          <ScriptSection
            key={section.id}
            section={section}
            darkMode={darkMode}
            isExpanded={expandedSections[section.id] || false}
            onToggle={() => toggleSection(section.id)}
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
