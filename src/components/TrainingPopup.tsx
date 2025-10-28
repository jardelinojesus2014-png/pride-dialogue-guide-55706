import { X } from 'lucide-react';

interface TrainingPopupProps {
  onClose: () => void;
}

export const TrainingPopup = ({ onClose }: TrainingPopupProps) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in">
      <div className="relative bg-gradient-to-br from-green-500 via-purple-600 to-orange-600 rounded-3xl p-1 max-w-4xl w-full animate-scale-in shadow-2xl">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
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

          {/* Conteúdo */}
          <div className="relative z-10">
            <div className="mb-8">
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
            </div>

            <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-purple-500 to-orange-500 mb-8 leading-tight animate-slide-down">
              SÓ DEPENDE
              <br />
              DE VOCÊ!
            </h2>

            <div className="h-1 w-32 bg-gradient-to-r from-green-500 to-purple-600 mx-auto mb-8 rounded-full" />

            <div className="space-y-8 mb-12">
              <p className="text-3xl md:text-4xl font-bold text-white animate-slide-up">
                Isso te{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">
                  ASSUSTA
                </span>{' '}
                ou te{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-500">
                  MOTIVA
                </span>
                ?
              </p>

              <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
                <p className="text-2xl md:text-3xl font-bold text-white mb-4">
                  O que causa insegurança é{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                    falta de conhecimento!
                  </span>
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-500/20 via-purple-500/20 to-orange-500/20 rounded-2xl p-8 border-2 border-green-500/40">
                <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-500 mb-6">
                  Como resolver?
                </h3>
                <p className="text-2xl md:text-3xl font-bold text-white">
                  Estude e pratique...
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-purple-600 to-orange-500 rounded-2xl blur-xl opacity-50" />
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-10 border-2 border-white/20">
                  <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-purple-500 to-orange-500 mb-6">
                    O segredo é:
                  </h3>
                  <div className="space-y-3">
                    <p className="text-4xl md:text-5xl font-black text-white animate-[pulse_1s_ease-in-out]">
                      Treine..
                    </p>
                    <p className="text-4xl md:text-5xl font-black text-white/90 animate-[pulse_1s_ease-in-out_0.2s]">
                      Treine..
                    </p>
                    <p className="text-4xl md:text-5xl font-black text-white/80 animate-[pulse_1s_ease-in-out_0.4s]">
                      Treine...
                    </p>
                    <p className="text-4xl md:text-5xl font-black text-white/70 animate-[pulse_1s_ease-in-out_0.6s]">
                      Treine....
                    </p>
                    <p className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-purple-500 to-orange-500 animate-[pulse_1s_ease-in-out_0.8s]">
                      Treine...
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="bg-gradient-to-r from-green-500 via-purple-600 to-orange-600 hover:from-green-600 hover:via-purple-700 hover:to-orange-700 text-white font-black px-10 py-4 rounded-full text-xl shadow-2xl transition-all duration-300 hover:scale-110"
            >
              VAMOS TREINAR! 💪
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
