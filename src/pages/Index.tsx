import { useState } from 'react';
import { Moon, Sun, LogOut, Shield, Eye, EyeOff, Star, ClipboardList, BookOpen, Workflow, ChevronUp, GraduationCap, Palette } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useSectionTitles } from '@/hooks/useSectionTitles';
import { useNavigate } from 'react-router-dom';
import { HowToUseVideoDialog } from '@/components/HowToUseVideoDialog';
import { GoldenRule } from '@/components/GoldenRule';
import { ScriptSections } from '@/components/ScriptSections';
import { CadenciaSections } from '@/components/CadenciaSections';
import { DosDonts } from '@/components/DosDonts';
import { AdminAudioSection } from '@/components/AdminAudioSection';
import { VideoSection } from '@/components/VideoSection';
import { FluxoAudioSection } from '@/components/FluxoAudioSection';
import { FluxoVideoSection } from '@/components/FluxoVideoSection';
import { PdfSection } from '@/components/PdfSection';
import { QualificationInfoSection } from '@/components/QualificationInfoSection';
import { InstitutionalSection } from '@/components/InstitutionalSection';
import { MissionVisionValuesSection } from '@/components/MissionVisionValuesSection';
import { WebsiteSection } from '@/components/WebsiteSection';
import { GoogleReviewsSection } from '@/components/GoogleReviewsSection';
import { UserPurposeAnswersSection } from '@/components/UserPurposeAnswersSection';
import { TrainingCategoriesSection } from '@/components/TrainingCategoriesSection';
import { EditableSectionHeader } from '@/components/EditableSectionHeader';
import { EditableTabTitle } from '@/components/EditableTabTitle';
import { EditableAccordionTitle } from '@/components/EditableAccordionTitle';
import { EditableBanner } from '@/components/EditableBanner';

import { MotivationalPopup } from '@/components/MotivationalPopup';
import { PurposePopup } from '@/components/PurposePopup';
import { TrainingPopup } from '@/components/TrainingPopup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import logoPride from '@/assets/Logo_Pride.png';
import logoPrideGold from '@/assets/Logo_Pride-2.png';

