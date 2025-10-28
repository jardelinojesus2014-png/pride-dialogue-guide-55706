import { useAllPurposeReflections } from '@/hooks/usePurposeReflections';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const UserPurposeReflections = () => {
  const { reflections, isLoading } = useAllPurposeReflections();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!reflections || reflections.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhuma reflexão registrada ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-primary mb-2">
          Reflexões de Propósito dos Usuários
        </h2>
        <p className="text-muted-foreground">
          Acompanhe as reflexões e objetivos compartilhados pelos usuários.
        </p>
      </div>

      <div className="grid gap-6">
        {reflections.map((reflection: any) => (
          <Card key={reflection.id} className="p-6 bg-card border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-lg text-primary">
                  {reflection.profiles?.email || 'Usuário não identificado'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(reflection.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {reflection.why && (
                <div>
                  <p className="font-bold text-sm text-primary mb-1">💭 Qual o seu porquê?</p>
                  <p className="text-foreground whitespace-pre-wrap">{reflection.why}</p>
                </div>
              )}

              {reflection.why_here && (
                <div>
                  <p className="font-bold text-sm text-primary mb-1">🤔 Por que aqui?</p>
                  <p className="text-foreground whitespace-pre-wrap">{reflection.why_here}</p>
                </div>
              )}

              {reflection.what_control && (
                <div>
                  <p className="font-bold text-sm text-primary mb-1">💡 O que está no seu controle?</p>
                  <p className="text-foreground whitespace-pre-wrap">{reflection.what_control}</p>
                </div>
              )}

              {reflection.improve_what && (
                <div>
                  <p className="font-bold text-sm text-primary mb-1">📈 Em que você pode ser melhor?</p>
                  <p className="text-foreground whitespace-pre-wrap">{reflection.improve_what}</p>
                </div>
              )}

              {reflection.strengths && (
                <div>
                  <p className="font-bold text-sm text-primary mb-1">⭐ Seus pontos fortes</p>
                  <p className="text-foreground whitespace-pre-wrap">{reflection.strengths}</p>
                </div>
              )}

              {reflection.what_today && (
                <div>
                  <p className="font-bold text-sm text-primary mb-1">🎯 O que você precisa fazer HOJE?</p>
                  <p className="text-foreground whitespace-pre-wrap">{reflection.what_today}</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
