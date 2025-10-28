import { useState } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

interface PurposePopupProps {
  onClose: () => void;
}

export const PurposePopup = ({ onClose }: PurposePopupProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    // Etapa 0: Introdução
    {
      type: 'intro',
      content: (
        <div className="text-center space-y-8 animate-fade-in">
          <div className="inline-block bg-gradient-to-r from-orange-500 to-red-600 rounded-full p-4 mb-6 shadow-2xl animate-bounce">
            <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-purple-500 mb-6 leading-tight">
            Vamos refletir juntos?
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 font-semibold">
            Esta é uma jornada de <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 font-black">autodescoberta</span>.
          </p>
          
          <p className="text-lg md:text-xl text-white/70">
            Você terá algumas perguntas importantes para responder...
            <br />
            Não precisa responder agora, apenas <span className="text-white font-bold">reflita</span>.
          </p>
        </div>
      ),
    },
    // Etapa 1: Qual o seu porquê?
    {
      type: 'question',
      emoji: '💭',
      title: 'Qual o seu PORQUÊ?',
      gradient: 'from-orange-400 to-red-500',
      border: 'border-orange-500/50',
      content: (
        <div className="space-y-6 animate-fade-in">
          <p className="text-2xl md:text-3xl text-white font-bold text-center italic leading-relaxed">
            Qual seu objetivo...
            <br />
            qual seu propósito...
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 font-black text-3xl md:text-4xl not-italic">
              você sabe?
            </span>
          </p>
          
          <div className="bg-white/5 rounded-xl p-6 mt-8">
            <p className="text-white/60 text-sm md:text-base italic text-center">
              Tire um momento para pensar... O que realmente te move?
            </p>
          </div>
        </div>
      ),
    },
    // Etapa 2: Por que aqui?
    {
      type: 'question',
      emoji: '🤔',
      title: 'Por que AQUI?',
      subtitle: '(E não em qualquer outro lugar?)',
      gradient: 'from-red-500 to-purple-500',
      border: 'border-red-500/50',
      content: (
        <div className="space-y-6 animate-fade-in">
          <p className="text-2xl md:text-3xl text-white font-bold text-center leading-relaxed">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 font-black">
              TEM
            </span>{' '}
            que fazer sentido
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500 font-black text-3xl md:text-4xl">
              (PRA VOCÊ)
            </span>
          </p>
          
          <div className="bg-white/5 rounded-xl p-6 mt-8">
            <p className="text-white/60 text-sm md:text-base italic text-center">
              Sua escolha precisa estar alinhada com quem você é e onde quer chegar.
            </p>
          </div>
        </div>
      ),
    },
    // Etapa 3: O que está no seu controle?
    {
      type: 'question',
      emoji: '💡',
      title: 'O que está no SEU CONTROLE?',
      gradient: 'from-purple-500 to-orange-500',
      border: 'border-purple-500/50',
      content: (
        <div className="space-y-6 animate-fade-in">
          <p className="text-xl md:text-2xl text-white/90 text-center leading-relaxed">
            Foque no que você <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-500 font-black">PODE</span> mudar.
            <br />
            O resto é apenas ruído.
          </p>
          
          <div className="bg-white/5 rounded-xl p-6 mt-8">
            <p className="text-white/60 text-sm md:text-base italic text-center">
              Seu poder está nas suas ações, não nas circunstâncias.
            </p>
          </div>
        </div>
      ),
    },
    // Etapa 4: Em que você pode ser melhor?
    {
      type: 'question',
      emoji: '📈',
      title: 'Em que você pode ser MELHOR?',
      gradient: 'from-orange-500 to-purple-500',
      border: 'border-orange-500/50',
      content: (
        <div className="space-y-6 animate-fade-in">
          <p className="text-xl md:text-2xl text-white/90 text-center leading-relaxed">
            Sempre há espaço para <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500 font-black">crescimento</span>.
            <br />
            Onde você quer evoluir?
          </p>
          
          <div className="bg-white/5 rounded-xl p-6 mt-8">
            <p className="text-white/60 text-sm md:text-base italic text-center">
              A excelência é uma jornada, não um destino.
            </p>
          </div>
        </div>
      ),
    },
    // Etapa 5: Seus pontos fortes
    {
      type: 'question',
      emoji: '⭐',
      title: 'Por que VOCÊ?',
      gradient: 'from-red-500 to-orange-500',
      border: 'border-red-500/50',
      content: (
        <div className="space-y-6 animate-fade-in">
          <p className="text-xl md:text-2xl text-white/90 text-center leading-relaxed">
            Quais são seus <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 font-black">pontos fortes</span>?
            <br />
            O que te torna único?
          </p>
          
          <div className="bg-white/5 rounded-xl p-6 mt-8">
            <p className="text-white/60 text-sm md:text-base italic text-center">
              Seus diferenciais são suas maiores armas.
            </p>
          </div>
        </div>
      ),
    },
    // Etapa 6: O que você precisa fazer HOJE?
    {
      type: 'question',
      emoji: '🎯',
      title: 'O que você precisa fazer HOJE?',
      gradient: 'from-purple-500 to-red-500',
      border: 'border-purple-500/50',
      highlight: true,
      content: (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-orange-500/20 via-red-500/20 to-purple-500/20 rounded-xl p-6 border-2 border-orange-500/50">
            <p className="text-xl md:text-2xl text-white font-bold leading-relaxed text-center">
              Em que você precisa evoluir? ou seja... o que você{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 font-black text-2xl md:text-3xl">
                PRECISA
              </span>{' '}
              fazer{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500 font-black text-2xl md:text-3xl">
                HOJE
              </span>{' '}
              pra conseguir (ou se aproximar mais) de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-500 font-black text-2xl md:text-3xl">
                CONQUISTAR
              </span>{' '}
              seu propósito/ sonhos/ objetivos?
            </p>
          </div>
          
          <div className="bg-white/5 rounded-xl p-6 mt-8">
            <p className="text-white/60 text-sm md:text-base italic text-center">
              O futuro é construído no presente. Cada ação importa.
            </p>
          </div>
        </div>
      ),
    },
    // Etapa 7: Conclusão com botão para seção
    {
      type: 'conclusion',
      content: (
        <div className="text-center space-y-8 animate-fade-in">
          <div className="inline-block bg-gradient-to-r from-purple-500 to-orange-500 rounded-full p-4 mb-6 shadow-2xl">
            <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-purple-500 mb-6 leading-tight">
            ENCONTRE/<br />DESCUBRA
          </h2>
          
          <p className="text-2xl md:text-3xl text-white font-bold">
            as suas <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500">respostas</span>...
          </p>
          
          <div className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-xl p-8 border-2 border-orange-500/40 mt-8">
            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6">
              Essas respostas estão dentro de você.
              <br />
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-purple-500">
                Só você pode encontrá-las.
              </span>
            </p>
            
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black px-8 py-4 rounded-full text-xl shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-2 mx-auto"
            >
              Ir para Minhas Reflexões 📝
            </button>
            
            <p className="text-white/60 text-sm mt-4">
              Você pode registrar suas respostas na aba "Materiais Adicionais"
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const goNext = () => {
    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goPrevious = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in">
      <div className="relative bg-gradient-to-br from-orange-500 via-red-600 to-purple-700 rounded-3xl p-1 max-w-4xl w-full animate-scale-in shadow-2xl">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          {/* Efeitos de fundo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500 rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-10 right-10 w-40 h-40 bg-red-500 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: '1s' }}
            />
            <div
              className="absolute top-1/2 left-1/2 w-48 h-48 bg-purple-500 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: '2s' }}
            />
          </div>

          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Indicador de Progresso */}
          <div className="relative z-10 mb-8">
            <div className="flex items-center justify-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'w-12 bg-gradient-to-r from-orange-500 to-red-600'
                      : index < currentStep
                      ? 'w-2 bg-white/40'
                      : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>
            <p className="text-white/40 text-center mt-3 text-sm">
              {currentStep + 1} de {steps.length}
            </p>
          </div>

          {/* Conteúdo da Etapa Atual */}
          <div className="relative z-10 min-h-[400px] flex flex-col justify-between">
            {/* Cabeçalho da Pergunta (se não for intro ou conclusão) */}
            {currentStepData.type === 'question' && (
              <div className="text-center mb-8">
                <div className="text-6xl mb-4 animate-bounce">{currentStepData.emoji}</div>
                <h2 className={`text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${currentStepData.gradient} mb-3 leading-tight`}>
                  {currentStepData.title}
                </h2>
                {currentStepData.subtitle && (
                  <p className="text-lg md:text-xl text-white/70 italic">{currentStepData.subtitle}</p>
                )}
                <div className="h-1 w-32 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mt-4 rounded-full" />
              </div>
            )}

            {/* Conteúdo */}
            <div className="flex-1 flex items-center justify-center">
              {currentStepData.content}
            </div>

            {/* Navegação */}
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-white/10">
              <button
                onClick={goPrevious}
                disabled={isFirstStep}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                  isFirstStep
                    ? 'opacity-30 cursor-not-allowed bg-white/5'
                    : 'bg-white/10 hover:bg-white/20 text-white hover:scale-105'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              <button
                onClick={isLastStep ? onClose : goNext}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black px-8 py-4 rounded-full shadow-xl transition-all duration-300 hover:scale-105"
              >
                <span>{isLastStep ? 'Fechar' : (isFirstStep ? 'Começar' : 'Próxima')}</span>
                {!isLastStep && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
