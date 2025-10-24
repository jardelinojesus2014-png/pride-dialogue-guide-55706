interface DosDontsProps {
  darkMode: boolean;
}

export const DosDonts = ({ darkMode }: DosDontsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white border-2 border-accent overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="transform translate-x-8 translate-y-8"
          >
            <defs>
              <filter id="shadow-check">
                <feDropShadow dx="4" dy="4" stdDeviation="3" floodOpacity="0.5" />
              </filter>
            </defs>
            <circle cx="100" cy="100" r="80" fill="currentColor" opacity="0.3" filter="url(#shadow-check)" />
            <path
              d="M 60 100 L 85 125 L 140 70"
              stroke="currentColor"
              strokeWidth="15"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#shadow-check)"
            />
          </svg>
        </div>

        <h3 className="font-bold text-2xl mb-4 flex items-center gap-2 relative z-10">
          <span className="text-3xl">✅</span> FAÇA
        </h3>
        <ul className="space-y-3 text-sm relative z-10">
          <li className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span>Foque em Situação e Problema (S e P do SPIN)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span>Use as perguntas "link" pra transição natural</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span>Seja empático ao perguntar sobre saúde</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span>Firme o compromisso do cliente</span>
          </li>
          <li className="flex items-start gap-2 bg-white/20 p-2 rounded border-l-4 border-white">
            <span className="font-bold">🎯</span>
            <span>
              <strong>Lembre-se: esta é a PRIMEIRA ETAPA da VENDA!</strong>
            </span>
          </li>
        </ul>
      </div>

      <div className="relative bg-gradient-to-br from-red-600 to-red-700 rounded-lg shadow-lg p-6 text-white border-2 border-accent overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="transform translate-x-8 translate-y-8"
          >
            <defs>
              <filter id="shadow-x">
                <feDropShadow dx="4" dy="4" stdDeviation="3" floodOpacity="0.5" />
              </filter>
            </defs>
            <circle cx="100" cy="100" r="80" fill="currentColor" opacity="0.3" filter="url(#shadow-x)" />
            <path
              d="M 65 65 L 135 135 M 135 65 L 65 135"
              stroke="currentColor"
              strokeWidth="15"
              strokeLinecap="round"
              filter="url(#shadow-x)"
            />
          </svg>
        </div>

        <h3 className="font-bold text-2xl mb-4 flex items-center gap-2 relative z-10">
          <span className="text-3xl">❌</span> EVITE
        </h3>
        <ul className="space-y-3 text-sm relative z-10">
          <li className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span>Fazer um interrogatório (é um diálogo, precisa ser "leve")</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span>Perguntas repetitivas (atende-se ao que o cliente está falando)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span>Lembre-se que uma etapa se conecta a outra (a ordem dos fatores importa)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span>Ir direto pra qualificação sem permissão</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span>Deixar o agendamento "solto" sem compromisso</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <span>Esquecer de confirmar o decisor</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
