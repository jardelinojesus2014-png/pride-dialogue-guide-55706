import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FolderArte {
  id: string;
  title: string;
  description: string | null;
  operadora_name: string;
  operadora_logo_url: string | null;
  banner_image_url: string | null;
  banner_image_path: string | null;
  file_url: string;
  file_path: string | null;
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

export const useFolderArtes = (folderId?: string) => {
  const [artes, setArtes] = useState<FolderArte[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArtes = async () => {
    try {
      let query = supabase
        .from('folder_artes')
        .select('*')
        .order('created_at', { ascending: false });

      if (folderId) {
        query = query.eq('folder_id', folderId);
      } else {
        query = query.is('folder_id', null);
      }

      const { data, error } = await query;
      if (error) throw error;
      setArtes((data || []) as FolderArte[]);
    } catch (error) {
      console.error('Error fetching folder artes:', error);
      toast.error('Erro ao carregar artes da pasta');
    } finally {
      setLoading(false);
    }
  };

  const addArte = async (item: {
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
      let file_url = 'placeholder';
      let file_path: string | null = null;

      if (item.bannerFile) {
        const ext = item.bannerFile.name.split('.').pop();
        const path = `folder_artes/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from('campaigns').upload(path, item.bannerFile);
        if (uploadErr) throw uploadErr;
        const { data: { publicUrl } } = supabase.storage.from('campaigns').getPublicUrl(path);
        banner_image_url = publicUrl;
        banner_image_path = path;
        file_url = publicUrl;
        file_path = path;
      }

      if (item.operadoraLogoFile) {
        const ext = item.operadoraLogoFile.name.split('.').pop();
        const path = `folder_artes/logos/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from('campaigns').upload(path, item.operadoraLogoFile);
        if (uploadErr) throw uploadErr;
        const { data: { publicUrl } } = supabase.storage.from('campaigns').getPublicUrl(path);
        operadora_logo_url = publicUrl;
      }

      const { error } = await supabase.from('folder_artes').insert({
        title: item.title,
        description: item.description || null,
        operadora_name: item.operadora_name,
        operadora_logo_url,
        banner_image_url,
        banner_image_path,
        file_url,
        file_path,
        status: item.status,
        campaign_type: item.campaign_type,
        start_date: item.start_date || null,
        end_date: item.end_date || null,
        tags: item.tags,
        details_content: item.details_content || null,
        display_order: artes.length,
        folder_id: folderId || null,
      });

      if (error) throw error;
      toast.success('Arte adicionada à pasta!');
      fetchArtes();
    } catch (error) {
      console.error('Error adding folder arte:', error);
      toast.error('Erro ao adicionar arte');
    }
  };

  const updateArte = async (id: string, updates: Partial<FolderArte>) => {
    try {
      const { error } = await supabase.from('folder_artes').update(updates).eq('id', id);
      if (error) throw error;
      toast.success('Arte atualizada!');
      fetchArtes();
    } catch (error) {
      console.error('Error updating folder arte:', error);
      toast.error('Erro ao atualizar arte');
    }
  };

  const deleteArte = async (id: string, bannerPath: string | null) => {
    try {
      if (bannerPath) {
        await supabase.storage.from('campaigns').remove([bannerPath]);
      }
      const { error } = await supabase.from('folder_artes').delete().eq('id', id);
      if (error) throw error;
      toast.success('Arte removida!');
      fetchArtes();
    } catch (error) {
      console.error('Error deleting folder arte:', error);
      toast.error('Erro ao remover arte');
    }
  };

  const addCreativeFiles = async (arteId: string, files: File[]) => {
    try {
      const item = artes.find(c => c.id === arteId);
      if (!item) return;

      const newUrls = [...(item.creative_file_urls || [])];
      const newPaths = [...(item.creative_file_paths || [])];
      const newNames = [...(item.creative_file_names || [])];

      for (const file of files) {
        const path = `folder_artes/creatives/${arteId}/${Date.now()}_${file.name}`;
        const { error: uploadErr } = await supabase.storage.from('campaigns').upload(path, file);
        if (uploadErr) throw uploadErr;
        const { data: { publicUrl } } = supabase.storage.from('campaigns').getPublicUrl(path);
        newUrls.push(publicUrl);
        newPaths.push(path);
        newNames.push(file.name);
      }

      const { error } = await supabase.from('folder_artes').update({
        creative_file_urls: newUrls,
        creative_file_paths: newPaths,
        creative_file_names: newNames,
      }).eq('id', arteId);

      if (error) throw error;
      toast.success('Criativos adicionados!');
      fetchArtes();
    } catch (error) {
      console.error('Error adding creatives:', error);
      toast.error('Erro ao adicionar criativos');
    }
  };

  useEffect(() => {
    fetchArtes();
  }, []);

  return { artes, loading, addArte, updateArte, deleteArte, addCreativeFiles, refetch: fetchArtes };
};
