const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="rounded bg-background px-1 py-0.5 text-[11px] font-mono border border-border">{children}</code>
);

/** Guia rápido de formatação (Markdown) mostrado nos editores de tópico. */
export const FormattingHelp = () => (
  <details className="mt-2 text-xs text-muted-foreground group">
    <summary className="cursor-pointer select-none hover:text-foreground font-medium">
      ✏️ Como formatar (negrito, cores, links...)
    </summary>
    <div className="mt-2 space-y-1.5 rounded-lg border border-border bg-muted/40 p-3">
      <p><Code>**negrito**</Code> · <Code>*itálico*</Code> · <Code>~~riscado~~</Code></p>
      <p>Lista: <Code>- item</Code> (uma por linha) · Numerada: <Code>1. item</Code></p>
      <p>Link: <Code>[texto](https://site.com)</Code></p>
      <p>Subtítulo: <Code>## Título</Code></p>
      <p>Caixa de destaque (âmbar): <Code>&gt; texto</Code></p>
      <p>
        Caixas coloridas: <Code>&gt; [!red] ...</Code> <Code>[!green]</Code> <Code>[!blue]</Code> <Code>[!amber]</Code>
      </p>
      <p>
        Palavra colorida: <Code>{'{red}texto{/red}'}</Code> — também <Code>green</Code>, <Code>blue</Code>, <Code>amber</Code>
      </p>
      <p className="text-muted-foreground/70">Dica: deixe uma linha em branco entre dois destaques para separá-los.</p>
    </div>
  </details>
);
