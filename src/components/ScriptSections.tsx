import { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { ScriptSection } from './ScriptSection';
import { sectionsData } from '@/data/sectionsData';
import { useScriptNotes } from '@/hooks/useScriptNotes';
import { useScriptCheckedItems } from '@/hooks/useScriptCheckedItems';

interface ScriptSectionsProps {
  darkMode: boolean;
}

export const ScriptSections = ({ darkMode }: ScriptSectionsProps) => {
  const { notes, saveNote, loading: notesLoading } = useScriptNotes();
  const { checkedItems, toggleCheck, loading: checkedLoading } = useScriptCheckedItems();
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [showNotes, setShowNotes] = useState<Record<string, boolean>>({});
  const [audioFiles, setAudioFiles] = useState<Record<string, { url: string; name: string }>>({});
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [showAudioInput, setShowAudioInput] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleToggleCheck = (itemId: string) => {
    const [sectionId, itemIdOnly] = itemId.split('-');
    toggleCheck(sectionId, itemIdOnly);
  };

  const handleNoteChange = (itemId: string, value: string) => {
    const [sectionId, itemIdOnly] = itemId.split('-');
    saveNote(sectionId, itemIdOnly, value);
  };

  const toggleNotes = (itemId: string) => {
    setShowNotes((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const toggleAudioPlay = (itemId: string) => {
    setPlayingAudio(playingAudio === itemId ? null : itemId);
  };

  const handleAudioLinkSave = (sectionId: string, link: string) => {
    if (link.trim()) {
      setAudioFiles((prev) => ({
        ...prev,
        [sectionId]: { url: link.trim(), name: 'Áudio da etapa' },
      }));
      setShowAudioInput((prev) => ({ ...prev, [sectionId]: false }));
    }
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
            audioFile={audioFiles[section.id]}
            playingAudio={playingAudio}
            onToggleAudioPlay={toggleAudioPlay}
            onAudioLinkSave={handleAudioLinkSave}
            showAudioInput={showAudioInput[section.id] || false}
            setShowAudioInput={(show) =>
              setShowAudioInput((prev) => ({ ...prev, [section.id]: show }))
            }
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
