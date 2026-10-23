import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import type { SiteContent } from '@/types/content';

interface FooterProps {
  content: SiteContent;
}

export default function Footer({ content }: FooterProps) {
  return (
    <footer className="border-t border-white/5 bg-navy-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <Logo logoUrl={content.logo_url} size="sm" />
            <p className="max-w-xs text-center text-sm text-gray-500 md:text-left">
              Your trusted source for premium picks and insights.
            </p>
          </div>
          <Link
            to="/admin"
            className="text-xs text-gray-600 transition-colors hover:text-gray-400"
          >
            Admin Login
          </Link>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 text-center">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} WELSUN PICKS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
