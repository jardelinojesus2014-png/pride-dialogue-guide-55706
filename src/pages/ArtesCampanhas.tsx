import { useState } from 'react';
import { ArrowLeft, Megaphone, Search, Archive, FileText, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useInformativos } from '@/hooks/useInformativos';
import { useArtes } from '@/hooks/useArtes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CampaignCard } from '@/components/CampaignCard';
import { AddCampaignDialog } from '@/components/AddCampaignDialog';
import { AddGenericItemDialog } from '@/components/AddGenericItemDialog';
import { GenericItemCard } from '@/components/GenericItemCard';
import { ArtesFolderCard } from '@/components/ArtesFolderCard';
import logoPride from '@/assets/Logo_Pride.png';

// Reusable tab content component
interface TabSectionProps {
  items: any[];
  loading: boolean;
  isAdmin: boolean;
  label: string;
  emptyIcon: React.ReactNode;
  subTab: 'ativas' | 'arquivadas';
  setSubTab: (v: 'ativas' | 'arquivadas') => void;
  search: string;
  setSearch: (v: string) => void;
  filterOperadora: string;
  setFilterOperadora: (v: string) => void;
  filterStatus: string;
  setFilterStatus: (v: string) => void;
  onDelete: (id: string, bannerPath: string | null) => void;
  onUpdate: (id: string, updates: any) => void;
  onAddCreatives: (id: string, files: File[]) => void;
  onArchive: (id: string) => void;
  addDialog: React.ReactNode;
  renderCard: (item: any) => React.ReactNode;
}

const TabSection = ({
  items, loading, isAdmin, label, emptyIcon, subTab, setSubTab,
  search, setSearch, filterOperadora, setFilterOperadora, filterStatus, setFilterStatus,
  onArchive, addDialog, renderCard,
}: TabSectionProps) => {
  const operadoras = [...new Set(items.map((c: any) => c.operadora_name).filter(Boolean))];

  const filtered = items.filter((c: any) => {
    const isArchived = c.status === 'arquivada';
    if (subTab === 'ativas' && isArchived) return false;
    if (subTab === 'arquivadas' && !isArchived) return false;
    const matchSearch = (c.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (c.operadora_name?.toLowerCase() || '').includes(search.toLowerCase());
    const matchOperadora = filterOperadora === 'all' || c.operadora_name === filterOperadora;
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchOperadora && matchStatus;
  });

  return (
    <>
      <div className="flex gap-2 mb-4">
        <Button variant={subTab === 'ativas' ? 'default' : 'outline'} size="sm" onClick={() => setSubTab('ativas')} className="rounded-lg">
          <Megaphone className="w-4 h-4 mr-1.5" />
          Ativ{label === 'Arte' ? 'a' : 'o'}s
        </Button>
        <Button variant={subTab === 'arquivadas' ? 'default' : 'outline'} size="sm" onClick={() => setSubTab('arquivadas')} className="rounded-lg">
          <Archive className="w-4 h-4 mr-1.5" />
          Arquivad{label === 'Arte' ? 'a' : 'o'}s
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome, operadora..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>
        <Select value={filterOperadora} onValueChange={setFilterOperadora}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Todas operadoras" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas operadoras</SelectItem>
            {operadoras.map(op => <SelectItem key={op} value={op}>{op}</SelectItem>)}
          </SelectContent>
        </Select>
        {subTab === 'ativas' && (
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Todos status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="ativa">Ativa</SelectItem>
              <SelectItem value="vencendo">Vencendo</SelectItem>
              <SelectItem value="encerrada">Encerrada</SelectItem>
            </SelectContent>
          </Select>
        )}
        {isAdmin && addDialog}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {emptyIcon}
          <p>{subTab === 'arquivadas' ? `Nenhum${label === 'Arte' ? 'a' : ''} ${label.toLowerCase()} arquivad${label === 'Arte' ? 'a' : 'o'}` : `Nenhum${label === 'Arte' ? 'a' : ''} ${label.toLowerCase()} encontrad${label === 'Arte' ? 'a' : 'o'}`}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {prependElement}
          {filtered.map((item: any) => renderCard(item))}
        </div>
      )}
    </>
  );
};

