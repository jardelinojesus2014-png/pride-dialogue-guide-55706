import { CheckCircle2, StickyNote } from 'lucide-react';
import { ScriptItem as ScriptItemType } from '@/hooks/useScriptItems';

interface ScriptItemProps {
  item: ScriptItemType;
  darkMode: boolean;
  isChecked: boolean;
  onToggleCheck: () => void;
  note: string;
  onNoteChange: (value: string) => void;
  showNote: boolean;
  onToggleNote: () => void;
}

export const ScriptItem = ({
  item,
  darkMode,
  isChecked,
  onToggleCheck,
  note,
  onNoteChange,
  showNote,
  onToggleNote,
}: ScriptItemProps) => {
  return (
    <div className="border-l-2 border-border pl-4 py-2">
      <div className="flex items-start gap-3">
        <button onClick={onToggleCheck} className="mt-1 flex-shrink-0">
          <CheckCircle2
            className={`w-5 h-5 transition-all duration-300 ${
              isChecked ? 'text-green-500 fill-green-500' : 'text-muted-foreground'
            }`}
          />
        </button>
        <div className="flex-1">
          <h3 className="font-bold mb-2 text-primary">{item.label}</h3>

          <div className="flex gap-2 mb-3">
            <button
              onClick={onToggleNote}
              className={`${
                showNote ? 'bg-accent/20' : 'bg-muted hover:bg-muted/80'
              } p-2 rounded-lg transition-all duration-300 group relative`}
              title="Adicionar notas"
            >
              <StickyNote
                className={`w-4 h-4 ${showNote ? 'text-accent' : 'text-muted-foreground'}`}
              />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg">
                Notas
              </span>
            </button>
          </div>

          {showNote && (
            <div className="mb-3">
              <textarea
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
                placeholder="Adicione suas anotações aqui..."
                className="w-full p-3 rounded-lg border-2 border-accent/30 bg-accent/5 focus:border-accent focus:outline-none transition-colors text-sm text-foreground"
                rows={3}
              />
            </div>
          )}

          {/* Script Principal */}
          <div className="bg-muted/50 p-4 rounded-lg border border-border mb-2">
            <div className="text-foreground leading-relaxed space-y-3">
              {item.script.split('(aguardar)').map((part, idx, arr) => (
                <div key={idx}>
                  <p className="font-medium text-sm sm:text-base">{part.trim()}</p>
                  {idx < arr.length - 1 && (
                    <p className="text-xs italic text-muted-foreground pl-4 py-1">
                      ⏸️ Aguardar cliente responder
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Alternativas */}
          {item.alternatives && item.alternatives.length > 0 && item.alternatives.map((alternative, idx) => (
            <div key={idx} className="bg-blue-500/10 border-l-4 border-blue-500 p-3 rounded text-sm mb-2">
              <p className="text-foreground">
                <strong>Alternativa:</strong> {alternative}
              </p>
            </div>
          ))}

          {/* Dicas */}
          {item.tips && item.tips.length > 0 && item.tips.map((tip, idx) => (
            <div key={idx} className="bg-accent/10 border-l-4 border-accent p-3 rounded text-sm mb-2">
              <p className="text-foreground">
                💡 <strong>Dica:</strong> {tip}
              </p>
            </div>
          ))}

          {/* Warnings */}
          {item.warnings && item.warnings.length > 0 && item.warnings.map((warning, idx) => (
            <div key={idx} className="bg-red-50 dark:bg-red-950/20 border-2 border-red-500 dark:border-red-600 rounded-lg p-3 text-sm mb-2 text-red-900 dark:text-red-200">
              <p>
                ⚠️ <strong>Atenção/Cuidado:</strong> {warning}
              </p>
            </div>
          ))}

          {/* Informações a Coletar */}
          {item.collect && item.collect.length > 0 && (
            <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg text-sm">
              <p className="font-bold mb-2 flex items-center gap-2 text-green-700 dark:text-green-400">
                <span>📋</span> Informações a Coletar:
              </p>
              <ul className="space-y-1 text-foreground">
                {item.collect.map((info, idx) => (
                  <li key={idx} className="ml-4 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>{info}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
