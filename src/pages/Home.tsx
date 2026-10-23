import { useEffect, useState, type ReactNode } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Headphones,
  Star,
  Trophy,
  TrendingUp,
  Users,
} from 'lucide-react';
import type { SiteContent } from '@/types/content';
import { safeLink } from '@/lib/links';

type Context = { content: SiteContent; loading: boolean; error: string | null };

const stats = [
  { icon: Users, value: '1,000+', label: 'Community Members' },
  { icon: TrendingUp, value: 'Expert', label: 'Analysis & Insights' },
  { icon: Headphones, value: '24/7', label: 'Support Available' },
  { icon: Star, value: 'Premium', label: 'Quality Picks' },
];

function isExternalLink(href: string): boolean {
  return href.startsWith('http://') || href.startsWith('https://');
}

function HomeLink({ href, children, className }: { href: string; children: ReactNode; className: string }) {
  if (isExternalLink(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}

export default function Home() {
  const { content, loading } = useOutletContext<Context>();
  const [activeSlide, setActiveSlide] = useState(0);
  const gallery = content.home_gallery_urls;
  const primaryHref = safeLink(content.home_primary_url, '/contact');
  const secondaryHref = safeLink(content.home_secondary_url, '/about');
  const backgroundUrl = safeLink(content.home_background_url, '');

  useEffect(() => {
    setActiveSlide(0);
  }, [gallery.length]);

  useEffect(() => {
    if (gallery.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % gallery.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [gallery.length]);

  const goToSlide = (direction: number) => {
    setActiveSlide((current) => (current + direction + gallery.length) % gallery.length);
  };

  return (
    <div className="relative">
      <section
        className="relative overflow-hidden border-b border-white/5"
        style={backgroundUrl ? {
          backgroundImage: `linear-gradient(rgba(5, 8, 20, 0.76), rgba(5, 8, 20, 0.98)), url(${backgroundUrl})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        } : undefined}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-navy-800/70 via-navy-950/85 to-navy-950/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(225,29,72,0.12),transparent_55%)]" />
        <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-brand-red/5 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 md:py-28">
          <div className="animate-fade-in-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/5 px-4 py-1.5">
              <Trophy size={16} className="text-brand-red" />
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-red">
                Premium Picks &amp; Insights
              </span>
            </div>
          </div>

          <h1 className="animate-fade-in-up text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
            {loading ? 'Loading...' : content.home_title}
          </h1>
          <p className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg">
            {loading ? '' : content.home_description}
          </p>

          <div className="animate-fade-in-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <HomeLink
              href={primaryHref}
              className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-red to-brand-red-dark px-8 py-3.5 font-semibold text-white shadow-lg shadow-brand-red/30 transition-all duration-300 hover:from-brand-red-dark hover:to-brand-red hover:shadow-xl hover:shadow-brand-red/40"
            >
              {loading ? 'Contact Us' : content.home_primary_label}
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </HomeLink>
            <HomeLink
              href={secondaryHref}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-8 py-3.5 font-semibold text-gray-300 transition-all duration-300 hover:border-brand-gold/40 hover:bg-white/10 hover:text-brand-gold"
            >
              {loading ? 'Learn More' : content.home_secondary_label}
            </HomeLink>
          </div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="border-b border-white/5 bg-navy-900 py-10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-navy-950 shadow-2xl">
              <div className="aspect-[16/7]">
                {gallery.map((image, index) => (
                  <img
                    key={image}
                    src={image}
                    alt={`WELSUN PICKS highlight ${index + 1}`}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${index === activeSlide ? 'opacity-100' : 'opacity-0'}`}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
              </div>
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => goToSlide(-1)}
                    aria-label="Previous slide"
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-navy-950/60 p-2 text-white backdrop-blur transition hover:bg-brand-red"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => goToSlide(1)}
                    aria-label="Next slide"
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-navy-950/60 p-2 text-white backdrop-blur transition hover:bg-brand-red"
                  >
                    <ArrowRight size={18} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                    {gallery.map((image, index) => (
                      <button
                        key={image}
                        type="button"
                        onClick={() => setActiveSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`h-2 rounded-full transition-all ${index === activeSlide ? 'w-7 bg-brand-red' : 'w-2 bg-white/60'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="border-b border-white/5 bg-navy-900">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-white/5 sm:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <Icon size={24} className="text-brand-gold" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs uppercase tracking-wider text-gray-500">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-white/5 bg-navy-950 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to Get Started?</h2>
          <p className="mt-4 text-gray-400">Connect with WELSUN PICKS today and get started.</p>
          <div className="mt-8">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-gold to-brand-gold-dark px-6 py-3 font-semibold text-navy-950 transition-all duration-300 hover:from-brand-gold-dark hover:to-brand-gold"
            >
              Contact Us <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
