import { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { ScriptSection } from './ScriptSection';
import { sectionsData } from '@/data/sectionsData';

interface ScriptSectionsProps {
  darkMode: boolean;
}

export const ScriptSections = ({ darkMode }: ScriptSectionsProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
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

  const toggleCheck = (item: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleNoteChange = (itemId: string, value: string) => {
    setNotes((prev) => ({
      ...prev,
      [itemId]: value,
    }));
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
            onToggleCheck={toggleCheck}
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
