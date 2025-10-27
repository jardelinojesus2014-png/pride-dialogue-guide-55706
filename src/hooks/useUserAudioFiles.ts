import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface UserAudioFile {
  id: string;
  user_id: string;
  section_id: string;
  title: string;
  file_path: string;
  file_url: string;
  duration_seconds: number | null;
  created_at: string;
  updated_at: string;
}

export const useUserAudioFiles = (sectionId?: string) => {
  const { user } = useAuth();
  const [audioFiles, setAudioFiles] = useState<UserAudioFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAudioFiles();
    }
  }, [user, sectionId]);

  const loadAudioFiles = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('user_audio_files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (sectionId) {
        query = query.eq('section_id', sectionId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setAudioFiles(data || []);
    } catch (error: any) {
      console.error('Error loading audio files:', error);
      toast({
        title: 'Erro ao carregar áudios',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadAudioFile = async (
    sectionId: string,
    title: string,
    audioBlob: Blob,
    durationSeconds?: number
  ): Promise<UserAudioFile | null> => {
    if (!user) return null;

    try {
      const fileName = `${user.id}/${sectionId}/${Date.now()}.webm`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(fileName, audioBlob, {
          contentType: audioBlob.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('audio-files')
        .getPublicUrl(fileName);

      const { data, error } = await supabase
        .from('user_audio_files')
        .insert({
          user_id: user.id,
          section_id: sectionId,
          title,
          file_path: fileName,
          file_url: publicUrl,
          duration_seconds: durationSeconds,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Áudio salvo com sucesso!',
        description: `"${title}" foi adicionado à sua biblioteca.`,
      });

      await loadAudioFiles();
      return data;
    } catch (error: any) {
      console.error('Error uploading audio file:', error);
      toast({
        title: 'Erro ao salvar áudio',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteAudioFile = async (audioFileId: string) => {
    if (!user) return;

    try {
      const audioFile = audioFiles.find(f => f.id === audioFileId);
      if (!audioFile) return;

      const { error: storageError } = await supabase.storage
        .from('audio-files')
        .remove([audioFile.file_path]);

      if (storageError) throw storageError;

      const { error } = await supabase
        .from('user_audio_files')
        .delete()
        .eq('id', audioFileId);

      if (error) throw error;

      toast({
        title: 'Áudio excluído',
        description: 'O áudio foi removido com sucesso.',
      });

      await loadAudioFiles();
    } catch (error: any) {
      console.error('Error deleting audio file:', error);
      toast({
        title: 'Erro ao excluir áudio',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return {
    audioFiles,
    loading,
    uploadAudioFile,
    deleteAudioFile,
    refreshAudioFiles: loadAudioFiles,
  };
};
