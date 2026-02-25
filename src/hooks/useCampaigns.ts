import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Campaign {
  id: string;
  title: string;
  description: string | null;
  operadora_name: string;
  operadora_logo_url: string | null;
  banner_image_url: string | null;
  banner_image_path: string | null;
  status: string;
  campaign_type: string;
  start_date: string | null;
  end_date: string | null;
  tags: string[];
  details_content: string | null;
  creative_file_urls: string[];
  creative_file_paths: string[];
  creative_file_names: string[];
  display_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns((data || []) as Campaign[]);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast.error('Erro ao carregar campanhas');
    } finally {
      setLoading(false);
    }
  };

  const addCampaign = async (campaign: {
    title: string;
    description: string;
    operadora_name: string;
    status: string;
    campaign_type: string;
    start_date: string;
    end_date: string;
    tags: string[];
    details_content: string;
    bannerFile?: File;
    operadoraLogoFile?: File;
  }) => {
    try {
      let banner_image_url: string | null = null;
      let banner_image_path: string | null = null;
      let operadora_logo_url: string | null = null;

      if (campaign.bannerFile) {
        const ext = campaign.bannerFile.name.split('.').pop();
        const path = `banners/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from('campaigns').upload(path, campaign.bannerFile);
        if (uploadErr) throw uploadErr;
        const { data: { publicUrl } } = supabase.storage.from('campaigns').getPublicUrl(path);
        banner_image_url = publicUrl;
        banner_image_path = path;
      }

      if (campaign.operadoraLogoFile) {
        const ext = campaign.operadoraLogoFile.name.split('.').pop();
        const path = `logos/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from('campaigns').upload(path, campaign.operadoraLogoFile);
        if (uploadErr) throw uploadErr;
        const { data: { publicUrl } } = supabase.storage.from('campaigns').getPublicUrl(path);
        operadora_logo_url = publicUrl;
      }

      const { error } = await supabase.from('campaigns').insert({
        title: campaign.title,
        description: campaign.description || null,
        operadora_name: campaign.operadora_name,
        operadora_logo_url,
        banner_image_url,
        banner_image_path,
        status: campaign.status,
        campaign_type: campaign.campaign_type,
        start_date: campaign.start_date || null,
        end_date: campaign.end_date || null,
        tags: campaign.tags,
        details_content: campaign.details_content || null,
        display_order: campaigns.length,
      });

      if (error) throw error;
      toast.success('Campanha adicionada com sucesso!');
      fetchCampaigns();
    } catch (error) {
      console.error('Error adding campaign:', error);
      toast.error('Erro ao adicionar campanha');
    }
  };

  const updateCampaign = async (id: string, updates: Partial<Campaign>) => {
    try {
      const { error } = await supabase.from('campaigns').update(updates).eq('id', id);
      if (error) throw error;
      toast.success('Campanha atualizada!');
      fetchCampaigns();
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast.error('Erro ao atualizar campanha');
    }
  };

  const deleteCampaign = async (id: string, bannerPath: string | null) => {
    try {
      if (bannerPath) {
        await supabase.storage.from('campaigns').remove([bannerPath]);
      }
      const { error } = await supabase.from('campaigns').delete().eq('id', id);
      if (error) throw error;
      toast.success('Campanha removida!');
      fetchCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error('Erro ao remover campanha');
    }
  };

  const addCreativeFiles = async (campaignId: string, files: File[]) => {
    try {
      const campaign = campaigns.find(c => c.id === campaignId);
      if (!campaign) return;

      const newUrls = [...(campaign.creative_file_urls || [])];
      const newPaths = [...(campaign.creative_file_paths || [])];
      const newNames = [...(campaign.creative_file_names || [])];

      for (const file of files) {
        const ext = file.name.split('.').pop();
        const path = `creatives/${campaignId}/${Date.now()}_${file.name}`;
        const { error: uploadErr } = await supabase.storage.from('campaigns').upload(path, file);
        if (uploadErr) throw uploadErr;
        const { data: { publicUrl } } = supabase.storage.from('campaigns').getPublicUrl(path);
        newUrls.push(publicUrl);
        newPaths.push(path);
        newNames.push(file.name);
      }

      const { error } = await supabase.from('campaigns').update({
        creative_file_urls: newUrls,
        creative_file_paths: newPaths,
        creative_file_names: newNames,
      }).eq('id', campaignId);

      if (error) throw error;
      toast.success('Criativos adicionados!');
      fetchCampaigns();
    } catch (error) {
      console.error('Error adding creatives:', error);
      toast.error('Erro ao adicionar criativos');
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return { campaigns, loading, addCampaign, updateCampaign, deleteCampaign, addCreativeFiles, refetch: fetchCampaigns };
};
