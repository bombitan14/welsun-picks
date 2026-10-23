import { useOutletContext } from 'react-router-dom';
import { ExternalLink, Facebook, MessageCircle } from 'lucide-react';
import { PageWrapper } from '@/layouts/PublicLayout';
import type { SiteContent } from '@/types/content';
import { safeLink } from '@/lib/links';

type Context = { content: SiteContent; loading: boolean };

export default function Contact() {
  const { content, loading } = useOutletContext<Context>();
  const backgroundUrl = content.contact_background_url.startsWith('http://') || content.contact_background_url.startsWith('https://')
    ? content.contact_background_url
    : '';
  const cards = [
    {
      icon: Facebook,
      label: 'Facebook Page',
      value: 'Visit Facebook Page',
      href: safeLink(content.facebook_page, '#'),
    },
    {
      icon: MessageCircle,
      label: 'Main Facebook Account',
      value: 'Direct Message Main Facebook Account',
      href: safeLink(content.facebook_account_link, '#'),
    },
    {
      icon: ExternalLink,
      label: 'Play Now!',
      value: '747 Website',
      href: safeLink(content.website_747_link, '#'),
    },
  ];

  return (
    <div
      className="min-h-full bg-navy-950 bg-cover bg-center"
      style={backgroundUrl ? {
        backgroundImage: `linear-gradient(rgba(5, 8, 20, 0.84), rgba(5, 8, 20, 0.97)), url(${backgroundUrl})`,
      } : undefined}
    >
      <PageWrapper>
        <div className="animate-fade-in-up text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-red">Get In Touch</p>
          <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">Contact Us</h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-400">
            For creation of account, <strong className="font-bold text-white">kindly direct message on Facebook.</strong>
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-3">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <a
                key={card.label}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group animate-fade-in-up flex min-h-[150px] flex-col items-center justify-center gap-4 rounded-xl border border-white/5 bg-navy-900/90 p-6 text-center transition-all duration-300 hover:border-brand-red/20 hover:bg-navy-800"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="inline-flex rounded-xl bg-brand-red/10 p-3.5 transition-colors group-hover:bg-brand-red/20">
                  <Icon size={24} className="text-brand-red" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold">{card.label}</p>
                  <p className="mt-1 text-sm font-bold text-gray-200">{loading ? '' : card.value}</p>
                </div>
              </a>
            );
          })}
        </div>
      </PageWrapper>
    </div>
  );
}
