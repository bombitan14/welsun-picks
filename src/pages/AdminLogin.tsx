import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Trophy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLogin() {
  const { signIn, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, loading, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError);
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-navy-950 px-4">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-800 via-navy-950 to-navy-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(225,29,72,0.08),transparent_55%)]" />
      <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-red/5 blur-[100px]" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-brand-red to-brand-red-dark p-3 shadow-lg shadow-brand-red/30">
            <Trophy size={32} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Admin Login</h1>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to manage WELSUN PICKS content
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-white/10 bg-navy-900/80 p-6 backdrop-blur-sm sm:p-8"
        >
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Email
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-white/10 bg-navy-950/80 py-3 pl-11 pr-4 text-sm text-white placeholder-gray-600 transition-colors focus:border-brand-red/50 focus:outline-none focus:ring-1 focus:ring-brand-red/30"
                placeholder="admin@welsunpicks.com"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-white/10 bg-navy-950/80 py-3 pl-11 pr-12 text-sm text-white placeholder-gray-600 transition-colors focus:border-brand-red/50 focus:outline-none focus:ring-1 focus:ring-brand-red/30"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-brand-gold"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-gradient-to-r from-brand-red to-brand-red-dark py-3 font-semibold text-white shadow-lg shadow-brand-red/30 transition-all duration-300 hover:from-brand-red-dark hover:to-brand-red disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-brand-gold"
          >
            <ArrowLeft size={16} />
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
