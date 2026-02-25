import { useState } from 'react';
import { ArrowLeft, Palette, Megaphone, Plus, Trash2, Search, Upload, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useAuth } from '@/hooks/useAuth';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useArtes, Arte } from '@/hooks/useArtes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CampaignCard } from '@/components/CampaignCard';
import { AddCampaignDialog } from '@/components/AddCampaignDialog';
import logoPride from '@/assets/Logo_Pride.png';

const ArtesCampanhas = () => {
  const navigate = useNavigate();
  const { isAdmin } = useIsAdmin();
  const { campaigns, loading: loadingCampaigns, addCampaign, updateCampaign, deleteCampaign, addCreativeFiles } = useCampaigns();
  const { artes, loading: loadingArtes, addArte, deleteArte } = useArtes();
  
  const [searchCampaign, setSearchCampaign] = useState('');
  const [filterOperadora, setFilterOperadora] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Arte form
  const [arteOpen, setArteOpen] = useState(false);
  const [arteTitle, setArteTitle] = useState('');
  const [arteDesc, setArteDesc] = useState('');
  const [arteCategory, setArteCategory] = useState('');
  const [arteFile, setArteFile] = useState<File | null>(null);
  const [arteSaving, setArteSaving] = useState(false);

  const handleAddArte = async () => {
    if (!arteTitle || !arteFile) return;
    setArteSaving(true);
    try {
      await addArte(arteTitle, arteDesc, arteCategory, arteFile);
      setArteOpen(false);
      setArteTitle(''); setArteDesc(''); setArteCategory(''); setArteFile(null);
    } finally {
      setArteSaving(false);
    }
  };

  // Get unique operadoras for filter
  const operadoras = [...new Set(campaigns.map(c => c.operadora_name))];

  const filteredCampaigns = campaigns.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(searchCampaign.toLowerCase()) ||
      c.operadora_name.toLowerCase().includes(searchCampaign.toLowerCase());
    const matchOperadora = filterOperadora === 'all' || c.operadora_name === filterOperadora;
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchOperadora && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="bg-gradient-hero rounded-lg shadow-xl p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <img src={logoPride} alt="Pride" className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
              <div>
                <h1 className="text-2xl sm:text-4xl font-black text-accent">
                  ARTES E CAMPANHAS
                </h1>
                <p className="text-accent/80 font-semibold text-sm sm:text-base mt-1">
                  Encontre campanhas, regras e criativos das operadoras.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="bg-accent/10 border-accent/30 text-accent hover:bg-accent/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        </header>

        {/* Tabs */}
        <Tabs defaultValue="campanhas" className="w-full">
          <TabsList className="w-full flex mb-6 h-auto p-2 bg-gradient-hero rounded-lg gap-2">
            <TabsTrigger
              value="campanhas"
              className="flex-1 text-sm sm:text-base font-black py-2.5 px-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=inactive]:text-accent/70 rounded-lg transition-all"
            >
              <Megaphone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Campanhas
            </TabsTrigger>
            <TabsTrigger
              value="artes"
              className="flex-1 text-sm sm:text-base font-black py-2.5 px-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=inactive]:text-accent/70 rounded-lg transition-all"
            >
              <Palette className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Artes
            </TabsTrigger>
          </TabsList>

          {/* Campanhas Tab */}
          <TabsContent value="campanhas" className="mt-0">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome, operadora..."
                    value={searchCampaign}
                    onChange={e => setSearchCampaign(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={filterOperadora} onValueChange={setFilterOperadora}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todas operadoras" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas operadoras</SelectItem>
                  {operadoras.map(op => (
                    <SelectItem key={op} value={op}>{op}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Todos status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos status</SelectItem>
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="vencendo">Vencendo</SelectItem>
                  <SelectItem value="encerrada">Encerrada</SelectItem>
                </SelectContent>
              </Select>
              {isAdmin && <AddCampaignDialog onAdd={addCampaign} />}
            </div>

            {loadingCampaigns ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>Nenhuma campanha encontrada</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCampaigns.map(campaign => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    isAdmin={isAdmin}
                    onDelete={deleteCampaign}
                    onUpdate={updateCampaign}
                    onAddCreatives={addCreativeFiles}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Artes Tab */}
          <TabsContent value="artes" className="mt-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-foreground">Artes Disponíveis</h2>
              {isAdmin && (
                <Dialog open={arteOpen} onOpenChange={setArteOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Nova Arte
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Arte</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Título *</Label>
                        <Input value={arteTitle} onChange={e => setArteTitle(e.target.value)} placeholder="Nome da arte" />
                      </div>
                      <div>
                        <Label>Descrição</Label>
                        <Textarea value={arteDesc} onChange={e => setArteDesc(e.target.value)} placeholder="Descrição" />
                      </div>
                      <div>
                        <Label>Categoria</Label>
                        <Input value={arteCategory} onChange={e => setArteCategory(e.target.value)} placeholder="Ex: Banner, Post, Story" />
                      </div>
                      <div>
                        <Label>Arquivo *</Label>
                        <Input type="file" accept="image/*,.pdf" onChange={e => setArteFile(e.target.files?.[0] || null)} />
                      </div>
                      <Button onClick={handleAddArte} disabled={arteSaving || !arteTitle || !arteFile} className="w-full">
                        {arteSaving ? 'Salvando...' : 'Adicionar Arte'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {loadingArtes ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : artes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Palette className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>Nenhuma arte disponível</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {artes.map(arte => (
                  <Card key={arte.id} className="overflow-hidden group">
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <img 
                        src={arte.file_url} 
                        alt={arte.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isAdmin && (
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteArte(arte.id, arte.file_path)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm text-foreground">{arte.title}</h3>
                      {arte.description && <p className="text-xs text-muted-foreground mt-1">{arte.description}</p>}
                      {arte.category && (
                        <span className="inline-block mt-2 text-xs bg-muted px-2 py-0.5 rounded">{arte.category}</span>
                      )}
                      <div className="mt-2">
                        <Button size="sm" variant="outline" className="w-full text-xs" asChild>
                          <a href={arte.file_url} target="_blank" rel="noopener noreferrer" download>
                            <Download className="w-3 h-3 mr-1" />
                            Baixar
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ArtesCampanhas;
