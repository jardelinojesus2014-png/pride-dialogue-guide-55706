import logoPride from '@/assets/Logo_Pride-2.png';

interface GoogleReviewsSectionProps {
  darkMode: boolean;
}

export const GoogleReviewsSection = ({ darkMode }: GoogleReviewsSectionProps) => {
  return (
    <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 rounded-2xl shadow-2xl p-6 sm:p-10 mb-6 overflow-hidden">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-40 h-40 border-l-4 border-t-4 border-yellow-400 rounded-tl-2xl opacity-50" />
      <div className="absolute bottom-0 right-0 w-40 h-40 border-r-4 border-b-4 border-yellow-400 rounded-br-2xl opacity-50" />

      <div className="relative z-10">
        {/* Header with Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <img src={logoPride} alt="Pride" className="w-16 h-16 object-contain drop-shadow-2xl animate-pulse" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black mb-3 text-white drop-shadow-lg">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400">
              Avaliações do Google
            </span>
          </h2>
        </div>

        {/* Google Reviews iframe */}
        <div className="w-full rounded-2xl overflow-hidden shadow-2xl bg-white" style={{ height: '500px' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14630.445698271637!2d-43.1729!3d-22.9068!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDU0JzI0LjUiUyA0M8KwMTAnMjIuNCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Reviews - Pride Corretora"
          />
        </div>
      </div>
    </section>
  );
};
