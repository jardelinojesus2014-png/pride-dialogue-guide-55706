import { ChevronDown, ChevronRight, Upload, Music, Edit, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { ScriptItem } from './ScriptItem';
import { ScriptItemEditor } from './ScriptItemEditor';
import { AudioUploadDialog } from './AudioUploadDialog';
import { AudioFilesList } from './AudioFilesList';
import { useUserAudioFiles } from '@/hooks/useUserAudioFiles';
import { useScriptItems, useUpdateScriptItem, useDeleteScriptItem } from '@/hooks/useScriptItems';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';

interface Section {
  id: string;
  title: string;
  subtitle: string;
  colorClass: string;
}

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
  userViewMode?: boolean;
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
  userViewMode = false,
}: ScriptSectionProps) => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showAudioList, setShowAudioList] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { audioFiles, uploadAudioFile, deleteAudioFile, loading } = useUserAudioFiles(section.id);
  const { data: items = [], isLoading } = useScriptItems(section.id);
  const updateItem = useUpdateScriptItem();
  const deleteItem = useDeleteScriptItem();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const effectiveIsAdmin = isAdmin && !userViewMode;

  const handleUpload = async (title: string, audioBlob: Blob, durationSeconds?: number) => {
    await uploadAudioFile(section.id, title, audioBlob, durationSeconds);
  };

  const handleMoveItem = (itemId: string, direction: 'up' | 'down') => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const newOrder = direction === 'up' ? item.display_order - 1.5 : item.display_order + 1.5;
    updateItem.mutate({ id: itemId, display_order: newOrder });
  };

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden border-2 border-border hover:shadow-xl hover:border-accent transition-all duration-300">
      <div className="w-full">
        <div
          className={`w-full p-5 flex items-center justify-between ${section.colorClass} border-l-4 border-accent transition-all hover:opacity-90 hover:border-l-8 cursor-pointer`}
        >
          <div className="text-left flex-1" onClick={onToggle}>
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

            {!adminLoading && effectiveIsAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditMode(!isEditMode);
                }}
                className={`${
                  isEditMode ? 'bg-destructive text-destructive-foreground' : 'bg-muted'
                } hover:opacity-80 p-2 rounded-lg transition-all duration-300 group relative`}
                title={isEditMode ? 'Sair da edição' : 'Editar seção'}
              >
                <Edit className="w-4 h-4" />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg">
                  {isEditMode ? 'Sair da Edição' : 'Editar Seção'}
                </span>
              </button>
            )}

            <div onClick={onToggle} className="cursor-pointer">
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
              ) : (
                <ChevronRight className="w-5 h-5 text-primary flex-shrink-0" />
              )}
            </div>
          </div>
        </div>
      </div>

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

          {isLoading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : (
            <>
              {items.map((item, index) => {
                const key = `${section.id}-${item.item_id}`;
                return isEditMode && effectiveIsAdmin ? (
                  <ScriptItemEditor
                    key={item.id}
                    item={item}
                    onUpdate={(updated) => updateItem.mutate(updated)}
                    onDelete={(id) => deleteItem.mutate(id)}
                    onMoveUp={() => handleMoveItem(item.id, 'up')}
                    onMoveDown={() => handleMoveItem(item.id, 'down')}
                    canMoveUp={index > 0}
                    canMoveDown={index < items.length - 1}
                  />
                ) : (
                  <ScriptItem
                    key={item.id}
                    item={item}
                    darkMode={darkMode}
                    isChecked={checkedItems[key] || false}
                    onToggleCheck={() => onToggleCheck(section.id, item.item_id)}
                    note={notes[key] || ''}
                    onNoteChange={(value) => onNoteChange(section.id, item.item_id, value)}
                    showNote={showNotes[key] || false}
                    onToggleNote={() => onToggleNotes(section.id, item.item_id)}
                  />
                );
              })}
            </>
          )}
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
