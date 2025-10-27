import { useState } from 'react';
import { Shield, ShieldOff, Calendar } from 'lucide-react';
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
  const [actionType, setActionType] = useState<'promote' | 'demote' | null>(null);

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
      } else {
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

  const openDialog = (user: UserProfile, action: 'promote' | 'demote') => {
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
                  <div className="ml-4">
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
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      <AlertDialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'promote' ? 'Promover a Admin' : 'Remover Admin'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'promote'
                ? `Tem certeza que deseja tornar ${selectedUser?.email} um administrador? Este usuário terá acesso total ao sistema.`
                : `Tem certeza que deseja remover as permissões de administrador de ${selectedUser?.email}?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRoleChange}
              className={actionType === 'demote' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
