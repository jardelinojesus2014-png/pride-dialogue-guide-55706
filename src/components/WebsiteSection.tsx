import { ExternalLink, Globe, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface WebsiteSectionProps {
  darkMode: boolean;
}

export const WebsiteSection = ({ darkMode }: WebsiteSectionProps) => {
  const websiteUrl = 'https://pridecorretora.com.br/';

  return (
    <section className="p-5 sm:p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-3">
          <Globe className="w-7 h-7 text-accent" />
        </div>

        <h3 className="text-xl font-bold text-primary mb-1">Visite nosso site</h3>
        <p className="text-muted-foreground text-sm mb-4 max-w-xl mx-auto">
          Conheça mais sobre nossos serviços e soluções
        </p>

        <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-block mb-2">
          <Button size="lg" className="gap-2">
            <ExternalLink className="w-4 h-4" />
            Acessar site oficial
            <ArrowRight className="w-4 h-4" />
          </Button>
        </a>

        <p className="text-xs text-muted-foreground">{websiteUrl}</p>
      </div>

      {/* Prévia do site */}
      <div className="max-w-5xl mx-auto mt-6">
        <div className="rounded-2xl overflow-hidden border border-border shadow-sm bg-card">
          <div className="relative w-full bg-white" style={{ height: '500px' }}>
            <iframe
              src={websiteUrl}
              title="Pride Corretora"
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              loading="lazy"
            />
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          ✨ Explore a prévia acima ou use o botão para acessar o site completo
        </p>
      </div>
    </section>
  );
};