const Index = () => {
  const { signOut, user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { data: sectionTitles = {} } = useSectionTitles();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [userViewMode, setUserViewMode] = useState(false);
  const [showMotivationalPopup, setShowMotivationalPopup] = useState(false);
  const [showPurposePopup, setShowPurposePopup] = useState(false);
  const [showTrainingPopup, setShowTrainingPopup] = useState(false);
  const [fluxoExpandedItems, setFluxoExpandedItems] = useState<string[]>([]);

  // Get section titles with fallbacks
  const getCadenciaTitle = () => sectionTitles['cadencia_header']?.title || 'Fluxo/ Cadência - Qualificação';
  const getCadenciaSubtitle = () => sectionTitles['cadencia_header']?.subtitle || 'Acompanhe o fluxo de cadência dos seus atendimentos dia a dia';

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleUserViewMode = () => {
    setUserViewMode(!userViewMode);
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
                <HowToUseVideoDialog isAdmin={isAdmin} />
                
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
            <TabsList className="w-full flex flex-wrap mb-6 h-auto p-2 bg-gradient-hero rounded-lg gap-2">
              <TabsTrigger 
                value="prospeccao" 
                className="flex-1 min-w-[120px] text-sm sm:text-base font-black py-2.5 px-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=inactive]:text-accent/70 data-[state=inactive]:hover:bg-accent/20 rounded-lg transition-all"
              >
                <EditableTabTitle
                  sectionKey="tab_prospeccao"
                  defaultTitle="Roteiro de&#10;Prospecção SDR"
                  defaultShortTitle="Roteiro"
                  isAdmin={isAdmin}
                  userViewMode={userViewMode}
                  icon={<ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
                />
              </TabsTrigger>
              <TabsTrigger 
                value="cadencia" 
                className="flex-1 min-w-[120px] text-sm sm:text-base font-black py-2.5 px-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=inactive]:text-accent/70 data-[state=inactive]:hover:bg-accent/20 rounded-lg transition-all"
              >
                <EditableTabTitle
                  sectionKey="tab_cadencia"
                  defaultTitle="Fluxo/ Cadência&#10;- Qualificação"
                  defaultShortTitle="Cadência"
                  isAdmin={isAdmin}
                  userViewMode={userViewMode}
                  icon={<Workflow className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
                />
              </TabsTrigger>
              <TabsTrigger 
                value="fluxo" 
                className="flex-1 min-w-[120px] text-sm sm:text-base font-black py-2.5 px-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=inactive]:text-accent/70 data-[state=inactive]:hover:bg-accent/20 rounded-lg transition-all"
              >
                <EditableTabTitle
                  sectionKey="tab_materiais"
                  defaultTitle="Materiais&#10;Adicionais"
                  defaultShortTitle="Materiais"
                  isAdmin={isAdmin}
                  userViewMode={userViewMode}
                  icon={<BookOpen className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
                />
              </TabsTrigger>
              <TabsTrigger 
                value="pride" 
                className="flex-1 min-w-[120px] text-sm sm:text-base font-black py-2.5 px-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=inactive]:text-accent/70 data-[state=inactive]:hover:bg-accent/20 rounded-lg transition-all"
              >
                <EditableTabTitle
                  sectionKey="tab_pride"
                  defaultTitle="Conheça a&#10;Pride Corretora"
                  defaultShortTitle="Pride"
                  isAdmin={isAdmin}
                  userViewMode={userViewMode}
                  icon={<img src={logoPrideGold} alt="Pride" className="w-6 h-6 sm:w-7 sm:h-7 object-contain flex-shrink-0" />}
                />
              </TabsTrigger>
              <TabsTrigger 
                value="treinamentos" 
                className="flex-1 min-w-[120px] text-sm sm:text-base font-black py-2.5 px-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=inactive]:text-accent/70 data-[state=inactive]:hover:bg-accent/20 rounded-lg transition-all"
              >
                <EditableTabTitle
                  sectionKey="tab_treinamentos"
                  defaultTitle="Treinamentos&#10;de Operadoras"
                  defaultShortTitle="Treinamentos"
                  isAdmin={isAdmin}
                  userViewMode={userViewMode}
                  icon={<GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
                />
              </TabsTrigger>
              <button
                onClick={() => navigate('/artes-campanhas')}
                className="flex-none min-w-[110px] text-sm sm:text-base font-black py-2.5 px-3 text-accent/70 hover:bg-accent hover:text-primary rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <EditableTabTitle
                  sectionKey="tab_artes_campanhas"
                  defaultTitle="Artes e&#10;Campanhas"
                  defaultShortTitle="Artes"
                  isAdmin={isAdmin}
                  userViewMode={userViewMode}
                  icon={<Palette className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
                />
              </button>
              <TabsTrigger 
                value="avaliacoes" 
                className="flex-none min-w-[110px] text-sm sm:text-base font-black py-2.5 px-3 text-accent/70 hover:bg-accent hover:text-primary data-[state=active]:bg-accent data-[state=active]:text-primary rounded-lg transition-all"
              >
                <EditableTabTitle
                  sectionKey="tab_avaliacoes"
                  defaultTitle="Avaliações"
                  isAdmin={isAdmin}
                  userViewMode={userViewMode}
                  icon={<Star className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
                  showShortOnMobile={false}
                />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prospeccao" className="mt-0" data-section="prospeccao-tab">
              <EditableBanner sectionKey="banner_prospeccao" isAdmin={isAdmin} userViewMode={userViewMode} />
              
              {/* Golden Rule */}
              <div data-section="golden-rule">
              <GoldenRule darkMode={darkMode} />
              </div>

              {/* Script Sections */}
              <div data-section="script-sections">
              <ScriptSections darkMode={darkMode} userViewMode={userViewMode} />
              </div>

              {/* Do's and Don'ts */}
              <div data-section="dos-donts">
              <DosDonts darkMode={darkMode} />
              </div>

              {/* Admin Audio Section */}
              <Accordion type="multiple" className="mb-4" defaultValue={[]}>
                <AccordionItem value="admin-audio" className="bg-card rounded-xl shadow-lg border-2 border-primary/30 overflow-hidden hover:border-primary/50 transition-colors" data-section="admin-audio">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-primary/5 transition-colors">
                    <EditableAccordionTitle
                      sectionKey="accordion_audios_treinamento"
                      defaultTitle="🎵 Áudios de Treinamento"
                      isAdmin={isAdmin}
                      userViewMode={userViewMode}
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    <AdminAudioSection darkMode={darkMode} userViewMode={userViewMode} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Video Section */}
              <Accordion type="multiple" className="mb-4" defaultValue={[]}>
                <AccordionItem value="videos" className="bg-card rounded-xl shadow-lg border-2 border-primary/30 overflow-hidden hover:border-primary/50 transition-colors" data-section="videos">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-primary/5 transition-colors">
                    <EditableAccordionTitle
                      sectionKey="accordion_videos_treinamento"
                      defaultTitle="🎥 Vídeos de Treinamento"
                      isAdmin={isAdmin}
                      userViewMode={userViewMode}
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    <VideoSection darkMode={darkMode} userViewMode={userViewMode} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Botão Motivacional - Complemento da última seção */}
              <div className="mb-6 flex justify-center">
                <button
                  onClick={() => setShowMotivationalPopup(true)}
                  className="bg-gradient-to-r from-orange-500 via-red-600 to-purple-700 hover:from-orange-600 hover:via-red-700 hover:to-purple-800 text-white font-black px-8 py-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 text-sm sm:text-base relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] before:animate-[shimmer_3s_ease-in-out_infinite]"
                  title="Mensagem motivacional"
                >
                  🔥 Em caso de insegurança ou medo - CLIQUE AQUI
                </button>
              </div>
            </TabsContent>

            <TabsContent value="cadencia" className="mt-0">
              <EditableBanner sectionKey="banner_cadencia" isAdmin={isAdmin} userViewMode={userViewMode} />
              
              <div className="mb-6 bg-gradient-hero rounded-xl shadow-lg p-6">
                <EditableSectionHeader
                  sectionKey="cadencia_header"
                  title={getCadenciaTitle()}
                  subtitle={getCadenciaSubtitle()}
                  isAdmin={isAdmin}
                  userViewMode={userViewMode}
                  titleClassName="text-2xl font-black text-accent mb-2"
                  subtitleClassName="text-accent/80"
                />
              </div>

              <div data-section="cadencia-sections">
                <CadenciaSections darkMode={darkMode} userViewMode={userViewMode} />
              </div>
            </TabsContent>

            <TabsContent value="pride" className="mt-0">
              <EditableBanner sectionKey="banner_pride" isAdmin={isAdmin} userViewMode={userViewMode} />
              
              <Accordion type="multiple" className="w-full space-y-4">
                <AccordionItem value="website" className="bg-card rounded-xl shadow-lg border-2 border-primary/30 overflow-hidden hover:border-primary/50 transition-colors" data-section="website">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-primary/5 transition-colors">
                    <EditableAccordionTitle
                      sectionKey="accordion_site_pride"
                      defaultTitle="🌐 Site Pride Corretora"
                      isAdmin={isAdmin}
                      userViewMode={userViewMode}
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    <WebsiteSection darkMode={darkMode} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="reviews" className="bg-card rounded-xl shadow-lg border-2 border-primary/30 overflow-hidden hover:border-primary/50 transition-colors" data-section="reviews">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-primary/5 transition-colors">
                    <EditableAccordionTitle
                      sectionKey="accordion_avaliacoes_google"
                      defaultTitle="⭐ Avaliações do Google"
                      isAdmin={isAdmin}
                      userViewMode={userViewMode}
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    <GoogleReviewsSection darkMode={darkMode} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="institutional" className="bg-card rounded-xl shadow-lg border-2 border-primary/30 overflow-hidden hover:border-primary/50 transition-colors" data-section="institutional">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-primary/5 transition-colors">
                    <EditableAccordionTitle
                      sectionKey="accordion_video_institucional"
                      defaultTitle="🎥 Vídeo Institucional"
                      isAdmin={isAdmin}
                      userViewMode={userViewMode}
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    <InstitutionalSection darkMode={darkMode} userViewMode={userViewMode} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="mission" className="bg-card rounded-xl shadow-lg border-2 border-primary/30 overflow-hidden hover:border-primary/50 transition-colors" data-section="mission-vision">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-primary/5 transition-colors">
                    <EditableAccordionTitle
                      sectionKey="accordion_missao_visao"
                      defaultTitle="🎯 Missão, Visão e Valores"
                      isAdmin={isAdmin}
                      userViewMode={userViewMode}
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    <MissionVisionValuesSection darkMode={darkMode} userViewMode={userViewMode} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Botão Motivacional - Final da aba Pride */}
              <div className="mt-6 mb-6 flex justify-center">
                <button
                  onClick={() => setShowTrainingPopup(true)}
                  className="bg-gradient-to-r from-green-500 via-purple-600 to-orange-600 hover:from-green-600 hover:via-purple-700 hover:to-orange-700 text-white font-black px-8 py-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 text-sm sm:text-base relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] before:animate-[shimmer_3s_ease-in-out_infinite]"
                  title="Mensagem de treino"
                >
                  🎯 Não sabe o que fazer? - CLIQUE AQUI
                </button>
              </div>
            </TabsContent>

            <TabsContent value="fluxo" className="mt-0">
              <EditableBanner sectionKey="banner_fluxo" isAdmin={isAdmin} userViewMode={userViewMode} />
              
              <Accordion 
                type="multiple" 
                className="w-full space-y-4"
                value={fluxoExpandedItems}
                onValueChange={setFluxoExpandedItems}
              >
                <AccordionItem value="qualification" className="bg-card rounded-xl shadow-lg border-2 border-primary/30 overflow-hidden hover:border-primary/50 transition-colors" data-section="qualification">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-primary/5 transition-colors">
                    <EditableAccordionTitle
                      sectionKey="accordion_info_qualificacao"
                      defaultTitle="📋 Informações de Qualificação"
                      isAdmin={isAdmin}
                      userViewMode={userViewMode}
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    <QualificationInfoSection darkMode={darkMode} userViewMode={userViewMode} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="pdf" className="bg-card rounded-xl shadow-lg border-2 border-primary/30 overflow-hidden hover:border-primary/50 transition-colors" data-section="pdfs">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-primary/5 transition-colors">
                    <EditableAccordionTitle
                      sectionKey="accordion_materiais_pdf"
                      defaultTitle="📄 Materiais em PDF"
                      isAdmin={isAdmin}
                      userViewMode={userViewMode}
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    <PdfSection darkMode={darkMode} userViewMode={userViewMode} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="audio" className="bg-card rounded-xl shadow-lg border-2 border-primary/30 overflow-hidden hover:border-primary/50 transition-colors" data-section="fluxo-audio">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-primary/5 transition-colors">
                    <EditableAccordionTitle
                      sectionKey="accordion_audios_fluxo"
                      defaultTitle="🎧 Áudios (Treinamentos)"
                      isAdmin={isAdmin}
                      userViewMode={userViewMode}
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    <FluxoAudioSection darkMode={darkMode} userViewMode={userViewMode} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="video" className="bg-card rounded-xl shadow-lg border-2 border-primary/30 overflow-hidden hover:border-primary/50 transition-colors" data-section="fluxo-video">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-primary/5 transition-colors">
                    <EditableAccordionTitle
                      sectionKey="accordion_videos_fluxo"
                      defaultTitle="🎬 Vídeos (Treinamentos)"
                      isAdmin={isAdmin}
                      userViewMode={userViewMode}
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    <FluxoVideoSection darkMode={darkMode} userViewMode={userViewMode} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="purpose-answers" className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-xl shadow-lg border-2 border-orange-200/50 dark:border-orange-700/30 overflow-hidden hover:border-orange-300/70 dark:hover:border-orange-600/50 transition-colors" data-section="purpose-reflections">
                  <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-primary/5 transition-colors">
                    <EditableAccordionTitle
                      sectionKey="accordion_reflexoes_proposito"
                      defaultTitle="📝 Minhas Reflexões de Propósito"
                      isAdmin={isAdmin}
                      userViewMode={userViewMode}
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    <UserPurposeAnswersSection darkMode={darkMode} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Botão Minimizar Tudo */}
              {fluxoExpandedItems.length > 0 && (
                <button
                  onClick={() => setFluxoExpandedItems([])}
                  className="fixed bottom-6 right-6 bg-gradient-hero hover:opacity-90 text-accent font-bold px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 transition-all duration-300 hover:scale-110 z-50 border-2 border-accent"
                  title="Minimizar todas as seções"
                >
                  <ChevronUp className="w-5 h-5" />
                  <span className="hidden sm:inline">Minimizar Tudo</span>
                </button>
              )}

              {/* Botão Motivacional - Final da página */}
              <div className="mt-6 mb-6 flex justify-center">
                <button
                  onClick={() => setShowPurposePopup(true)}
                  className="bg-gradient-to-r from-orange-500 via-red-600 to-purple-700 hover:from-orange-600 hover:via-red-700 hover:to-purple-800 text-white font-black px-8 py-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 text-sm sm:text-base relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] before:animate-[shimmer_3s_ease-in-out_infinite]"
                  title="Encontre seu propósito"
                >
                  🔥 Se está desmotivado - CLIQUE AQUI
                </button>
              </div>
            </TabsContent>

            <TabsContent value="treinamentos" className="mt-0">
              <EditableBanner sectionKey="banner_treinamentos" isAdmin={isAdmin} userViewMode={userViewMode} />
              <TrainingCategoriesSection isAdmin={isAdmin} userViewMode={userViewMode} />
            </TabsContent>

            <TabsContent value="avaliacoes" className="mt-0">
              <EditableBanner sectionKey="banner_avaliacoes" isAdmin={isAdmin} userViewMode={userViewMode} />
              
              <div className="text-center text-muted-foreground py-8">
                <p>Conteúdo da seção de avaliações será adicionado aqui.</p>
              </div>
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
          {showPurposePopup && <PurposePopup onClose={() => setShowPurposePopup(false)} />}
          {showTrainingPopup && <TrainingPopup onClose={() => setShowTrainingPopup(false)} />}
        </div>
      </div>
    </div>
  );
};

export default Index;
