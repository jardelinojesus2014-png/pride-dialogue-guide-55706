import { useState, useEffect } from 'react';
import { Star, Copy, Check, Sparkles, TrendingUp, Users } from 'lucide-react';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Card } from './ui/card';
import logoPrideGold from '@/assets/Logo_Pride-2.png';

interface GoogleReviewsSectionProps {
  darkMode: boolean;
  userViewMode?: boolean;
}

interface Review {
  id: string;
  reviewer_name: string;
  reviewer_photo_url: string | null;
  rating: number;
  comment: string;
  review_date: string;
  display_order: number;
}

interface ReviewSettings {
  review_link: string;
  total_reviews: number;
  average_rating: number;
}

export const GoogleReviewsSection = ({ darkMode, userViewMode = false }: GoogleReviewsSectionProps) => {
  const { isAdmin } = useIsAdmin();
  const effectiveIsAdmin = isAdmin && !userViewMode;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<ReviewSettings | null>(null);
  const [currentReview, setCurrentReview] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (reviews.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  const loadData = async () => {
    try {
      // Load reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('google_reviews')
        .select('*')
        .order('display_order', { ascending: true });

      if (reviewsError) throw reviewsError;
      
      // Load settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('google_review_settings')
        .select('*')
        .maybeSingle();

      if (settingsError) throw settingsError;

      setReviews(reviewsData || []);
      setSettings(settingsData);
      setLoading(false);
    } catch (error: any) {
      console.error('Error loading reviews:', error);
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (settings?.review_link) {
      navigator.clipboard.writeText(settings.review_link);
      setCopied(true);
      toast({
        title: 'Link copiado!',
        description: 'Cole e envie para seu cliente avaliar',
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentReview(index);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) return `Há ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`;
    if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} ${Math.floor(diffDays / 7) === 1 ? 'semana' : 'semanas'}`;
    if (diffDays < 365) return `Há ${Math.floor(diffDays / 30)} ${Math.floor(diffDays / 30) === 1 ? 'mês' : 'meses'}`;
    return `Há ${Math.floor(diffDays / 365)} ${Math.floor(diffDays / 365) === 1 ? 'ano' : 'anos'}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 rounded-2xl shadow-2xl p-8 sm:p-10 mb-6 border-4 border-yellow-500 overflow-hidden">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="text-white mt-4">Carregando avaliações...</p>
        </div>
      </section>
    );
  }

  if (!settings || reviews.length === 0) {
    return (
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 rounded-2xl shadow-2xl p-8 sm:p-10 mb-6 border-4 border-yellow-500 overflow-hidden">
        <div className="text-center py-12">
          <Star className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <p className="text-white text-lg font-semibold">Nenhuma avaliação configurada ainda</p>
          {effectiveIsAdmin && (
            <p className="text-white/70 mt-2">Configure as avaliações no painel administrativo</p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 rounded-2xl shadow-2xl p-8 sm:p-10 mb-6 border-4 border-yellow-500 overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-10 left-10 animate-pulse">
          <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
        </div>
        <div className="absolute top-20 right-20 animate-pulse" style={{ animationDelay: '1s' }}>
          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
        </div>
        <div className="absolute bottom-20 left-20 animate-pulse" style={{ animationDelay: '2s' }}>
          <Star className="w-7 h-7 text-yellow-400 fill-yellow-400" />
        </div>
        <div className="absolute bottom-10 right-10 animate-pulse" style={{ animationDelay: '3s' }}>
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        </div>
        <div className="absolute top-1/2 left-1/4 animate-pulse" style={{ animationDelay: '1.5s' }}>
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-pulse" style={{ animationDelay: '2.5s' }}>
          <Sparkles className="w-5 h-5 text-yellow-400" />
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-40 h-40 border-l-4 border-t-4 border-yellow-500 rounded-tl-2xl" />
      <div className="absolute bottom-0 right-0 w-40 h-40 border-r-4 border-b-4 border-yellow-500 rounded-br-2xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img 
              src={logoPrideGold} 
              alt="Pride Logo" 
              className="w-24 h-24 object-contain drop-shadow-2xl animate-pulse"
            />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black mb-4 text-white drop-shadow-lg">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500">
              {settings.average_rating.toFixed(1)} ESTRELAS
            </span>
            <span className="text-white"> no Google!</span>
          </h2>

          {/* Live Stats */}
          <div className="flex items-center justify-center gap-6 mb-6 flex-wrap">
            {/* Star rating display */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-pulse"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>

            {/* Total reviews counter */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-yellow-400">
              <Users className="w-6 h-6 text-yellow-400" />
              <div className="text-left">
                <p className="text-3xl font-black text-white">{settings.total_reviews}</p>
                <p className="text-xs text-yellow-300 font-semibold">Avaliações</p>
              </div>
            </div>

            {/* Trending indicator */}
            <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-green-400">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-sm font-bold text-green-300">Em Alta</span>
            </div>
          </div>

          <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto font-semibold">
            Nossos clientes aprovam! Veja o que dizem sobre a Pride Corretora
          </p>

          {/* CTA Button */}
          <Button
            onClick={handleCopyLink}
            size="lg"
            className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 hover:from-yellow-600 hover:via-yellow-500 hover:to-yellow-600 text-blue-950 font-black px-8 py-6 text-lg shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-110 border-4 border-white"
          >
            {copied ? (
              <>
                <Check className="w-6 h-6 mr-2" />
                Link Copiado!
              </>
            ) : (
              <>
                <Copy className="w-6 h-6 mr-2" />
                Copiar Link para Enviar ao Cliente
                <Star className="w-5 h-5 ml-2 fill-blue-950" />
              </>
            )}
          </Button>
        </div>

        {/* Reviews Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main Review Card */}
            <Card className="bg-white dark:bg-gray-900 border-4 border-yellow-400 shadow-2xl p-8 rounded-2xl transition-all duration-500 transform hover:scale-105">
              <div className="flex flex-col items-center text-center">
                {/* Avatar with Photo or Initials */}
                <div className="relative w-24 h-24 mb-4">
                  {reviews[currentReview].reviewer_photo_url ? (
                    <img 
                      src={reviews[currentReview].reviewer_photo_url} 
                      alt={reviews[currentReview].reviewer_name}
                      className="w-full h-full rounded-full object-cover border-4 border-yellow-400 shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white font-black text-2xl border-4 border-yellow-400 shadow-lg">
                      {getInitials(reviews[currentReview].reviewer_name)}
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-2 border-4 border-white shadow-lg">
                    <Star className="w-4 h-4 text-blue-900 fill-blue-900" />
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-2xl font-black text-primary mb-3">
                  {reviews[currentReview].reviewer_name}
                </h3>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(reviews[currentReview].rating)].map((_, i) => (
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
                  {formatDate(reviews[currentReview].review_date)}
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
                      ? 'w-12 h-4 bg-gradient-to-r from-yellow-400 to-yellow-500'
                      : 'w-4 h-4 bg-white/30 hover:bg-yellow-400/50'
                  }`}
                  aria-label={`Ver avaliação ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Google Badge */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-xl border-4 border-yellow-400">
              <div className="flex items-center gap-1">
                <span className="font-black text-4xl text-blue-900 dark:text-white">{settings.average_rating.toFixed(1)}</span>
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
                  Baseado em {settings.total_reviews} avaliações do Google
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>
    </section>
  );
};
