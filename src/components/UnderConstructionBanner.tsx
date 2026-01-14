import { Construction } from 'lucide-react';

export const UnderConstructionBanner = () => {
  return (
    <div className="bg-card rounded-lg shadow-md p-4 mb-4 text-center border border-border">
      <div className="flex flex-col items-center gap-2">
        <div className="inline-block bg-gradient-to-r from-orange-500 to-red-600 rounded-full p-3 shadow-lg">
          <Construction className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-black text-primary flex items-center gap-2">
          🚧 Em Construção
        </h3>
        <p className="text-sm text-muted-foreground">
          Essa seção está sendo desenvolvida e enriquecida semanalmente
        </p>
      </div>
    </div>
  );
};
