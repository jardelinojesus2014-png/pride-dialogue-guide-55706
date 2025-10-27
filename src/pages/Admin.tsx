import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, FileText, CheckSquare, Music, Play, Pause } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserAudioFile } from '@/hooks/useUserAudioFiles';

interface UserNote {
  id: string;
  user_id: string;
  section_id: string;
  item_id: string;
  note: string;
  created_at: string;
  profiles?: { email: string };
}

interface UserCheckedItem {
  id: string;
  user_id: string;
  section_id: string;
  item_id: string;
  is_checked: boolean;
  created_at: string;
  profiles?: { email: string };
}

interface AdminAudioFile extends UserAudioFile {
  profiles?: { email: string };
}

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [checkedItems, setCheckedItems] = useState<UserCheckedItem[]>([]);
  const [audioFiles, setAudioFiles] = useState<AdminAudioFile[]>([]);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    try {
      // Load notes, checked items, and audio files
      const [notesResult, checkedItemsResult, audioFilesResult, profilesResult] = await Promise.all([
        supabase
          .from('script_notes')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('script_checked_items')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('user_audio_files')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('profiles')
          .select('id, email')
      ]);

      if (notesResult.error) throw notesResult.error;
      if (checkedItemsResult.error) throw checkedItemsResult.error;
      if (audioFilesResult.error) throw audioFilesResult.error;
      if (profilesResult.error) throw profilesResult.error;

      // Create a map of user_id to email
      const profilesMap = new Map(
        profilesResult.data?.map(p => [p.id, p.email]) || []
      );

      // Enrich notes with email
      const enrichedNotes = notesResult.data?.map(note => ({
        ...note,
        profiles: { email: profilesMap.get(note.user_id) || 'Email não encontrado' }
      })) || [];

      // Enrich checked items with email
      const enrichedCheckedItems = checkedItemsResult.data?.map(item => ({
        ...item,
        profiles: { email: profilesMap.get(item.user_id) || 'Email não encontrado' }
      })) || [];

      // Enrich audio files with email
      const enrichedAudioFiles = audioFilesResult.data?.map(audio => ({
        ...audio,
        profiles: { email: profilesMap.get(audio.user_id) || 'Email não encontrado' }
      })) || [];

      setNotes(enrichedNotes);
      setCheckedItems(enrichedCheckedItems);
      setAudioFiles(enrichedAudioFiles);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAudioPlay = (audioFile: AdminAudioFile) => {
    const audio = new Audio(audioFile.file_url);
    
    if (playingAudioId === audioFile.id) {
      audio.pause();
      setPlayingAudioId(null);
    } else {
      audio.play();
      setPlayingAudioId(audioFile.id);
      audio.onended = () => setPlayingAudioId(null);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const uniqueUsers = Array.from(
    new Set([...notes.map(n => n.user_id), ...checkedItems.map(c => c.user_id)])
  );

  return (
    <div className="min-h-screen bg-gradient-subtle p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-black text-foreground">Painel Administrativo</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueUsers.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Anotações</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notes.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Itens Marcados</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {checkedItems.filter(item => item.is_checked).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Áudios Gravados</CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{audioFiles.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados dos Usuários</CardTitle>
            <CardDescription>Visualize todas as anotações e itens marcados</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="notes">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="notes">Anotações</TabsTrigger>
                <TabsTrigger value="checked">Itens Marcados</TabsTrigger>
                <TabsTrigger value="audio">Áudios</TabsTrigger>
              </TabsList>

              <TabsContent value="notes" className="space-y-4">
                {notes.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhuma anotação encontrada</p>
                ) : (
                  notes.map((note) => (
                    <Card key={note.id}>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">
                          {note.profiles?.email || 'Email não encontrado'}
                        </CardTitle>
                        <CardDescription>
                          Seção: {note.section_id} | Item: {note.item_id}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm whitespace-pre-wrap">{note.note}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(note.created_at).toLocaleString('pt-BR')}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="checked" className="space-y-4">
                {checkedItems.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhum item marcado encontrado</p>
                ) : (
                  checkedItems
                    .filter(item => item.is_checked)
                    .map((item) => (
                      <Card key={item.id}>
                        <CardHeader>
                          <CardTitle className="text-sm font-medium">
                            {item.profiles?.email || 'Email não encontrado'}
                          </CardTitle>
                          <CardDescription>
                            Seção: {item.section_id} | Item: {item.item_id}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.created_at).toLocaleString('pt-BR')}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                )}
              </TabsContent>

              <TabsContent value="audio" className="space-y-4">
                {audioFiles.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhum áudio encontrado</p>
                ) : (
                  audioFiles.map((audio) => (
                    <Card key={audio.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-sm font-medium">
                              {audio.title}
                            </CardTitle>
                            <CardDescription>
                              {audio.profiles?.email || 'Email não encontrado'}
                            </CardDescription>
                            <CardDescription className="text-xs mt-1">
                              Seção: {audio.section_id}
                            </CardDescription>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleAudioPlay(audio)}
                          >
                            {playingAudioId === audio.id ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Duração: {formatDuration(audio.duration_seconds)}</span>
                          <span>•</span>
                          <span>{new Date(audio.created_at).toLocaleString('pt-BR')}</span>
                        </div>
                        <a 
                          href={audio.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-accent hover:underline mt-2 inline-block"
                        >
                          Abrir arquivo
                        </a>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
