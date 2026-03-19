import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Informativo {
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
  is_pinned: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useInformativos = () => {
  const [informativos, setInformativos] = useState<Informativo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInformativos = async () => {
    try {
      const { data, error } = await supabase
        .from('informativos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const all = (data || []) as Informativo[];

      // Auto-archive past end_date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const toArchive = all.filter(c =>
        (c.status === 'ativa' || c.status === 'vencendo') && c.end_date && new Date(c.end_date) < today
      );

      if (toArchive.length > 0) {
        const ids = toArchive.map(c => c.id);
        await supabase.from('informativos').update({ status: 'arquivada' }).in('id', ids);
        all.forEach(c => {
          if (ids.includes(c.id)) c.status = 'arquivada';
        });
      }

      setInformativos(all);
    } catch (error) {
      console.error('Error fetching informativos:', error);
      toast.error('Erro ao carregar informativos');
    } finally {
      setLoading(false);
    }
  };

  const addInformativo = async (item: {
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

      if (item.bannerFile) {
        const ext = item.bannerFile.name.split('.').pop();
        const path = `informativos/banners/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from('campaigns').upload(path, item.bannerFile);
        if (uploadErr) throw uploadErr;
        const { data: { publicUrl } } = supabase.storage.from('campaigns').getPublicUrl(path);
        banner_image_url = publicUrl;
        banner_image_path = path;
      }

      if (item.operadoraLogoFile) {
        const ext = item.operadoraLogoFile.name.split('.').pop();
        const path = `informativos/logos/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from('campaigns').upload(path, item.operadoraLogoFile);
        if (uploadErr) throw uploadErr;
        const { data: { publicUrl } } = supabase.storage.from('campaigns').getPublicUrl(path);
        operadora_logo_url = publicUrl;
      }

      const { error } = await supabase.from('informativos').insert({
        title: item.title,
        description: item.description || null,
        operadora_name: item.operadora_name,
        operadora_logo_url,
        banner_image_url,
        banner_image_path,
        status: item.status,
        campaign_type: item.campaign_type,
        start_date: item.start_date || null,
        end_date: item.end_date || null,
        tags: item.tags,
        details_content: item.details_content || null,
        display_order: informativos.length,
      });

      if (error) throw error;
      toast.success('Informativo adicionado com sucesso!');
      fetchInformativos();
    } catch (error) {
      console.error('Error adding informativo:', error);
      toast.error('Erro ao adicionar informativo');
    }
  };

  const updateInformativo = async (id: string, updates: Partial<Informativo>) => {
    try {
      const { error } = await supabase.from('informativos').update(updates).eq('id', id);
      if (error) throw error;
      toast.success('Informativo atualizado!');
      fetchInformativos();
    } catch (error) {
      console.error('Error updating informativo:', error);
      toast.error('Erro ao atualizar informativo');
    }
  };

  const deleteInformativo = async (id: string, bannerPath: string | null) => {
    try {
      if (bannerPath) {
        await supabase.storage.from('campaigns').remove([bannerPath]);
      }
      const { error } = await supabase.from('informativos').delete().eq('id', id);
      if (error) throw error;
      toast.success('Informativo removido!');
      fetchInformativos();
    } catch (error) {
      console.error('Error deleting informativo:', error);
      toast.error('Erro ao remover informativo');
    }
  };

  const addCreativeFiles = async (informativoId: string, files: File[]) => {
    try {
      const item = informativos.find(c => c.id === informativoId);
      if (!item) return;

      const newUrls = [...(item.creative_file_urls || [])];
      const newPaths = [...(item.creative_file_paths || [])];
      const newNames = [...(item.creative_file_names || [])];

      for (const file of files) {
        const path = `informativos/creatives/${informativoId}/${Date.now()}_${file.name}`;
        const { error: uploadErr } = await supabase.storage.from('campaigns').upload(path, file);
        if (uploadErr) throw uploadErr;
        const { data: { publicUrl } } = supabase.storage.from('campaigns').getPublicUrl(path);
        newUrls.push(publicUrl);
        newPaths.push(path);
        newNames.push(file.name);
      }

      const { error } = await supabase.from('informativos').update({
        creative_file_urls: newUrls,
        creative_file_paths: newPaths,
        creative_file_names: newNames,
      }).eq('id', informativoId);

      if (error) throw error;
      toast.success('Criativos adicionados!');
      fetchInformativos();
    } catch (error) {
      console.error('Error adding creatives:', error);
      toast.error('Erro ao adicionar criativos');
    }
  };

  useEffect(() => {
    fetchInformativos();
  }, []);

  return { informativos, loading, addInformativo, updateInformativo, deleteInformativo, addCreativeFiles, refetch: fetchInformativos };
};
