import { useState } from 'react';
import { RichContentEditor } from '@/components/RichContentEditor';
import { RichContent } from '@/components/RichContent';

// ROTA TEMPORÁRIA DE TESTE — remover após validação do ciclo salvar/reabrir.
const EditorTest = () => {
  const [draft, setDraft] = useState('<p></p>');
  const [saved, setSaved] = useState('');
  const [editorKey, setEditorKey] = useState(0);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-lg font-bold">Teste do editor</h1>
        <RichContentEditor key={editorKey} value={draft} onChange={setDraft} />
        <div className="flex gap-2">
          <button id="btn-save" className="px-3 py-1 border rounded" onClick={() => setSaved(draft)}>
            Salvar
          </button>
          <button
            id="btn-reopen"
            className="px-3 py-1 border rounded"
            onClick={() => { setDraft(saved); setEditorKey((k) => k + 1); }}
          >
            Reabrir editor
          </button>
        </div>
        <pre id="saved-html" className="text-[10px] whitespace-pre-wrap break-all bg-muted p-2 rounded">{saved}</pre>
        <div id="saved-view" className="border border-border rounded-lg p-4">
          <RichContent content={saved} />
        </div>
      </div>
    </div>
  );
};

export default EditorTest;
