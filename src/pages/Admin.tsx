import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, FileText, Music, Filter, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserAudioFile } from '@/hooks/useUserAudioFiles';
import { UserManagement } from '@/components/UserManagement';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserNote {
  id: string;
  user_id: string;
  section_id: string;
  item_id: string;
  note: string;
  created_at: string;
  profiles?: { email: string };
}

interface AdminAudioFile extends UserAudioFile {
  profiles?: { email: string };
}

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  role: 'admin' | 'user';
}

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [audioFiles, setAudioFiles] = useState<AdminAudioFile[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de filtro
  const [showFilters, setShowFilters] = useState(false);
  const [filterUser, setFilterUser] = useState<string>('all');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');
  const [filterSearch, setFilterSearch] = useState<string>('');

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
      const [notesResult, audioFilesResult, profilesResult, rolesResult] = await Promise.all([
        supabase
          .from('script_notes')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('user_audio_files')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('profiles')
          .select('id, email, created_at, last_sign_in_at')
          .order('created_at', { ascending: false }),
        supabase
          .from('user_roles')
          .select('user_id, role')
      ]);

      if (notesResult.error) throw notesResult.error;
      if (audioFilesResult.error) throw audioFilesResult.error;
      if (profilesResult.error) throw profilesResult.error;
      if (rolesResult.error) throw rolesResult.error;

      // Create maps
      const profilesMap = new Map(
        profilesResult.data?.map(p => [p.id, p.email]) || []
      );

      const rolesMap = new Map(
        rolesResult.data?.filter(r => r.role === 'admin').map(r => [r.user_id, 'admin']) || []
      );

      // Enrich data
      const enrichedNotes = notesResult.data?.map(note => ({
        ...note,
        profiles: { email: profilesMap.get(note.user_id) || 'Email não encontrado' }
      })) || [];

      const enrichedAudioFiles = audioFilesResult.data?.map(audio => ({
        ...audio,
        profiles: { email: profilesMap.get(audio.user_id) || 'Email não encontrado' }
      })) || [];

      const enrichedUsers = profilesResult.data?.map(profile => ({
        ...profile,
        role: rolesMap.get(profile.id) || 'user'
      })) as UserProfile[] || [];

      setNotes(enrichedNotes);
      setAudioFiles(enrichedAudioFiles);
      setUsers(enrichedUsers);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilterUser('all');
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterSearch('');
  };

  const filterData = <T extends { user_id?: string; created_at: string; note?: string; title?: string }>(
    data: T[]
  ): T[] => {
    return data.filter(item => {
      // Filtro por usuário
      if (filterUser !== 'all' && item.user_id !== filterUser) {
        return false;
      }

      // Filtro por data
      if (filterStartDate) {
        const itemDate = new Date(item.created_at);
        const startDate = new Date(filterStartDate);
        if (itemDate < startDate) return false;
      }

      if (filterEndDate) {
        const itemDate = new Date(item.created_at);
        const endDate = new Date(filterEndDate);
        endDate.setHours(23, 59, 59);
        if (itemDate > endDate) return false;
      }

      // Filtro por texto
      if (filterSearch) {
        const searchLower = filterSearch.toLowerCase();
        const noteText = (item as any).note?.toLowerCase() || '';
        const titleText = (item as any).title?.toLowerCase() || '';
        return noteText.includes(searchLower) || titleText.includes(searchLower);
      }

      return true;
    });
  };

  const filteredNotes = filterData(notes);
  const filteredAudioFiles = filterData(audioFiles);

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gerenciamento</CardTitle>
                <CardDescription>Gerencie usuários e visualize dados</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>

            {showFilters && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Usuário</Label>
                    <Select value={filterUser} onValueChange={setFilterUser}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {users.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Buscar</Label>
                    <Input
                      placeholder="Buscar em anotações e títulos..."
                      value={filterSearch}
                      onChange={(e) => setFilterSearch(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Data Inicial</Label>
                    <Input
                      type="date"
                      value={filterStartDate}
                      onChange={(e) => setFilterStartDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Data Final</Label>
                    <Input
                      type="date"
                      value={filterEndDate}
                      onChange={(e) => setFilterEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="users">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="users">Usuários</TabsTrigger>
                <TabsTrigger value="notes">Anotações ({filteredNotes.length})</TabsTrigger>
                <TabsTrigger value="audio">Áudios ({filteredAudioFiles.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-4">
                <UserManagement users={users} onUserUpdated={loadData} />
              </TabsContent>

              <TabsContent value="notes" className="space-y-4">
                {filteredNotes.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma anotação encontrada
                  </p>
                ) : (
                  filteredNotes.map((note) => (
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

              <TabsContent value="audio" className="space-y-4">
                {filteredAudioFiles.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum áudio encontrado
                  </p>
                ) : (
                  filteredAudioFiles.map((audio) => (
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
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{new Date(audio.created_at).toLocaleString('pt-BR')}</span>
                        </div>
                        <audio controls className="w-full mt-3">
                          <source src={audio.file_url} type="audio/mpeg" />
                          Seu navegador não suporta o elemento de áudio.
                        </audio>
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
