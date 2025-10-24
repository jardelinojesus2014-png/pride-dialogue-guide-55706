import { Lightbulb, AlertTriangle } from 'lucide-react';

interface GoldenRuleProps {
  darkMode: boolean;
}

export const GoldenRule = ({ darkMode }: GoldenRuleProps) => {
  return (
    <div className="bg-gradient-accent rounded-xl shadow-xl p-1 mb-8">
      <div className="bg-card rounded-lg p-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="bg-gradient-hero rounded-full p-3 shadow-lg">
            <Lightbulb className="w-8 h-8 text-accent animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-hero">
              ⚡ REGRA DE OURO DA PROSPECÇÃO
            </h2>
            <p className="text-sm font-semibold text-muted-foreground">
              O norte para conduzir sua ligação com excelência
            </p>
          </div>
        </div>

        <div className="bg-accent/10 rounded-lg p-5 border-l-4 border-accent mb-4">
          <div className="mb-4">
            <div className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-full text-base sm:text-lg font-bold mb-3 shadow-lg">
              ⏱️ 30-40 segundos iniciais
            </div>
            <p className="text-lg sm:text-xl font-bold text-foreground">
              São <span className="text-accent-foreground bg-accent px-2 rounded">DECISIVOS</span> para o sucesso de toda a ligação
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div className="flex items-start gap-3 bg-card p-4 rounded-lg shadow-sm border-l-4 border-primary">
              <span className="text-2xl sm:text-3xl">🎭</span>
              <div>
                <h3 className="font-bold text-primary mb-1">Foco: CONEXÃO</h3>
                <p className="text-sm text-muted-foreground">
                  Descaracterize "call center". Traga pessoalidade e leveza.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-card p-4 rounded-lg shadow-sm border-l-4 border-accent">
              <span className="text-2xl sm:text-3xl">💬</span>
              <div>
                <h3 className="font-bold text-accent-foreground bg-accent px-2 rounded mb-1">RESPIRE!</h3>
                <p className="text-sm text-muted-foreground">
                  É um diálogo, não um monólogo robotizado.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary rounded-lg p-4 text-center shadow-lg">
          <p className="text-primary-foreground font-bold flex items-center justify-center gap-2 flex-wrap text-sm sm:text-base">
            <AlertTriangle className="w-5 h-5 animate-pulse flex-shrink-0" />
            <span>Esta orientação vale para TODAS as etapas do roteiro</span>
            <AlertTriangle className="w-5 h-5 animate-pulse flex-shrink-0" />
          </p>
        </div>
      </div>
    </div>
  );
};
