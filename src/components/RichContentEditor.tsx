import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import ResizeImage from 'tiptap-extension-resize-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered, Link as LinkIcon,
  Image as ImageIcon, Video, Heading2, Heading3, Quote, Undo, Redo,
  Baseline, Highlighter, AlignLeft, AlignCenter, AlignRight, AlignJustify,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const TEXT_COLORS = [
  { name: 'Padrão', value: null },
  { name: 'Vermelho', value: '#dc2626' },
  { name: 'Verde', value: '#16a34a' },
  { name: 'Azul', value: '#2563eb' },
  { name: 'Laranja', value: '#ea580c' },
  { name: 'Amarelo', value: '#ca8a04' },
  { name: 'Roxo', value: '#9333ea' },
  { name: 'Rosa', value: '#db2777' },
  { name: 'Cinza', value: '#6b7280' },
  { name: 'Preto', value: '#000000' },
];

const HIGHLIGHT_COLORS = [
  { name: 'Nenhum', value: null },
  { name: 'Amarelo', value: '#fef08a' },
  { name: 'Verde', value: '#bbf7d0' },
  { name: 'Azul', value: '#bfdbfe' },
  { name: 'Rosa', value: '#fbcfe8' },
  { name: 'Laranja', value: '#fed7aa' },
  { name: 'Roxo', value: '#e9d5ff' },
  { name: 'Cinza', value: '#e5e7eb' },
];

interface RichContentEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'webp', 'gif'];

