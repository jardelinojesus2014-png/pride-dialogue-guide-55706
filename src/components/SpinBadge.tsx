import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface SpinBadgeProps {
  type: 'S' | 'P';
}

export const SpinBadge = ({ type }: SpinBadgeProps) => {
  const getTooltipContent = () => {
    if (type === 'S') {
      return {
        title: 'SITUAÇÃO',
        description: 'Perguntas sobre a situação atual do cliente para entender o contexto.'
      };
    }
    return {
      title: 'PROBLEMA',
      description: 'Perguntas sobre dificuldades, desafios ou insatisfações do cliente.'
    };
  };

  const { title, description } = getTooltipContent();

  const badge = type === 'S' ? (
    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-black text-sm shadow-lg border-2 border-blue-600 cursor-help">
      S
    </div>
  ) : (
    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-black text-sm shadow-lg border-2 border-orange-600 cursor-help">
      P
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="font-bold">{title}</p>
          <p className="text-sm">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
