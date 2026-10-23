import { useOutletContext } from 'react-router-dom';
import { Info } from 'lucide-react';
import { PageWrapper } from '@/layouts/PublicLayout';
import type { SiteContent } from '@/types/content';

type Context = { content: SiteContent; loading: boolean };

export default function About() {
  const { content, loading } = useOutletContext<Context>();
  const backgroundUrl = content.about_background_url.startsWith('http://') || content.about_background_url.startsWith('https://')
    ? content.about_background_url
    : '';

  return (
    <div
      className="min-h-full bg-navy-950 bg-cover bg-center"
      style={backgroundUrl ? {
        backgroundImage: `linear-gradient(rgba(5, 8, 20, 0.82), rgba(5, 8, 20, 0.96)), url(${backgroundUrl})`,
      } : undefined}
    >
      <PageWrapper>
        <div className="animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/5 px-4 py-1.5">
            <Info size={16} className="text-brand-red" />
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-red">About Us</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
            {loading ? 'Loading...' : content.about_title}
          </h1>
          <div className="mt-8 rounded-xl border border-white/5 bg-navy-900/90 p-6 md:p-10">
            <p className="text-base leading-relaxed text-gray-300 sm:text-lg">
              {loading ? '' : content.about_description}
            </p>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
