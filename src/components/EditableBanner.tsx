import { useState } from 'react';
import { Construction, Edit2, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSectionTitles, useUpdateSectionBanner } from '@/hooks/useSectionTitles';

interface EditableBannerProps {
  sectionKey: string;
  isAdmin: boolean;
  userViewMode: boolean;
}

export const EditableBanner = ({ sectionKey, isAdmin, userViewMode }: EditableBannerProps) => {
  const { data: sectionTitles = {} } = useSectionTitles();
  const updateBanner = useUpdateSectionBanner();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerSubtitle, setBannerSubtitle] = useState('');

  const sectionData = sectionTitles[sectionKey];
  const currentShowBanner = sectionData?.show_banner ?? false;
  const currentBannerSubtitle = sectionData?.banner_subtitle ?? '';

  const showAdminControls = isAdmin && !userViewMode;

  const openEditDialog = () => {
    setShowBanner(currentShowBanner);
    setBannerSubtitle(currentBannerSubtitle);
    setIsEditDialogOpen(true);
  };

  const handleSave = async () => {
    await updateBanner.mutateAsync({
      sectionKey,
      showBanner,
      bannerSubtitle,
    });
    setIsEditDialogOpen(false);
  };

  // If banner is not enabled, show nothing (or edit button for admin)
  if (!currentShowBanner) {
    if (showAdminControls) {
      return (
        <div className="flex justify-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={openEditDialog}
            className="text-muted-foreground hover:text-foreground"
          >
            <Construction className="w-4 h-4 mr-2" />
            Adicionar Banner "Em Construção"
          </Button>
          
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configurar Banner "Em Construção"</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Construction className="w-4 h-4 text-orange-500" />
                    <Label htmlFor="show-banner" className="text-sm font-medium">
                      Exibir banner
                    </Label>
                  </div>
                  <Switch
                    id="show-banner"
                    checked={showBanner}
                    onCheckedChange={setShowBanner}
                  />
                </div>
                {showBanner && (
                  <div>
                    <label className="text-sm font-medium">Subtítulo do Banner</label>
                    <Input
                      value={bannerSubtitle}
                      onChange={(e) => setBannerSubtitle(e.target.value)}
                      placeholder="Ex: Essa seção está sendo desenvolvida..."
                    />
                  </div>
                )}
                <Button onClick={handleSave} className="w-full" disabled={updateBanner.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      <div className="bg-card rounded-lg shadow-xl p-8 text-center border-2 border-border mb-6 relative group">
        {showAdminControls && (
          <button
            onClick={openEditDialog}
            className="absolute top-2 right-2 p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Editar banner"
          >
            <Edit2 className="w-3 h-3" />
          </button>
        )}
        <div className="inline-block bg-gradient-to-r from-orange-500 to-red-600 rounded-full p-4 mb-4 shadow-2xl">
          <Construction className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-black text-primary mb-2">🚧 Em Construção</h2>
        {currentBannerSubtitle && (
          <p className="text-lg text-muted-foreground">
            {currentBannerSubtitle}
          </p>
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurar Banner "Em Construção"</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Construction className="w-4 h-4 text-orange-500" />
                <Label htmlFor="show-banner-edit" className="text-sm font-medium">
                  Exibir banner
                </Label>
              </div>
              <Switch
                id="show-banner-edit"
                checked={showBanner}
                onCheckedChange={setShowBanner}
              />
            </div>
            {showBanner && (
              <div>
                <label className="text-sm font-medium">Subtítulo do Banner</label>
                <Input
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  placeholder="Ex: Essa seção está sendo desenvolvida..."
                />
              </div>
            )}
            <Button onClick={handleSave} className="w-full" disabled={updateBanner.isPending}>
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditableBanner;
