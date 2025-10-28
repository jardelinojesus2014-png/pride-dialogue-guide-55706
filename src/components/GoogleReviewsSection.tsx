import { useState, useEffect } from 'react';
import { Star, ExternalLink, Sparkles, Award, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface GoogleReviewsSectionProps {
  darkMode: boolean;
}

interface Review {
  id: number;
  name: string;
  rating: 5;
  comment: string;
  date: string;
  avatar: string;
}

// Dados mockados - substituir por dados reais da API do Google Reviews depois
const reviews: Review[] = [
  {
    id: 1,
    name: "Maria Silva",
    rating: 5,
    comment: "Excelente atendimento! A Pride Corretora superou todas as minhas expectativas. Profissionais muito competentes e atenciosos.",
    date: "Há 2 semanas",
    avatar: "MS"
  },
  {
    id: 2,
    name: "João Santos",
    rating: 5,
    comment: "Melhor corretora que já contratei! Resolveram todos os meus problemas com plano de saúde de forma rápida e eficiente.",
    date: "Há 1 mês",
    avatar: "JS"
  },
  {
    id: 3,
    name: "Ana Paula Costa",
    rating: 5,
    comment: "Equipe incrível! Sempre dispostos a ajudar e encontrar as melhores soluções. Recomendo de olhos fechados!",
    date: "Há 3 semanas",
    avatar: "AC"
  },
  {
    id: 4,
    name: "Carlos Oliveira",
    rating: 5,
    comment: "Profissionalismo e dedicação incomparáveis! A Pride realmente se preocupa com o cliente. Nota 10!",
    date: "Há 2 meses",
    avatar: "CO"
  },
  {
    id: 5,
    name: "Fernanda Lima",
    rating: 5,
    comment: "Simplesmente perfeito! Conseguiram um plano excelente com preço justo. Gratidão por todo suporte!",
    date: "Há 1 semana",
    avatar: "FL"
  }
];

export const GoogleReviewsSection = ({ darkMode }: GoogleReviewsSectionProps) => {
  const [currentReview, setCurrentReview] = useState(0);
  const googleReviewUrl = "https://g.page/r/YOUR_GOOGLE_PLACE_ID/review"; // Substituir pelo link real

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentReview(index);
  };

  return (
    <section className="relative bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 dark:from-yellow-950/20 dark:via-orange-950/20 dark:to-amber-950/20 rounded-2xl shadow-2xl p-8 sm:p-10 mb-6 border-4 border-yellow-500 overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 animate-pulse">
          <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
        </div>
        <div className="absolute top-20 right-20 animate-pulse delay-100">
          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
        </div>
        <div className="absolute bottom-20 left-20 animate-pulse delay-200">
          <Star className="w-7 h-7 text-yellow-400 fill-yellow-400" />
        </div>
        <div className="absolute bottom-10 right-10 animate-pulse delay-300">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        </div>
        <div className="absolute top-1/2 left-1/4 animate-pulse delay-150">
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-pulse delay-250">
          <Sparkles className="w-5 h-5 text-yellow-400" />
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-40 h-40 border-l-4 border-t-4 border-yellow-600 rounded-tl-2xl" />
      <div className="absolute bottom-0 right-0 w-40 h-40 border-r-4 border-b-4 border-yellow-600 rounded-br-2xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Award className="w-12 h-12 text-yellow-600 animate-bounce" />
            <TrendingUp className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600">
              5 ESTRELAS
            </span>
            <span className="text-primary"> no Google!</span>
          </h2>

          {/* Star rating display */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500 fill-yellow-500 animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>

          <p className="text-foreground/80 text-lg mb-6 max-w-2xl mx-auto font-semibold">
            Nossos clientes aprovam! Veja o que dizem sobre a Pride Corretora
          </p>

          {/* CTA Button */}
          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mb-8"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white font-black px-8 py-6 text-lg shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-110 border-4 border-white animate-pulse"
            >
              <Star className="w-6 h-6 mr-2 fill-white" />
              Deixe sua Avaliação
              <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </div>

        {/* Reviews Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main Review Card */}
            <Card className="bg-white dark:bg-gray-900 border-4 border-yellow-400 shadow-2xl p-8 rounded-2xl transition-all duration-500 transform hover:scale-105">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-black text-2xl mb-4 border-4 border-yellow-400 shadow-lg">
                  {reviews[currentReview].avatar}
                </div>

                {/* Name */}
                <h3 className="text-2xl font-black text-primary mb-3">
                  {reviews[currentReview].name}
                </h3>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-foreground/90 text-lg leading-relaxed mb-4 italic">
                  "{reviews[currentReview].comment}"
                </p>

                {/* Date */}
                <p className="text-muted-foreground text-sm font-semibold">
                  {reviews[currentReview].date}
                </p>
              </div>
            </Card>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-3 mt-6">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`transition-all duration-300 rounded-full ${
                    currentReview === index
                      ? 'w-12 h-4 bg-gradient-to-r from-yellow-500 to-orange-500'
                      : 'w-4 h-4 bg-gray-300 dark:bg-gray-600 hover:bg-yellow-400'
                  }`}
                  aria-label={`Ver avaliação ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Google Badge */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg border-2 border-yellow-400">
              <div className="flex items-center gap-1">
                <span className="font-black text-4xl text-primary">5.0</span>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground font-semibold">
                  Baseado em avaliações do Google
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
          <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse delay-150" />
          <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse delay-300" />
        </div>
      </div>
    </section>
  );
};
