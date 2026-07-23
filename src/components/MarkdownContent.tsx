import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface MarkdownContentProps {
  content: string;
}

// ----- Plugin: cores nas palavras e caixas de destaque coloridas -----
// Palavras: {red}texto{/red}  {green}...{/green}  {blue}...{/blue}  {amber}...{/amber}
// Caixas:  linha começando com "> [!red] ..." (ou green/blue/amber)
const COLORS = ['red', 'green', 'blue', 'amber'];

const firstTextNode = (node: any): any => {
  if (node?.type === 'text') return node;
  if (node?.children) {
    for (const c of node.children) {
      const t = firstTextNode(c);
      if (t) return t;
    }
  }
  return null;
};

const splitColoredText = (value: string): any[] => {
  const re = /\{(red|green|blue|amber)\}([\s\S]+?)\{\/\1\}/g;
  const out: any[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(value))) {
    if (m.index > last) out.push({ type: 'text', value: value.slice(last, m.index) });
    out.push({
      type: 'emphasis',
      data: { hName: 'span', hProperties: { className: `md-${m[1]}` } },
      children: [{ type: 'text', value: m[2] }],
    });
    last = m.index + m[0].length;
  }
  if (out.length === 0) return [{ type: 'text', value }];
  if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
  return out;
};

const remarkPrideFormat = () => (tree: any) => {
  const walk = (node: any) => {
    // Caixa de destaque colorida
    if (node.type === 'blockquote') {
      const ft = firstTextNode(node);
      if (ft) {
        const m = /^\s*\[!(red|green|blue|amber)\]\s*/i.exec(ft.value);
        if (m) {
          ft.value = ft.value.slice(m[0].length);
          node.data = node.data || {};
          node.data.hProperties = {
            ...(node.data.hProperties || {}),
            className: `callout-${m[1].toLowerCase()}`,
          };
        }
      }
    }

    if (!node.children) return;
    const out: any[] = [];
    for (const child of node.children) {
      if (child.type === 'text' && COLORS.some((c) => child.value.includes(`{${c}}`))) {
        out.push(...splitColoredText(child.value));
      } else {
        walk(child);
        out.push(child);
      }
    }
    node.children = out;
  };
  walk(tree);
};

const CALLOUT: Record<string, { box: string; icon: string; Icon: typeof Info }> = {
  amber: { box: 'border-accent bg-accent/10 [&_p]:!text-foreground', icon: 'text-accent', Icon: AlertTriangle },
  red: { box: 'border-red-400 bg-red-50/70 dark:bg-red-950/25 [&_p]:!text-red-800 dark:[&_p]:!text-red-200', icon: 'text-red-500', Icon: AlertTriangle },
  green: { box: 'border-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/25 [&_p]:!text-emerald-800 dark:[&_p]:!text-emerald-200', icon: 'text-emerald-500', Icon: CheckCircle2 },
  blue: { box: 'border-blue-400 bg-blue-50/70 dark:bg-blue-950/25 [&_p]:!text-blue-800 dark:[&_p]:!text-blue-200', icon: 'text-blue-500', Icon: Info },
};

const SPAN_COLOR: Record<string, string> = {
  'md-red': 'text-red-600 dark:text-red-400 font-semibold',
  'md-green': 'text-emerald-600 dark:text-emerald-400 font-semibold',
  'md-blue': 'text-blue-600 dark:text-blue-400 font-semibold',
  'md-amber': 'text-amber-600 dark:text-amber-400 font-semibold',
};

/**
 * Renderiza texto em Markdown com o visual da plataforma.
 * Suporta caixas de destaque (>) em 4 cores e palavras coloridas.
 */
export const MarkdownContent = ({ content }: MarkdownContentProps) => {
  if (!content?.trim()) return null;

  return (
    <div className="text-[15px] leading-relaxed text-foreground/90 space-y-3">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkPrideFormat]}
        components={{
          p: ({ children }) => <p className="text-muted-foreground">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          span: ({ className, children }) => (
            <span className={SPAN_COLOR[className as string] || className}>{children}</span>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent font-medium underline underline-offset-2 hover:text-accent/80"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 text-muted-foreground">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          h1: ({ children }) => <h3 className="text-lg font-bold text-foreground mt-4">{children}</h3>,
          h2: ({ children }) => <h4 className="text-base font-bold text-foreground mt-3">{children}</h4>,
          h3: ({ children }) => <h5 className="text-sm font-bold text-foreground mt-2">{children}</h5>,
          blockquote: ({ className, children }) => {
            const key = (/callout-(red|green|blue|amber)/.exec((className as string) || '')?.[1] || 'amber');
            const c = CALLOUT[key];
            const Icon = c.Icon;
            return (
              <div className={`flex items-start gap-2.5 rounded-lg border-l-4 px-4 py-3 text-sm my-3 [&_p]:!m-0 ${c.box}`}>
                <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${c.icon}`} />
                <div className="min-w-0">{children}</div>
              </div>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-muted px-3 py-2 text-left font-semibold">{children}</th>
          ),
          td: ({ children }) => <td className="border border-border px-3 py-2">{children}</td>,
          code: ({ children }) => (
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">{children}</code>
          ),
          hr: () => <hr className="border-border my-4" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