const ArtesCampanhas = () => {
  const navigate = useNavigate();
  const { isAdmin } = useIsAdmin();
  const { campaigns, loading: loadingCampaigns, addCampaign, updateCampaign, deleteCampaign, addCreativeFiles } = useCampaigns();
  const { informativos, loading: loadingInformativos, addInformativo, updateInformativo, deleteInformativo, addCreativeFiles: addInformativoCreatives } = useInformativos();
  const { artes, loading: loadingArtes, addArte, updateArte, deleteArte, addCreativeFiles: addArteCreatives } = useArtes();

  // Campanhas state
  const [searchCampaign, setSearchCampaign] = useState('');
  const [filterOperadoraCampaign, setFilterOperadoraCampaign] = useState('all');
  const [filterStatusCampaign, setFilterStatusCampaign] = useState('all');
  const [subTabCampaign, setSubTabCampaign] = useState<'ativas' | 'arquivadas'>('ativas');

  // Informativos state
  const [searchInfo, setSearchInfo] = useState('');
  const [filterOperadoraInfo, setFilterOperadoraInfo] = useState('all');
  const [filterStatusInfo, setFilterStatusInfo] = useState('all');
  const [subTabInfo, setSubTabInfo] = useState<'ativas' | 'arquivadas'>('ativas');

  // Artes state
  const [searchArte, setSearchArte] = useState('');
  const [filterOperadoraArte, setFilterOperadoraArte] = useState('all');
  const [filterStatusArte, setFilterStatusArte] = useState('all');
  const [subTabArte, setSubTabArte] = useState<'ativas' | 'arquivadas'>('ativas');

  const handleArchiveCampaign = (id: string) => {
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign) return;
    let newStatus: string;
    if (campaign.status === 'arquivada') {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const isPast = campaign.end_date && new Date(campaign.end_date) < today;
      newStatus = isPast ? 'encerrada' : 'ativa';
    } else { newStatus = 'arquivada'; }
    updateCampaign(id, { status: newStatus });
  };

  const handleArchiveInformativo = (id: string) => {
    const item = informativos.find(c => c.id === id);
    if (!item) return;
    let newStatus: string;
    if (item.status === 'arquivada') {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const isPast = item.end_date && new Date(item.end_date) < today;
      newStatus = isPast ? 'encerrada' : 'ativa';
    } else { newStatus = 'arquivada'; }
    updateInformativo(id, { status: newStatus });
  };

  const handleArchiveArte = (id: string) => {
    const item = artes.find(c => c.id === id);
    if (!item) return;
    let newStatus: string;
    if (item.status === 'arquivada') {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const isPast = item.end_date && new Date(item.end_date) < today;
      newStatus = isPast ? 'encerrada' : 'ativa';
    } else { newStatus = 'arquivada'; }
    updateArte(id, { status: newStatus });
  };

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
                  Encontre campanhas, informativos, regras e criativos das operadoras.
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/')} className="bg-accent/10 border-accent/30 text-accent hover:bg-accent/20">
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
              value="informativos"
              className="flex-1 text-sm sm:text-base font-black py-2.5 px-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=inactive]:text-accent/70 rounded-lg transition-all"
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Informativos
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
            <TabSection
              items={campaigns}
              loading={loadingCampaigns}
              isAdmin={isAdmin}
              label="Campanha"
              emptyIcon={<Megaphone className="w-12 h-12 mx-auto mb-3 opacity-40" />}
              subTab={subTabCampaign}
              setSubTab={setSubTabCampaign}
              search={searchCampaign}
              setSearch={setSearchCampaign}
              filterOperadora={filterOperadoraCampaign}
              setFilterOperadora={setFilterOperadoraCampaign}
              filterStatus={filterStatusCampaign}
              setFilterStatus={setFilterStatusCampaign}
              onDelete={deleteCampaign}
              onUpdate={updateCampaign}
              onAddCreatives={addCreativeFiles}
              onArchive={handleArchiveCampaign}
              addDialog={<AddCampaignDialog onAdd={addCampaign} />}
              renderCard={(campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  isAdmin={isAdmin}
                  onDelete={deleteCampaign}
                  onUpdate={updateCampaign}
                  onAddCreatives={addCreativeFiles}
                  onArchive={isAdmin ? handleArchiveCampaign : undefined}
                />
              )}
            />
          </TabsContent>

          {/* Informativos Tab */}
          <TabsContent value="informativos" className="mt-0">
            <TabSection
              items={informativos}
              loading={loadingInformativos}
              isAdmin={isAdmin}
              label="Informativo"
              emptyIcon={<FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />}
              subTab={subTabInfo}
              setSubTab={setSubTabInfo}
              search={searchInfo}
              setSearch={setSearchInfo}
              filterOperadora={filterOperadoraInfo}
              setFilterOperadora={setFilterOperadoraInfo}
              filterStatus={filterStatusInfo}
              setFilterStatus={setFilterStatusInfo}
              onDelete={deleteInformativo}
              onUpdate={updateInformativo}
              onAddCreatives={addInformativoCreatives}
              onArchive={handleArchiveInformativo}
              addDialog={
                <AddGenericItemDialog
                  label="Informativo"
                  onAdd={addInformativo}
                  typeOptions={[
                    { value: 'informativo', label: 'Informativo' },
                    { value: 'comunicado', label: 'Comunicado' },
                    { value: 'aviso', label: 'Aviso' },
                  ]}
                />
              }
              renderCard={(item) => (
                <GenericItemCard
                  key={item.id}
                  item={item}
                  isAdmin={isAdmin}
                  label="Informativo"
                  onDelete={deleteInformativo}
                  onUpdate={updateInformativo}
                  onAddCreatives={addInformativoCreatives}
                  onArchive={isAdmin ? handleArchiveInformativo : undefined}
                />
              )}
            />
          </TabsContent>

          {/* Artes Tab */}
          <TabsContent value="artes" className="mt-0">
            <TabSection
              items={artes}
              loading={loadingArtes}
              isAdmin={isAdmin}
              label="Arte"
              emptyIcon={<Palette className="w-12 h-12 mx-auto mb-3 opacity-40" />}
              subTab={subTabArte}
              setSubTab={setSubTabArte}
              search={searchArte}
              setSearch={setSearchArte}
              filterOperadora={filterOperadoraArte}
              setFilterOperadora={setFilterOperadoraArte}
              filterStatus={filterStatusArte}
              setFilterStatus={setFilterStatusArte}
              onDelete={deleteArte}
              onUpdate={updateArte}
              onAddCreatives={addArteCreatives}
              onArchive={handleArchiveArte}
              addDialog={
                <AddGenericItemDialog
                  label="Arte"
                  onAdd={addArte}
                  typeOptions={[
                    { value: 'arte', label: 'Arte' },
                    { value: 'banner', label: 'Banner' },
                    { value: 'post', label: 'Post' },
                    { value: 'story', label: 'Story' },
                  ]}
                />
              }
              renderCard={(item) => (
                <GenericItemCard
                  key={item.id}
                  item={{
                    ...item,
                    banner_image_url: item.banner_image_url || item.file_url,
                  }}
                  isAdmin={isAdmin}
                  label="Arte"
                  onDelete={deleteArte}
                  onUpdate={updateArte}
                  onAddCreatives={addArteCreatives}
                  onArchive={isAdmin ? handleArchiveArte : undefined}
                />
              )}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ArtesCampanhas;
