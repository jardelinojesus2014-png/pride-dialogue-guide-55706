import { useState } from 'react';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface ExportDialogProps {
  darkMode?: boolean;
}

export const ExportDialog = ({ darkMode }: ExportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedSections, setSelectedSections] = useState({
    // Aba Roteiro de Prospecção
    goldenRule: true,
    scriptSections: true,
    dosDonts: true,
    adminAudio: true,
    videos: true,
    
    // Aba Materiais Adicionais
    qualification: false,
    pdfs: false,
    fluxoAudio: false,
    fluxoVideo: false,
    purposeReflections: false,
    
    // Aba Pride Corretora
    website: false,
    reviews: false,
    institutional: false,
    missionVision: false,
  });

  const toggleSection = (section: keyof typeof selectedSections) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const selectAll = () => {
    const allSelected = Object.values(selectedSections).every(v => v);
    const newState = Object.keys(selectedSections).reduce((acc, key) => ({
      ...acc,
      [key]: !allSelected
    }), {} as typeof selectedSections);
    setSelectedSections(newState);
  };

  const handleExport = () => {
    // Esconder elementos não selecionados
    const hideElements: string[] = [];
    
    if (!selectedSections.goldenRule) hideElements.push('[data-section="golden-rule"]');
    if (!selectedSections.scriptSections) hideElements.push('[data-section="script-sections"]');
    if (!selectedSections.dosDonts) hideElements.push('[data-section="dos-donts"]');
    if (!selectedSections.adminAudio) hideElements.push('[data-section="admin-audio"]');
    if (!selectedSections.videos) hideElements.push('[data-section="videos"]');
    if (!selectedSections.qualification) hideElements.push('[data-section="qualification"]');
    if (!selectedSections.pdfs) hideElements.push('[data-section="pdfs"]');
    if (!selectedSections.fluxoAudio) hideElements.push('[data-section="fluxo-audio"]');
    if (!selectedSections.fluxoVideo) hideElements.push('[data-section="fluxo-video"]');
    if (!selectedSections.purposeReflections) hideElements.push('[data-section="purpose-reflections"]');
    if (!selectedSections.website) hideElements.push('[data-section="website"]');
    if (!selectedSections.reviews) hideElements.push('[data-section="reviews"]');
    if (!selectedSections.institutional) hideElements.push('[data-section="institutional"]');
    if (!selectedSections.missionVision) hideElements.push('[data-section="mission-vision"]');

    // Adicionar estilo temporário para ocultar elementos
    const style = document.createElement('style');
    style.id = 'print-hide-style';
    style.textContent = `
      @media print {
        ${hideElements.join(', ')} {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Imprimir
    setTimeout(() => {
      window.print();
      
      // Remover estilo após impressão
      setTimeout(() => {
        const styleElement = document.getElementById('print-hide-style');
        if (styleElement) {
          styleElement.remove();
        }
      }, 1000);
    }, 100);

    setOpen(false);
  };

  const allSelected = Object.values(selectedSections).every(v => v);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg">
          <FileDown className="w-5 h-5" />
          <span className="hidden sm:inline">Exportar</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-primary">
            📄 Selecionar Conteúdo para Exportar
          </DialogTitle>
          <DialogDescription>
            Escolha quais seções você deseja incluir no PDF
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={selectAll}
              className="font-semibold"
            >
              {allSelected ? 'Desmarcar Todos' : 'Selecionar Todos'}
            </Button>
          </div>

          <Separator />

          {/* Roteiro de Prospecção SDR */}
          <div className="space-y-3">
            <h3 className="font-black text-lg text-primary">📋 Roteiro de Prospecção SDR</h3>
            <div className="space-y-2 ml-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="golden-rule"
                  checked={selectedSections.goldenRule}
                  onCheckedChange={() => toggleSection('goldenRule')}
                />
                <Label htmlFor="golden-rule" className="cursor-pointer">Regra de Ouro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="script-sections"
                  checked={selectedSections.scriptSections}
                  onCheckedChange={() => toggleSection('scriptSections')}
                />
                <Label htmlFor="script-sections" className="cursor-pointer">Seções do Roteiro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dos-donts"
                  checked={selectedSections.dosDonts}
                  onCheckedChange={() => toggleSection('dosDonts')}
                />
                <Label htmlFor="dos-donts" className="cursor-pointer">Do's and Don'ts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="admin-audio"
                  checked={selectedSections.adminAudio}
                  onCheckedChange={() => toggleSection('adminAudio')}
                />
                <Label htmlFor="admin-audio" className="cursor-pointer">Áudios</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="videos"
                  checked={selectedSections.videos}
                  onCheckedChange={() => toggleSection('videos')}
                />
                <Label htmlFor="videos" className="cursor-pointer">Vídeos</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Materiais Adicionais */}
          <div className="space-y-3">
            <h3 className="font-black text-lg text-primary">📚 Materiais Adicionais</h3>
            <div className="space-y-2 ml-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="qualification"
                  checked={selectedSections.qualification}
                  onCheckedChange={() => toggleSection('qualification')}
                />
                <Label htmlFor="qualification" className="cursor-pointer">Informações de Qualificação</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pdfs"
                  checked={selectedSections.pdfs}
                  onCheckedChange={() => toggleSection('pdfs')}
                />
                <Label htmlFor="pdfs" className="cursor-pointer">Materiais em PDF</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fluxo-audio"
                  checked={selectedSections.fluxoAudio}
                  onCheckedChange={() => toggleSection('fluxoAudio')}
                />
                <Label htmlFor="fluxo-audio" className="cursor-pointer">Áudios (Treinamentos)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fluxo-video"
                  checked={selectedSections.fluxoVideo}
                  onCheckedChange={() => toggleSection('fluxoVideo')}
                />
                <Label htmlFor="fluxo-video" className="cursor-pointer">Vídeos (Treinamentos)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="purpose-reflections"
                  checked={selectedSections.purposeReflections}
                  onCheckedChange={() => toggleSection('purposeReflections')}
                />
                <Label htmlFor="purpose-reflections" className="cursor-pointer">Minhas Reflexões de Propósito</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Pride Corretora */}
          <div className="space-y-3">
            <h3 className="font-black text-lg text-primary">🏢 Conheça a Pride Corretora</h3>
            <div className="space-y-2 ml-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="website"
                  checked={selectedSections.website}
                  onCheckedChange={() => toggleSection('website')}
                />
                <Label htmlFor="website" className="cursor-pointer">Site Pride Corretora</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reviews"
                  checked={selectedSections.reviews}
                  onCheckedChange={() => toggleSection('reviews')}
                />
                <Label htmlFor="reviews" className="cursor-pointer">Avaliações do Google</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="institutional"
                  checked={selectedSections.institutional}
                  onCheckedChange={() => toggleSection('institutional')}
                />
                <Label htmlFor="institutional" className="cursor-pointer">Vídeo Institucional</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mission-vision"
                  checked={selectedSections.missionVision}
                  onCheckedChange={() => toggleSection('missionVision')}
                />
                <Label htmlFor="mission-vision" className="cursor-pointer">Missão, Visão e Valores</Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleExport} className="bg-accent hover:bg-accent/90">
            <FileDown className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
