import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface TrainingPopupProps {
  onClose: () => void;
}

export const TrainingPopup = ({ onClose }: TrainingPopupProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Auto avançar entre os slides
    if (currentStep < 4) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 3500); // Muda a cada 3.5 segundos

      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const slides = [
    // Slide 1: SÓ DEPENDE DE VOCÊ
    {
      content: (
        <div className="text-center space-y-8 animate-fade-in">
          <div className="inline-block bg-gradient-to-r from-green-500 to-purple-600 rounded-full p-4 mb-6 shadow-2xl animate-bounce">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-purple-500 to-orange-500 leading-tight">
            SÓ DEPENDE
            <br />
            DE VOCÊ!
          </h2>

          <div className="h-1 w-32 bg-gradient-to-r from-green-500 to-purple-600 mx-auto rounded-full" />
        </div>
      )
    },
    // Slide 2: Assusta ou motiva?
    {
      content: (
        <div className="text-center space-y-8 animate-fade-in">
          <p className="text-4xl md:text-5xl font-black text-white">
            Isso te{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 animate-pulse">
              ASSUSTA
            </span>
          </p>
          <p className="text-3xl md:text-4xl font-bold text-white/80">
            ou te
          </p>
          <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-500 animate-pulse">
            MOTIVA?
          </p>
        </div>
      )
    },
    // Slide 3: Falta de conhecimento
    {
      content: (
        <div className="text-center space-y-8 animate-fade-in">
          <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
            <p className="text-2xl md:text-3xl font-bold text-white mb-4">
              O que causa insegurança é
            </p>
            <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              falta de conhecimento!
            </p>
          </div>
        </div>
      )
    },
    // Slide 4: Como resolver?
    {
      content: (
        <div className="text-center space-y-8 animate-fade-in">
          <div className="bg-gradient-to-r from-green-500/20 via-purple-500/20 to-orange-500/20 rounded-2xl p-8 border-2 border-green-500/40">
            <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-500 mb-6">
              Como resolver?
            </h3>
            <p className="text-3xl md:text-4xl font-bold text-white">
              Estude e pratique...
            </p>
          </div>
        </div>
      )
    },
    // Slide 5: TREINE (fica pulsando)
    {
      content: (
        <div className="text-center space-y-8 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-purple-600 to-orange-500 rounded-2xl blur-2xl opacity-60 animate-pulse" />
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-10 border-2 border-white/20">
              <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-purple-500 to-orange-500 mb-8">
                O segredo é:
              </h3>
              <div className="space-y-6">
                {[...Array(5)].map((_, index) => (
                  <p
                    key={index}
                    className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-purple-500 to-orange-500 animate-pulse"
                    style={{
                      animationDelay: `${index * 0.2}s`,
                      animationDuration: '1.5s'
                    }}
                  >
                    TREINE{'.'.repeat(index + 1)}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="bg-gradient-to-r from-green-500 via-purple-600 to-orange-600 hover:from-green-600 hover:via-purple-700 hover:to-orange-700 text-white font-black px-10 py-4 rounded-full text-xl shadow-2xl transition-all duration-300 hover:scale-110 animate-bounce mt-8"
          >
            VAMOS TREINAR! 💪
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in">
      <div className="relative bg-gradient-to-br from-green-500 via-purple-600 to-orange-600 rounded-3xl p-1 max-w-4xl w-full animate-scale-in shadow-2xl">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden min-h-[500px] flex items-center justify-center">
          {/* Efeitos de fundo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-green-500 rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: '1s' }}
            />
            <div
              className="absolute top-1/2 left-1/2 w-48 h-48 bg-orange-500 rounded-full blur-3xl animate-pulse"
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
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'w-8 bg-gradient-to-r from-green-500 to-purple-600'
                      : index < currentStep
                      ? 'w-2 bg-white/40'
                      : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Conteúdo dos Slides */}
          <div className="relative z-10 w-full">
            {slides[currentStep].content}
          </div>
        </div>
      </div>
    </div>
  );
};
