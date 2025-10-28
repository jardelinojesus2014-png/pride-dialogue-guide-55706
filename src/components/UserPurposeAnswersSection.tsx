import { usePurposeReflections } from '@/hooks/usePurposeReflections';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface UserPurposeAnswersSectionProps {
  darkMode: boolean;
}

export const UserPurposeAnswersSection = ({ darkMode }: UserPurposeAnswersSectionProps) => {
  const { reflections, saveReflection, isSaving, isLoading } = usePurposeReflections();
  
  const [answers, setAnswers] = useState({
    why: '',
    why_here: '',
    what_control: '',
    improve_what: '',
    strengths: '',
    what_today: '',
  });

  useEffect(() => {
    if (reflections && reflections.length > 0) {
      const latest = reflections[0];
      setAnswers({
        why: latest.why || '',
        why_here: latest.why_here || '',
        what_control: latest.what_control || '',
        improve_what: latest.improve_what || '',
        strengths: latest.strengths || '',
        what_today: latest.what_today || '',
      });
    }
  }, [reflections]);

  const handleSave = () => {
    saveReflection(answers);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" id="purpose-answers">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-accent mb-4">
          📝 Suas Reflexões de Propósito
        </h2>
        <p className="text-muted-foreground text-lg">
          Registre e revise suas respostas quando quiser
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="p-6 bg-card/50 backdrop-blur border-2 border-primary/20">
          <label className="block text-foreground font-bold mb-2 text-lg">
            💭 Qual o seu porquê?
          </label>
          <Textarea
            value={answers.why}
            onChange={(e) => setAnswers({ ...answers, why: e.target.value })}
            placeholder="Seu objetivo, seu propósito..."
            className="min-h-[120px]"
          />
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur border-2 border-primary/20">
          <label className="block text-foreground font-bold mb-2 text-lg">
            🤔 Por que aqui?
          </label>
          <Textarea
            value={answers.why_here}
            onChange={(e) => setAnswers({ ...answers, why_here: e.target.value })}
            placeholder="Por que este lugar faz sentido para você?"
            className="min-h-[120px]"
          />
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur border-2 border-primary/20">
          <label className="block text-foreground font-bold mb-2 text-lg">
            💡 O que está no seu controle?
          </label>
          <Textarea
            value={answers.what_control}
            onChange={(e) => setAnswers({ ...answers, what_control: e.target.value })}
            placeholder="O que você pode mudar e influenciar..."
            className="min-h-[120px]"
          />
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur border-2 border-primary/20">
          <label className="block text-foreground font-bold mb-2 text-lg">
            📈 Em que você pode ser melhor?
          </label>
          <Textarea
            value={answers.improve_what}
            onChange={(e) => setAnswers({ ...answers, improve_what: e.target.value })}
            placeholder="Onde você quer evoluir..."
            className="min-h-[120px]"
          />
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur border-2 border-primary/20">
          <label className="block text-foreground font-bold mb-2 text-lg">
            ⭐ Seus pontos fortes
          </label>
          <Textarea
            value={answers.strengths}
            onChange={(e) => setAnswers({ ...answers, strengths: e.target.value })}
            placeholder="Por que você? O que te torna único..."
            className="min-h-[120px]"
          />
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur border-2 border-primary/20">
          <label className="block text-foreground font-bold mb-2 text-lg">
            🎯 O que você precisa fazer HOJE?
          </label>
          <Textarea
            value={answers.what_today}
            onChange={(e) => setAnswers({ ...answers, what_today: e.target.value })}
            placeholder="O que você PRECISA fazer HOJE para CONQUISTAR seus objetivos..."
            className="min-h-[120px]"
          />
        </Card>
      </div>

      <div className="flex justify-center pt-6">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-accent hover:opacity-90 text-white font-black px-12 py-6 text-lg"
        >
          {isSaving ? 'Salvando...' : 'Salvar Minhas Reflexões 🚀'}
        </Button>
      </div>
    </div>
  );
};
