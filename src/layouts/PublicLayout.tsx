import { type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSiteContent } from '@/hooks/useSiteContent';

export function PublicLayout() {
  const siteContent = useSiteContent();
  const { content, error } = siteContent;

  return (
    <div className="flex min-h-screen flex-col bg-navy-950">
      <Navbar logoUrl={content.logo_url} />
      {error && (
        <div className="border-b border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
          Hindi ma-load ang pinakabagong content. Ipinapakita ang default na impormasyon.
        </div>
      )}
      <main className="flex-1">
        <Outlet context={siteContent} />
      </main>
      <Footer content={content} />
    </div>
  );
}

export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24">{children}</div>
  );
}
