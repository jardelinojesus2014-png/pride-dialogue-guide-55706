import { CheckCircle2, XCircle } from 'lucide-react';

interface DosDontsProps {
  darkMode: boolean;
}

const dos = [
  'Foque em Situação e Problema (S e P do SPIN)',
  'Use as perguntas "link" pra transição natural',
  'Seja empático ao perguntar sobre saúde',
  'Firme o compromisso do cliente',
];

const donts = [
  'Fazer um interrogatório (é um diálogo, precisa ser "leve")',
  'Perguntas repetitivas (atenha-se ao que o cliente está falando)',
  'Esquecer que uma etapa se conecta à outra (a ordem importa)',
  'Ir direto pra qualificação sem permissão',
  'Deixar o agendamento "solto" sem compromisso',
  'Esquecer de confirmar o decisor',
];

export const DosDonts = ({ darkMode }: DosDontsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      {/* FAÇA */}
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/20 p-5">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-5 h-5" /> Faça
        </h3>
        <ul className="space-y-2.5 text-sm text-foreground/80">
          {dos.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="text-emerald-500 mt-0.5 flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
          <li className="flex items-start gap-2.5 rounded-lg bg-emerald-100/70 dark:bg-emerald-900/30 p-3 mt-1">
            <span className="flex-shrink-0">🎯</span>
            <span className="font-semibold text-foreground">Lembre-se: esta é a PRIMEIRA ETAPA da venda!</span>
          </li>
        </ul>
      </div>

      {/* EVITE */}
      <div className="rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/20 p-5">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-600 dark:text-red-400">
          <XCircle className="w-5 h-5" /> Evite
        </h3>
        <ul className="space-y-2.5 text-sm text-foreground/80">
          {donts.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
