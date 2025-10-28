import { ExternalLink, Globe } from 'lucide-react';
import { Button } from './ui/button';

interface WebsiteSectionProps {
  darkMode: boolean;
}

export const WebsiteSection = ({ darkMode }: WebsiteSectionProps) => {
  const websiteUrl = 'https://pridecorretora.com.br/';

  return (
    <section className="relative bg-gradient-to-br from-card via-card to-primary/5 rounded-2xl shadow-2xl p-8 sm:p-10 mb-6 border-2 border-primary/20 overflow-hidden">
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-yellow-500 rounded-tl-2xl" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-yellow-500 rounded-br-2xl" />
      <div className="absolute top-1/2 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-yellow-500 to-transparent transform -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-1 h-32 bg-gradient-to-b from-transparent via-yellow-500 to-transparent transform -translate-y-1/2" />
      
      <div className="relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-xl">
              <Globe className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-black text-primary mb-3">
            Visite Nosso Site
          </h2>
          <p className="text-foreground/80 text-lg mb-6 max-w-2xl mx-auto">
            Conheça mais sobre nossos serviços, soluções e tudo que a Pride Corretora pode oferecer para você
          </p>

          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary hover:to-primary text-white font-black px-8 py-6 text-lg shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 border-2 border-yellow-500"
            >
              <ExternalLink className="w-6 h-6 mr-3" />
              Acessar Site Oficial
              <span className="ml-2 text-2xl">→</span>
            </Button>
          </a>

          <p className="text-sm text-muted-foreground mt-4">
            {websiteUrl}
          </p>
        </div>

        {/* Website Preview */}
        <div className="max-w-5xl mx-auto mt-8">
          <div className="relative border-4 border-yellow-500 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/5 to-transparent p-2">
            <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
              {/* iframe Preview */}
              <div className="relative w-full bg-white" style={{ height: '500px' }}>
                <iframe
                  src={websiteUrl}
                  title="Pride Corretora Website"
                  className="w-full h-full border-0 rounded-lg"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  loading="lazy"
                />
                
                {/* Overlay para redirecionar cliques */}
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 cursor-pointer"
                  aria-label="Visitar site"
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              ✨ Clique na prévia acima para acessar o site completo
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
