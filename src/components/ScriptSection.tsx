import { ChevronDown, ChevronRight, Upload, Play, Pause, X, Music } from 'lucide-react';
import { useState } from 'react';
import { ScriptItem } from './ScriptItem';
import { Section } from '@/data/sectionsData';
import { AudioUploadDialog } from './AudioUploadDialog';
import { AudioFilesList } from './AudioFilesList';
import { useUserAudioFiles } from '@/hooks/useUserAudioFiles';
import { Button } from './ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';

interface ScriptSectionProps {
  section: Section;
  darkMode: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  checkedItems: Record<string, boolean>;
  onToggleCheck: (sectionId: string, itemId: string) => void;
  notes: Record<string, string>;
  onNoteChange: (sectionId: string, itemId: string, value: string) => void;
  showNotes: Record<string, boolean>;
  onToggleNotes: (sectionId: string, itemId: string) => void;
  audioFile?: { url: string; name: string };
  playingAudio: string | null;
  onToggleAudioPlay: (itemId: string) => void;
  onAudioLinkSave: (sectionId: string, link: string) => void;
  showAudioInput: boolean;
  setShowAudioInput: (show: boolean) => void;
}

export const ScriptSection = ({
  section,
  darkMode,
  isExpanded,
  onToggle,
  checkedItems,
  onToggleCheck,
  notes,
  onNoteChange,
  showNotes,
  onToggleNotes,
  audioFile,
  playingAudio,
  onToggleAudioPlay,
  onAudioLinkSave,
  showAudioInput,
  setShowAudioInput,
}: ScriptSectionProps) => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showAudioList, setShowAudioList] = useState(false);
  const { audioFiles, uploadAudioFile, deleteAudioFile, loading } = useUserAudioFiles(section.id);

  const handleUpload = async (title: string, audioBlob: Blob, durationSeconds?: number) => {
    await uploadAudioFile(section.id, title, audioBlob, durationSeconds);
  };

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden border-2 border-border hover:shadow-xl hover:border-accent transition-all duration-300">
      <button
        onClick={onToggle}
        className={`w-full p-5 flex items-center justify-between ${section.colorClass} border-l-4 border-accent transition-all hover:opacity-90 hover:border-l-8`}
      >
        <div className="text-left flex-1">
          <h2 className="text-base sm:text-lg font-bold text-primary">{section.title}</h2>
          <p className="text-sm mt-1 text-muted-foreground">{section.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowUploadDialog(true);
            }}
            className="bg-muted hover:bg-muted/80 p-2 rounded-lg transition-all duration-300 group relative"
            title="Gravar ou fazer upload de áudio"
          >
            <Upload className="w-4 h-4 text-muted-foreground" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg">
              Adicionar áudio
            </span>
          </button>

          {audioFiles.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAudioList(!showAudioList);
              }}
              className="bg-muted hover:bg-muted/80 p-2 rounded-lg transition-all duration-300 group relative"
              title="Ver áudios salvos"
            >
              <Music className="w-4 h-4 text-muted-foreground" />
              {audioFiles.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {audioFiles.length}
                </span>
              )}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg">
                {audioFiles.length} áudio{audioFiles.length !== 1 ? 's' : ''}
              </span>
            </button>
          )}

          {!showAudioInput ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAudioInput(true);
              }}
              className="bg-muted hover:bg-muted/80 p-2 rounded-lg transition-all duration-300 group relative"
              title="Adicionar link de áudio externo"
            >
              <Play className="w-4 h-4 text-muted-foreground" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg">
                Link externo
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                placeholder="Cole o link do áudio..."
                className="px-3 py-1.5 rounded-lg text-sm bg-card border-2 border-input focus:border-accent focus:outline-none text-foreground"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    onAudioLinkSave(section.id, (e.target as HTMLInputElement).value);
                  }
                }}
                autoFocus
              />
              <button
                onClick={() => setShowAudioInput(false)}
                className="text-destructive hover:text-destructive/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {audioFile && !showAudioInput && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleAudioPlay(section.id);
              }}
              className="bg-muted hover:bg-muted/80 p-2 rounded-lg transition-all duration-300 group relative"
              title="Reproduzir áudio"
            >
              {playingAudio === section.id ? (
                <Pause className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Play className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg">
                Áudio da etapa
              </span>
            </button>
          )}

          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
          ) : (
            <ChevronRight className="w-5 h-5 text-primary flex-shrink-0" />
          )}
        </div>
      </button>

      {audioFile && playingAudio === section.id && isExpanded && (
        <div className="px-5 pt-3">
          <audio
            src={audioFile.url}
            controls
            className="w-full"
            onEnded={() => onToggleAudioPlay(section.id)}
          />
        </div>
      )}

      {isExpanded && (
        <div className="p-5 space-y-4">
          {showAudioList && (
            <div className="mb-4 p-4 bg-card/50 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Áudios Salvos ({audioFiles.length})</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAudioList(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <AudioFilesList
                audioFiles={audioFiles}
                onDelete={deleteAudioFile}
              />
            </div>
          )}

          {section.items.map((item) => {
            const key = `${section.id}-${item.id}`;
            return (
              <ScriptItem
                key={item.id}
                item={item}
                darkMode={darkMode}
                isChecked={checkedItems[key] || false}
                onToggleCheck={() => onToggleCheck(section.id, item.id)}
                note={notes[key] || ''}
                onNoteChange={(value) => onNoteChange(section.id, item.id, value)}
                showNote={showNotes[key] || false}
                onToggleNote={() => onToggleNotes(section.id, item.id)}
              />
            );
          })}
        </div>
      )}

      <AudioUploadDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        sectionId={section.id}
        onUpload={handleUpload}
      />
    </div>
  );
};
