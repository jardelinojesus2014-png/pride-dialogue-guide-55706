import { useState, useEffect } from 'react';
import { Star, Copy, Check, Sparkles, Award, TrendingUp, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import logoPride from '@/assets/Logo_Pride-2.png';

interface GoogleReviewsSectionProps {
  darkMode: boolean;
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

export const GoogleReviewsSection = ({ darkMode }: GoogleReviewsSectionProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<ReviewSettings | null>(null);
  const [currentReview, setCurrentReview] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    
    // Realtime subscription
    const channel = supabase
      .channel('google-reviews-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'google_reviews'
        },
        () => loadData()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'google_review_settings'
        },
        () => loadData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
        .order('display_order', { ascending: true })
        .order('review_date', { ascending: false });

      if (reviewsError) throw reviewsError;
      setReviews(reviewsData || []);

      // Load settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('google_review_settings')
        .select('*')
        .maybeSingle();

      if (settingsError) throw settingsError;
      setSettings(settingsData);
    } catch (error: any) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (settings?.review_link) {
      navigator.clipboard.writeText(settings.review_link);
      setCopied(true);
      toast({
        title: 'Link copiado!',
        description: 'Envie para seus clientes avaliarem',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentReview(index);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <section className="bg-card rounded-2xl shadow-xl p-8 mb-6">
        <div className="text-center text-muted-foreground">Carregando avaliações...</div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="bg-card rounded-2xl shadow-xl p-8 mb-6">
        <div className="text-center text-muted-foreground">
          Nenhuma avaliação cadastrada ainda
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
        <div className="absolute top-20 right-20 animate-pulse" style={{ animationDelay: '100ms' }}>
          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
        </div>
        <div className="absolute bottom-20 left-20 animate-pulse" style={{ animationDelay: '200ms' }}>
          <Star className="w-7 h-7 text-yellow-400 fill-yellow-400" />
        </div>
        <div className="absolute bottom-10 right-10 animate-pulse" style={{ animationDelay: '300ms' }}>
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        </div>
        <div className="absolute top-1/2 left-1/4 animate-pulse" style={{ animationDelay: '150ms' }}>
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-pulse" style={{ animationDelay: '250ms' }}>
          <Sparkles className="w-5 h-5 text-yellow-400" />
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-40 h-40 border-l-4 border-t-4 border-yellow-400 rounded-tl-2xl opacity-50" />
      <div className="absolute bottom-0 right-0 w-40 h-40 border-r-4 border-b-4 border-yellow-400 rounded-br-2xl opacity-50" />

      <div className="relative z-10">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <img src={logoPride} alt="Pride" className="w-16 h-16 object-contain drop-shadow-2xl animate-pulse" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black mb-3 text-white drop-shadow-lg">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400">
              5 ESTRELAS
            </span>
            <span className="text-yellow-400"> no Google!</span>
          </h2>

          {/* Real-time Stats */}
          {settings && (
            <div className="flex items-center justify-center gap-6 mb-6 flex-wrap">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-yellow-400">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-black text-xl">{settings.total_reviews}</span>
                  <span className="text-yellow-300 text-sm">Avaliações</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-yellow-400">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-black text-xl">{settings.average_rating.toFixed(1)}</span>
                  <span className="text-yellow-300 text-sm">Média</span>
                </div>
              </div>
            </div>
          )}

          {/* Star rating display */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400 fill-yellow-400 drop-shadow-lg"
                style={{ 
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  animationDelay: `${i * 100}ms` 
                }}
              />
            ))}
          </div>

          <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto font-semibold">
            Nossos clientes aprovam! Veja o que dizem sobre a Pride Corretora
          </p>

          {/* CTA Button - Copy Link */}
          {settings?.review_link && (
            <Button
              onClick={handleCopyLink}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 hover:from-yellow-600 hover:via-yellow-500 hover:to-yellow-600 text-blue-950 font-black px-8 py-6 text-lg shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-110 border-4 border-white mb-8"
            >
              {copied ? (
                <>
                  <Check className="w-6 h-6 mr-2" />
                  Link Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-6 h-6 mr-2" />
                  Copiar Link para Avaliar
                  <Star className="w-5 h-5 ml-2 fill-blue-950" />
                </>
              )}
            </Button>
          )}
        </div>

        {/* Reviews Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main Review Card */}
            <Card className="bg-white dark:bg-gray-900 border-4 border-yellow-400 shadow-2xl p-8 rounded-2xl transition-all duration-500 transform hover:scale-105">
              <div className="flex flex-col items-center text-center">
                {/* Avatar with Photo or Initials */}
                {reviews[currentReview].reviewer_photo_url ? (
                  <img
                    src={reviews[currentReview].reviewer_photo_url}
                    alt={reviews[currentReview].reviewer_name}
                    className="w-24 h-24 rounded-full border-4 border-yellow-400 shadow-lg mb-4 object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white font-black text-3xl mb-4 border-4 border-yellow-400 shadow-lg">
                    {getInitials(reviews[currentReview].reviewer_name)}
                  </div>
                )}

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
                  {new Date(reviews[currentReview].review_date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </Card>

            {/* Navigation Dots */}
            {reviews.length > 1 && (
              <div className="flex justify-center gap-3 mt-6">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`transition-all duration-300 rounded-full ${
                      currentReview === index
                        ? 'w-12 h-4 bg-gradient-to-r from-yellow-400 to-yellow-500'
                        : 'w-4 h-4 bg-white/30 hover:bg-yellow-400'
                    }`}
                    aria-label={`Ver avaliação ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Google Badge */}
          {settings && (
            <div className="text-center mt-8">
              <div className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg border-2 border-yellow-400">
                <div className="flex items-center gap-1">
                  <span className="font-black text-4xl text-blue-900 dark:text-blue-400">
                    {settings.average_rating.toFixed(1)}
                  </span>
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
                    {settings.total_reviews} avaliações no Google
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" style={{ animationDelay: '150ms' }} />
          <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </section>
  );
};
