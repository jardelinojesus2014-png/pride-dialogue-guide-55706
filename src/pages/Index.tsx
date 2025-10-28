import { useState } from 'react';
import { Moon, Sun, FileDown, LogOut, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useNavigate } from 'react-router-dom';
import { GoldenRule } from '@/components/GoldenRule';
import { ScriptSections } from '@/components/ScriptSections';
import { DosDonts } from '@/components/DosDonts';
import { AdminAudioSection } from '@/components/AdminAudioSection';
import { VideoSection } from '@/components/VideoSection';
import { FluxoAudioSection } from '@/components/FluxoAudioSection';
import { FluxoVideoSection } from '@/components/FluxoVideoSection';
import { QualificationInfoSection } from '@/components/QualificationInfoSection';
import { InstitutionalSection } from '@/components/InstitutionalSection';
import { MissionVisionValuesSection } from '@/components/MissionVisionValuesSection';
import { WebsiteSection } from '@/components/WebsiteSection';
import { GoogleReviewsSection } from '@/components/GoogleReviewsSection';
import { MotivationalPopup } from '@/components/MotivationalPopup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import logoPride from '@/assets/Logo_Pride.png';
import logoPrideGold from '@/assets/Logo_Pride-2.png';

const Index = () => {
  const { signOut, user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [userViewMode, setUserViewMode] = useState(false);
  const [showMotivationalPopup, setShowMotivationalPopup] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleUserViewMode = () => {
    setUserViewMode(!userViewMode);
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
                {isAdmin && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg"
                    title="Painel Admin"
                  >
                    <Shield className="w-5 h-5" />
                    <span className="hidden sm:inline">Admin</span>
                  </button>
                )}
                <button
                  onClick={exportToPrint}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <FileDown className="w-5 h-5" />
                  <span className="hidden sm:inline">Exportar</span>
                </button>
                {isAdmin && (
                  <button
                    onClick={toggleUserViewMode}
                    className={`${
                      userViewMode 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-primary/10 hover:bg-primary/20 text-accent'
                    } font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg`}
                    title={userViewMode ? 'Modo Admin' : 'Visualizar como Usuário'}
                  >
                    {userViewMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                )}
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

          {/* Tabs Navigation */}
          <Tabs defaultValue="prospeccao" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-6 h-auto p-2 bg-gradient-hero rounded-lg">
              <TabsTrigger 
                value="prospeccao" 
                className="text-base sm:text-lg font-black py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=inactive]:text-accent/70 rounded-lg transition-all"
              >
                Roteiro de Prospecção SDR
              </TabsTrigger>
              <TabsTrigger 
                value="fluxo" 
                className="text-base sm:text-lg font-black py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=inactive]:text-accent/70 rounded-lg transition-all"
              >
                Materiais Adicionais
              </TabsTrigger>
              <TabsTrigger 
                value="pride" 
                className="text-base sm:text-lg font-black py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=inactive]:text-accent/70 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <img src={logoPrideGold} alt="Pride" className="w-8 h-8 object-contain" />
                <span className="hidden sm:inline">Conheça a Pride Corretora</span>
                <span className="sm:hidden">Pride</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prospeccao" className="mt-0">
              {/* Golden Rule */}
              <GoldenRule darkMode={darkMode} />

              {/* Script Sections */}
              <ScriptSections darkMode={darkMode} />

              {/* Do's and Don'ts */}
              <DosDonts darkMode={darkMode} />

              {/* Admin Audio Section */}
              <AdminAudioSection darkMode={darkMode} userViewMode={userViewMode} />

              {/* Video Section */}
              <VideoSection darkMode={darkMode} userViewMode={userViewMode} />

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
            </TabsContent>

            <TabsContent value="pride" className="mt-0">
              <Accordion type="multiple" className="w-full space-y-4">
                <AccordionItem value="website" className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl shadow-lg border-4 border-yellow-400 overflow-hidden">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-white/50 dark:hover:bg-black/20 transition-colors">
                    <h2 className="text-xl font-black text-blue-900 dark:text-blue-100">🌐 Site Pride Corretora</h2>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    <WebsiteSection darkMode={darkMode} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="reviews" className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 rounded-xl shadow-lg border-4 border-blue-400 overflow-hidden">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-white/50 dark:hover:bg-black/20 transition-colors">
                    <h2 className="text-xl font-black text-yellow-900 dark:text-yellow-100">⭐ Avaliações do Google</h2>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    <GoogleReviewsSection darkMode={darkMode} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="institutional" className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-xl shadow-lg border-4 border-pink-400 overflow-hidden">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-white/50 dark:hover:bg-black/20 transition-colors">
                    <h2 className="text-xl font-black text-purple-900 dark:text-purple-100">🎥 Vídeo Institucional</h2>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    <InstitutionalSection darkMode={darkMode} userViewMode={userViewMode} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="mission" className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-xl shadow-lg border-4 border-emerald-400 overflow-hidden">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-white/50 dark:hover:bg-black/20 transition-colors">
                    <h2 className="text-xl font-black text-green-900 dark:text-green-100">🎯 Missão, Visão e Valores</h2>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    <MissionVisionValuesSection darkMode={darkMode} userViewMode={userViewMode} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="fluxo" className="mt-0">
              <Accordion type="multiple" className="w-full space-y-4">
                <AccordionItem value="qualification" className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-xl shadow-lg border-4 border-red-400 overflow-hidden">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-white/50 dark:hover:bg-black/20 transition-colors">
                    <h2 className="text-xl font-black text-orange-900 dark:text-orange-100">📋 Informações de Qualificação</h2>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    <QualificationInfoSection darkMode={darkMode} userViewMode={userViewMode} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="audio" className="bg-gradient-to-r from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900 rounded-xl shadow-lg border-4 border-blue-400 overflow-hidden">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-white/50 dark:hover:bg-black/20 transition-colors">
                    <h2 className="text-xl font-black text-cyan-900 dark:text-cyan-100">🎧 Áudios do Fluxo</h2>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    <FluxoAudioSection darkMode={darkMode} userViewMode={userViewMode} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="video" className="bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 rounded-xl shadow-lg border-4 border-purple-400 overflow-hidden">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-white/50 dark:hover:bg-black/20 transition-colors">
                    <h2 className="text-xl font-black text-pink-900 dark:text-pink-100">🎬 Vídeos do Fluxo</h2>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    <FluxoVideoSection darkMode={darkMode} userViewMode={userViewMode} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>

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
