import { Lightbulb, AlertTriangle } from 'lucide-react';

interface GoldenRuleProps {
  darkMode: boolean;
}

export const GoldenRule = ({ darkMode }: GoldenRuleProps) => {
  return (
    <div className="bg-card rounded-2xl border-2 border-accent/40 shadow-md p-6 mb-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-primary">Regra de ouro da prospecção</h2>
          <p className="text-sm text-muted-foreground">O norte para conduzir sua ligação com excelência</p>
        </div>
      </div>

      <div className="rounded-xl border-l-4 border-accent bg-accent/10 p-5 mb-4">
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold bg-primary text-primary-foreground px-3 py-1 rounded-full whitespace-nowrap">
            ⏱️ 30–40 segundos iniciais
          </span>
          <p className="text-base font-semibold text-foreground">
            são <span className="text-accent">decisivos</span> para toda a ligação.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-3 bg-card rounded-xl border border-border p-4">
            <span className="text-2xl">🎭</span>
            <div>
              <h3 className="font-bold text-primary text-sm mb-0.5">Foco: conexão</h3>
              <p className="text-sm text-muted-foreground">
                Descaracterize "call center". Traga pessoalidade e leveza.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-card rounded-xl border border-border p-4">
            <span className="text-2xl">💬</span>
            <div>
              <h3 className="font-bold text-accent text-sm mb-0.5">Respire!</h3>
              <p className="text-sm text-muted-foreground">
                É um diálogo, não um monólogo robotizado.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2.5 rounded-xl border-2 border-red-300 dark:border-red-800/70 bg-red-100/80 dark:bg-red-950/40 shadow-sm p-3.5">
        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
        <span className="text-sm font-bold text-red-800 dark:text-red-200 text-center">
          Esta orientação vale para <strong className="font-extrabold uppercase">todas</strong> as etapas do roteiro.
        </span>
        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
      </div>
    </div>
  );
};
