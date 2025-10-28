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
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg animate-pulse">
              <Globe className="w-7 h-7 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-black text-primary mb-2">
            Visite Nosso Site
          </h2>
          <p className="text-foreground/70 text-sm sm:text-base mb-4 max-w-xl mx-auto">
            Conheça mais sobre nossos serviços e soluções
          </p>

          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mb-2"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary hover:to-primary text-white font-black px-6 py-4 text-base shadow-xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 border-2 border-yellow-500"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Acessar Site Oficial
              <span className="ml-2 text-xl">→</span>
            </Button>
          </a>

          <p className="text-xs text-muted-foreground">
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
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              ✨ Explore a prévia acima ou use o botão para acessar o site completo
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
