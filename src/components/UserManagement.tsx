import { useState } from 'react';
import { Shield, ShieldOff, Calendar, Trash2, KeyRound, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  role: 'admin' | 'user';
}

interface UserManagementProps {
  users: UserProfile[];
  onUserUpdated: () => void;
}

export const UserManagement = ({ users, onUserUpdated }: UserManagementProps) => {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [actionType, setActionType] = useState<'promote' | 'demote' | 'delete' | null>(null);
  const [resetingPasswordFor, setResetingPasswordFor] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState(false);

  const handleRoleChange = async () => {
    if (!selectedUser) return;

    try {
      if (actionType === 'promote') {
        // Adicionar role de admin
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: selectedUser.id, role: 'admin' });

        if (error) throw error;

        toast({
          title: 'Usuário promovido',
          description: `${selectedUser.email} agora é administrador.`,
        });
      } else if (actionType === 'demote') {
        // Remover role de admin
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', selectedUser.id)
          .eq('role', 'admin');

        if (error) throw error;

        toast({
          title: 'Usuário rebaixado',
          description: `${selectedUser.email} não é mais administrador.`,
        });
      }

      onUserUpdated();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar o papel do usuário.',
        variant: 'destructive',
      });
    } finally {
      setSelectedUser(null);
      setActionType(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setDeletingUser(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionData.session?.access_token}`,
          },
          body: JSON.stringify({ userId: selectedUser.id }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao excluir usuário');
      }

      toast({
        title: 'Usuário excluído',
        description: `${selectedUser.email} foi removido do sistema.`,
      });

      onUserUpdated();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Erro ao excluir',
        description: error.message || 'Não foi possível excluir o usuário.',
        variant: 'destructive',
      });
    } finally {
      setDeletingUser(false);
      setSelectedUser(null);
      setActionType(null);
    }
  };

  const handleResetPassword = async (user: UserProfile) => {
    setResetingPasswordFor(user.id);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      toast({
        title: 'E-mail enviado',
        description: `Um link de redefinição de senha foi enviado para ${user.email}.`,
      });
    } catch (error: any) {
      console.error('Error sending reset password email:', error);
      toast({
        title: 'Erro ao enviar e-mail',
        description: error.message || 'Não foi possível enviar o e-mail de redefinição.',
        variant: 'destructive',
      });
    } finally {
      setResetingPasswordFor(null);
    }
  };

  const openDialog = (user: UserProfile, action: 'promote' | 'demote' | 'delete') => {
    setSelectedUser(user);
    setActionType(action);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDialogContent = () => {
    if (actionType === 'delete') {
      return {
        title: 'Excluir Usuário',
        description: `Tem certeza que deseja excluir permanentemente ${selectedUser?.email}? Esta ação não pode ser desfeita.`,
        buttonClass: 'bg-destructive hover:bg-destructive/90',
      };
    }
    if (actionType === 'promote') {
      return {
        title: 'Promover a Admin',
        description: `Tem certeza que deseja tornar ${selectedUser?.email} um administrador? Este usuário terá acesso total ao sistema.`,
        buttonClass: '',
      };
    }
    return {
      title: 'Remover Admin',
      description: `Tem certeza que deseja remover as permissões de administrador de ${selectedUser?.email}?`,
      buttonClass: 'bg-destructive hover:bg-destructive/90',
    };
  };

  const dialogContent = getDialogContent();

  return (
    <>
      <div className="space-y-4">
        {users.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum usuário encontrado
          </p>
        ) : (
          users.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      {user.email}
                      {user.role === 'admin' && (
                        <Shield className="w-4 h-4 text-primary" />
                      )}
                    </CardTitle>
                    <CardDescription className="text-xs mt-2 space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Cadastro: {formatDate(user.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Último acesso: {formatDate(user.last_sign_in_at)}</span>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="ml-4 flex flex-col gap-2">
                    <div className="flex gap-2">
                      {user.role === 'admin' ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDialog(user, 'demote')}
                        >
                          <ShieldOff className="w-4 h-4 mr-2" />
                          Remover Admin
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => openDialog(user, 'promote')}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Tornar Admin
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResetPassword(user)}
                        disabled={resetingPasswordFor === user.id}
                      >
                        {resetingPasswordFor === user.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <KeyRound className="w-4 h-4 mr-2" />
                        )}
                        Reiniciar Senha
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => openDialog(user, 'delete')}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      <AlertDialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogContent.title}</AlertDialogTitle>
            <AlertDialogDescription>{dialogContent.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingUser}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={actionType === 'delete' ? handleDeleteUser : handleRoleChange}
              className={dialogContent.buttonClass}
              disabled={deletingUser}
            >
              {deletingUser ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Confirmar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
