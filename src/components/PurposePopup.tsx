import { X } from 'lucide-react';

interface PurposePopupProps {
  onClose: () => void;
}

export const PurposePopup = ({ onClose }: PurposePopupProps) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in">
      <div className="relative bg-gradient-to-br from-orange-500 via-red-600 to-purple-700 rounded-3xl p-1 max-w-5xl w-full animate-scale-in shadow-2xl">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden max-h-[90vh] overflow-y-auto">
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
            {/* Título Principal */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-purple-500 mb-4 leading-tight animate-slide-down">
                ENCONTRE SEU PROPÓSITO
              </h2>
              <div className="h-1 w-40 bg-gradient-to-r from-orange-500 to-red-600 mx-auto rounded-full" />
            </div>

            {/* Seções de Perguntas */}
            <div className="space-y-8">
              {/* Seção 1: Qual o seu porquê? */}
              <div className="bg-white/5 backdrop-blur rounded-2xl p-6 md:p-8 border border-orange-500/30 hover:border-orange-500/60 transition-all">
                <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-6">
                  Qual o seu PORQUÊ?
                </h3>
                <p className="text-xl md:text-2xl text-white/90 italic font-semibold">
                  Qual seu objetivo... qual seu propósito... você sabe?
                </p>
              </div>

              {/* Seção 2: Por que aqui? */}
              <div className="bg-white/5 backdrop-blur rounded-2xl p-6 md:p-8 border border-red-500/30 hover:border-red-500/60 transition-all">
                <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500 mb-4">
                  Por que AQUI?
                </h3>
                <p className="text-lg md:text-xl text-white/70 italic mb-4">
                  (E não em qualquer outro lugar?)
                </p>
                <p className="text-xl md:text-2xl text-white font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">TEM</span> que fazer sentido{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500">(PRA VOCÊ)</span>
                </p>
              </div>

              {/* Seção 3: O que você precisa fazer? */}
              <div className="bg-white/5 backdrop-blur rounded-2xl p-6 md:p-8 border border-purple-500/30 hover:border-purple-500/60 transition-all">
                <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-orange-500 mb-6">
                  O que você precisa FAZER?
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <p className="text-lg md:text-xl text-white/90 italic flex-1">
                      O que está no seu controle?
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📈</span>
                    <p className="text-lg md:text-xl text-white/90 italic flex-1">
                      Em que você pode ser melhor?
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⭐</span>
                    <p className="text-lg md:text-xl text-white/90 italic flex-1">
                      Quais são seus pontos fortes (por que você?)
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎯</span>
                    <div className="flex-1 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-purple-500/20 rounded-xl p-4 border-2 border-orange-500/50">
                      <p className="text-xl md:text-2xl text-white font-bold leading-relaxed">
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
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-xl p-6 border border-orange-500/40">
                  <p className="text-2xl md:text-3xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-purple-500">
                    ENCONTRE/ DESCUBRA as suas respostas...
                  </p>
                </div>
              </div>
            </div>

            {/* Botão de Fechar */}
            <div className="mt-10 text-center">
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black px-10 py-4 rounded-full text-xl shadow-2xl transition-all duration-300 hover:scale-110"
              >
                VAMOS LÁ! 🚀
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
