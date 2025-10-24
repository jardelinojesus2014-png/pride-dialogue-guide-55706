import { X } from 'lucide-react';

interface MotivationalPopupProps {
  onClose: () => void;
}

export const MotivationalPopup = ({ onClose }: MotivationalPopupProps) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in">
      {/* Conteúdo do Pop-up */}
      <div className="relative bg-gradient-to-br from-orange-500 via-red-600 to-purple-700 rounded-3xl p-1 max-w-4xl w-full animate-scale-in shadow-2xl">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
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

          {/* Conteúdo */}
          <div className="relative z-10">
            <div className="mb-8">
              <div className="inline-block bg-gradient-to-r from-orange-500 to-red-600 rounded-full p-4 mb-6 shadow-2xl animate-bounce">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-purple-500 mb-6 leading-tight animate-slide-down">
              VAI COM MEDO
              <br />
              MESMO!
            </h2>

            <div className="h-1 w-32 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mb-8 rounded-full" />

            <p className="text-3xl md:text-4xl font-bold text-white mb-8 animate-slide-up">
              Ninguém é bom naquilo
              <br />
              que faz{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                POUCO!
              </span>
            </p>

            <div className="grid md:grid-cols-3 gap-4 mt-12 text-left">
              <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10 hover:border-orange-500/50 transition-all">
                <div className="text-3xl mb-2">🔥</div>
                <p className="text-white/80 text-sm">A prática leva à perfeição</p>
              </div>
              <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10 hover:border-red-500/50 transition-all">
                <div className="text-3xl mb-2">💪</div>
                <p className="text-white/80 text-sm">Cada ligação te torna mais forte</p>
              </div>
              <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10 hover:border-purple-500/50 transition-all">
                <div className="text-3xl mb-2">🚀</div>
                <p className="text-white/80 text-sm">O medo é temporário, o arrependimento é eterno</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black px-8 py-4 rounded-full text-xl shadow-2xl transition-all duration-300 hover:scale-110"
            >
              BORA PRA CIMA! 🔥
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
