import { usePurposeReflections } from '@/hooks/usePurposeReflections';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const PurposeReflectionsSection = () => {
  const { reflections, isLoading } = usePurposeReflections();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!reflections || reflections.length === 0) {
    return (
      <div className="text-center p-12 text-muted-foreground">
        <p className="text-lg">Nenhuma reflexão registrada ainda.</p>
        <p className="text-sm mt-2">As reflexões dos usuários aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-black text-primary mb-6">
        📝 Reflexões de Propósito dos Usuários
      </h2>

      <div className="grid gap-6">
        {reflections.map((reflection) => (
          <Card key={reflection.id} className="p-6 bg-gradient-to-br from-card to-card/50 border-2 border-primary/20">
            <div className="mb-4 pb-4 border-b border-primary/10">
              <p className="text-sm text-muted-foreground">
                Registrado em:{' '}
                {format(new Date(reflection.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                  locale: ptBR,
                })}
              </p>
              {reflection.updated_at !== reflection.created_at && (
                <p className="text-xs text-muted-foreground mt-1">
                  Última atualização:{' '}
                  {format(new Date(reflection.updated_at), "dd/MM/yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </p>
              )}
            </div>

            <div className="space-y-4">
              {reflection.why && (
                <div className="bg-orange-500/5 rounded-lg p-4 border-l-4 border-orange-500">
                  <h3 className="font-bold text-orange-600 mb-2 flex items-center gap-2">
                    💭 Qual o seu porquê?
                  </h3>
                  <p className="text-sm whitespace-pre-wrap">{reflection.why}</p>
                </div>
              )}

              {reflection.why_here && (
                <div className="bg-red-500/5 rounded-lg p-4 border-l-4 border-red-500">
                  <h3 className="font-bold text-red-600 mb-2 flex items-center gap-2">
                    🤔 Por que aqui?
                  </h3>
                  <p className="text-sm whitespace-pre-wrap">{reflection.why_here}</p>
                </div>
              )}

              {reflection.what_control && (
                <div className="bg-purple-500/5 rounded-lg p-4 border-l-4 border-purple-500">
                  <h3 className="font-bold text-purple-600 mb-2 flex items-center gap-2">
                    💡 O que está no seu controle?
                  </h3>
                  <p className="text-sm whitespace-pre-wrap">{reflection.what_control}</p>
                </div>
              )}

              {reflection.improve_what && (
                <div className="bg-blue-500/5 rounded-lg p-4 border-l-4 border-blue-500">
                  <h3 className="font-bold text-blue-600 mb-2 flex items-center gap-2">
                    📈 Em que você pode ser melhor?
                  </h3>
                  <p className="text-sm whitespace-pre-wrap">{reflection.improve_what}</p>
                </div>
              )}

              {reflection.strengths && (
                <div className="bg-green-500/5 rounded-lg p-4 border-l-4 border-green-500">
                  <h3 className="font-bold text-green-600 mb-2 flex items-center gap-2">
                    ⭐ Por que você? (Pontos fortes)
                  </h3>
                  <p className="text-sm whitespace-pre-wrap">{reflection.strengths}</p>
                </div>
              )}

              {reflection.what_today && (
                <div className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-purple-500/10 rounded-lg p-4 border-2 border-orange-500/30">
                  <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-purple-600 mb-2 flex items-center gap-2">
                    🎯 O que você precisa fazer HOJE?
                  </h3>
                  <p className="text-sm whitespace-pre-wrap font-medium">{reflection.what_today}</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