const uploadImage = async (file: File): Promise<string | null> => {
  try {
    const ext = (file.name.split('.').pop() || 'png').toLowerCase();
    if (!IMAGE_EXTS.includes(ext)) {
      toast.error('Formato não suportado. Use PNG, JPG, JPEG, WEBP.');
      return null;
    }
    const path = `topics/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from('operadoras').upload(path, file, {
      contentType: file.type || `image/${ext}`,
      upsert: false,
    });
    if (error) throw error;
    const { data } = supabase.storage.from('operadoras').getPublicUrl(path);
    return data.publicUrl;
  } catch (e) {
    console.error('upload image error', e);
    toast.error('Erro ao enviar imagem');
    return null;
  }
};

// Converte URLs de YouTube/Loom em embeds
const getEmbedFromUrl = (url: string): { type: 'youtube' | 'loom'; embedUrl: string } | null => {
  // YouTube
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (yt) return { type: 'youtube', embedUrl: `https://www.youtube.com/embed/${yt[1]}` };
  // Loom
  const lm = url.match(/loom\.com\/(?:share|embed)\/([A-Za-z0-9]+)/);
  if (lm) return { type: 'loom', embedUrl: `https://www.loom.com/embed/${lm[1]}` };
  return null;
};

const insertLoomEmbed = (editor: Editor, embedUrl: string) => {
  editor
    .chain()
    .focus()
    .insertContent(
      `<div class="video-embed" data-loom="1"><iframe src="${embedUrl}" frameborder="0" allowfullscreen style="width:100%;aspect-ratio:16/9;border-radius:8px;"></iframe></div><p></p>`
    )
    .run();
};

const ToolbarButton = ({
  onClick, active, disabled, title, children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-1.5 rounded hover:bg-muted disabled:opacity-40 transition-colors ${
      active ? 'bg-accent/15 text-accent' : 'text-foreground/80'
    }`}
  >
    {children}
  </button>
);

export const RichContentEditor = ({ value, onChange, placeholder }: RichContentEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      // StarterKit v3 já inclui Link e Underline — configuramos aqui para não duplicar extensões.
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, HTMLAttributes: { class: 'text-accent underline' } },
      }),
      TextStyle,
      Color.configure({ types: ['textStyle'] }),
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      ResizeImage.configure({ inline: false, allowBase64: false }),
      Youtube.configure({ controls: true, nocookie: true, width: 640, height: 360, HTMLAttributes: { class: 'rounded-lg my-2' } }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'rich-editor max-w-none focus:outline-none min-h-[280px] px-4 py-3',
      },
      handlePaste: (view, event) => {
        // Imagem colada (Ctrl+V)
        const items = event.clipboardData?.items;
        if (items) {
          for (const item of Array.from(items)) {
            if (item.type.startsWith('image/')) {
              const file = item.getAsFile();
              if (file) {
                event.preventDefault();
                uploadImage(file).then((url) => {
                  if (url && editor) editor.chain().focus().setImage({ src: url }).run();
                });
                return true;
              }
            }
          }
        }
        // URL colada: YouTube / Loom → embed
        const text = event.clipboardData?.getData('text/plain')?.trim();
        if (text && /^https?:\/\//i.test(text) && !text.includes(' ')) {
          const embed = getEmbedFromUrl(text);
          if (embed && editor) {
            event.preventDefault();
            if (embed.type === 'youtube') {
              editor.commands.setYoutubeVideo({ src: text });
            } else {
              insertLoomEmbed(editor, embed.embedUrl);
            }
            return true;
          }
        }
        return false;
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
          const file = files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            uploadImage(file).then((url) => {
              if (url && editor) editor.chain().focus().setImage({ src: url }).run();
            });
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Atualiza conteúdo externo (ex: abrir dialog em outro tópico)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  const pickImage = useCallback(() => fileInputRef.current?.click(), []);

  const onFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !editor) return;
    const url = await uploadImage(file);
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const insertVideoPrompt = () => {
    if (!editor) return;
    const url = prompt('Cole o link do YouTube ou Loom:');
    if (!url) return;
    const embed = getEmbedFromUrl(url.trim());
    if (!embed) {
      toast.error('Link não reconhecido. Use YouTube ou Loom.');
      return;
    }
    if (embed.type === 'youtube') editor.commands.setYoutubeVideo({ src: url.trim() });
    else insertLoomEmbed(editor, embed.embedUrl);
  };

  const insertLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href;
    const url = prompt('URL do link:', prev || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  // Aplica alinhamento só ao trecho selecionado: se a seleção for parcial
  // dentro de um parágrafo, isola o trecho em seu próprio bloco antes de alinhar.
  const applyAlign = (align: 'left' | 'center' | 'right' | 'justify') => {
    if (!editor) return;
    const { state } = editor;
    const { empty, from, to, $from, $to } = state.selection;

    if (empty || $from.parent !== $to.parent || !$from.parent.isTextblock) {
      editor.chain().focus().setTextAlign(align).run();
      return;
    }

    const blockStart = $from.start();
    const blockEnd = $from.end();
    const splitAtEnd = to < blockEnd;
    const splitAtStart = from > blockStart;

    if (!splitAtEnd && !splitAtStart) {
      editor.chain().focus().setTextAlign(align).run();
      return;
    }

    let chain = editor.chain().focus();
    if (splitAtEnd) chain = chain.setTextSelection(to).splitBlock();
    if (splitAtStart) chain = chain.setTextSelection(from).splitBlock();
    const offset = splitAtStart ? 1 : 0;
    chain
      .setTextSelection({ from: from + offset, to: to + offset })
      .setTextAlign(align)
      .run();
  };

  if (!editor) return null;


  return (
    <div className="rounded-lg border border-border bg-background overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5 bg-muted/40">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Negrito (Ctrl+B)">
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Itálico">
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Riscado">
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Sublinhado (Ctrl+U)">
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Título">
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Subtítulo">
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Lista">
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Lista numerada">
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Citação">
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-border mx-1" />
        <ColorPicker editor={editor} />
        <HighlightPicker editor={editor} />
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Alinhar à esquerda">
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Centralizar">
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Alinhar à direita">
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="Justificar">
          <AlignJustify className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton onClick={insertLink} active={editor.isActive('link')} title="Link">
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={pickImage} title="Inserir imagem (também: colar Ctrl+V ou arrastar)">
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={insertVideoPrompt} title="Inserir vídeo (YouTube / Loom)">
          <Video className="w-4 h-4" />
        </ToolbarButton>
        <div className="flex-1" />
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Desfazer">
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Refazer">
          <Redo className="w-4 h-4" />
        </ToolbarButton>
        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/gif" hidden onChange={onFilePicked} />
      </div>
      <EditorContent editor={editor} />
      {(!value || value === '<p></p>') && placeholder && (
        <div className="pointer-events-none -mt-[280px] px-4 py-3 text-sm text-muted-foreground/60 relative">
          {placeholder}
        </div>
      )}
      <p className="text-[11px] text-muted-foreground border-t border-border px-3 py-1.5 bg-muted/20">
        Dica: cole prints com <kbd className="rounded bg-background border border-border px-1">Ctrl+V</kbd>, arraste imagens ou cole links do YouTube/Loom para incorporar.
      </p>
    </div>
  );
};

const ColorSwatch = ({ color, label, onClick, active }: { color: string | null; label: string; onClick: () => void; active?: boolean }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    title={label}
    className={`w-7 h-7 rounded border transition ${active ? 'ring-2 ring-accent' : 'border-border hover:scale-110'}`}
    style={{
      background: color ?? 'transparent',
      backgroundImage: color ? undefined : 'linear-gradient(45deg,#eee 25%,transparent 25%,transparent 75%,#eee 75%),linear-gradient(45deg,#eee 25%,transparent 25%,transparent 75%,#eee 75%)',
      backgroundSize: '8px 8px',
      backgroundPosition: '0 0,4px 4px',
    }}
  />
);

const ColorPicker = ({ editor }: { editor: Editor }) => {
  const current = (editor.getAttributes('textStyle').color as string | undefined) || null;
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          title="Cor do texto"
          className="p-1.5 rounded hover:bg-muted text-foreground/80 flex flex-col items-center gap-0.5"
        >
          <Baseline className="w-4 h-4" />
          <span className="block w-4 h-1 rounded-sm" style={{ background: current || '#dc2626' }} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="start">
        <p className="text-xs font-semibold mb-2 text-muted-foreground">Cor do texto</p>
        <div className="grid grid-cols-5 gap-1.5">
          {TEXT_COLORS.map((c) => (
            <ColorSwatch
              key={c.name}
              color={c.value}
              label={c.name}
              active={current === c.value}
              onClick={() => {
                if (c.value) editor.chain().focus().setColor(c.value).run();
                else editor.chain().focus().unsetColor().run();
                setOpen(false);
              }}
            />
          ))}
        </div>
        <label className="mt-3 flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
          <input
            type="color"
            value={current || '#000000'}
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            className="w-7 h-7 rounded cursor-pointer border border-border"
          />
          Cor personalizada
        </label>
      </PopoverContent>
    </Popover>
  );
};

const HighlightPicker = ({ editor }: { editor: Editor }) => {
  const current = (editor.getAttributes('highlight').color as string | undefined) || null;
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          title="Marca-texto"
          className={`p-1.5 rounded hover:bg-muted flex flex-col items-center gap-0.5 ${editor.isActive('highlight') ? 'bg-accent/15 text-accent' : 'text-foreground/80'}`}
        >
          <Highlighter className="w-4 h-4" />
          <span className="block w-4 h-1 rounded-sm" style={{ background: current || '#fef08a' }} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="start">
        <p className="text-xs font-semibold mb-2 text-muted-foreground">Marca-texto</p>
        <div className="grid grid-cols-5 gap-1.5">
          {HIGHLIGHT_COLORS.map((c) => (
            <ColorSwatch
              key={c.name}
              color={c.value}
              label={c.name}
              active={current === c.value}
              onClick={() => {
                if (c.value) editor.chain().focus().setHighlight({ color: c.value }).run();
                else editor.chain().focus().unsetHighlight().run();
                setOpen(false);
              }}
            />
          ))}
        </div>
        <label className="mt-3 flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
          <input
            type="color"
            value={current || '#fef08a'}
            onChange={(e) => editor.chain().focus().setHighlight({ color: e.target.value }).run()}
            className="w-7 h-7 rounded cursor-pointer border border-border"
          />
          Cor personalizada
        </label>
      </PopoverContent>
    </Popover>
  );
};
