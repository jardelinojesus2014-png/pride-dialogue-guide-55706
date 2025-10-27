import { useState } from 'react';
import { Moon, Sun, FileDown, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { GoldenRule } from '@/components/GoldenRule';
import { ScriptSections } from '@/components/ScriptSections';
import { DosDonts } from '@/components/DosDonts';
import { PodcastSection } from '@/components/PodcastSection';
import { VideoSection } from '@/components/VideoSection';
import { MotivationalPopup } from '@/components/MotivationalPopup';
import logoPride from '@/assets/Logo_Pride.png';

const Index = () => {
  const { signOut, user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [showMotivationalPopup, setShowMotivationalPopup] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const exportToPrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="min-h-screen bg-gradient-subtle p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="bg-gradient-hero rounded-lg shadow-xl p-6 sm:p-8 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <img src={logoPride} alt="Pride Consultoria" className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black text-accent">
                    PRIDE CONSULTORIA
                  </h1>
                  <p className="text-accent/80 font-semibold text-sm sm:text-base mt-1">
                    Roteiro de Prospecção SDR - Primeira Etapa da Venda
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={exportToPrint}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <FileDown className="w-5 h-5" />
                  <span className="hidden sm:inline">Exportar</span>
                </button>
                <button
                  onClick={toggleDarkMode}
                  className="bg-primary/10 hover:bg-primary/20 text-accent font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => signOut()}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            </div>
          </header>

          {/* Golden Rule */}
          <GoldenRule darkMode={darkMode} />

          {/* Script Sections */}
          <ScriptSections darkMode={darkMode} />

          {/* Do's and Don'ts */}
          <DosDonts darkMode={darkMode} />

          {/* Podcast Section */}
          <PodcastSection darkMode={darkMode} />

          {/* Video Section */}
          <VideoSection darkMode={darkMode} />

          {/* Botão Motivacional - Complemento da última seção */}
          <div className="mb-6 flex justify-center">
            <button
              onClick={() => setShowMotivationalPopup(true)}
              className="bg-gradient-to-r from-orange-500 via-red-600 to-purple-700 hover:from-orange-600 hover:via-red-700 hover:to-purple-800 text-white font-black px-8 py-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 text-sm sm:text-base animate-[pulse_3s_ease-in-out_infinite]"
              title="Mensagem motivacional"
            >
              🔥 Clique aqui em caso de insegurança ou medo
            </button>
          </div>

          {/* Footer */}
          <footer className="text-center py-6 text-muted-foreground">
            <p className="font-semibold">
              <span className="text-transparent bg-clip-text bg-gradient-accent font-black">
                PRIDE CONSULTORIA
              </span>{' '}
              - Excelência em Gestão de Planos de Saúde
            </p>
          </footer>

          {/* Popup Motivacional */}
          {showMotivationalPopup && <MotivationalPopup onClose={() => setShowMotivationalPopup(false)} />}
        </div>
      </div>
    </div>
  );
};

export default Index;
