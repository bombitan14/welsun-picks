import { Trophy } from 'lucide-react';

interface LogoProps {
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { icon: 18, text: 'text-base' },
  md: { icon: 26, text: 'text-xl' },
  lg: { icon: 38, text: 'text-3xl' },
};

export default function Logo({ logoUrl, size = 'md' }: LogoProps) {
  const s = sizeMap[size];

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="WELSUN PICKS"
        className="object-contain"
        style={{ maxHeight: s.icon + 14 }}
      />
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <div className="rounded-lg bg-gradient-to-br from-brand-red to-brand-red-dark p-1.5 shadow-lg shadow-brand-red/30">
        <Trophy size={s.icon} className="text-white" strokeWidth={2.5} />
      </div>
      <span className={`font-extrabold tracking-tight ${s.text}`}>
        <span className="text-white">WELSUN</span>{' '}
        <span className="bg-gradient-to-r from-brand-gold to-brand-gold-dark bg-clip-text text-transparent">
          PICKS
        </span>
      </span>
    </div>
  );
}
