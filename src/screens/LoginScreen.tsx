import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../providers/AuthProvider';
import { BrandMark } from '../components/BrandMark';
import type { AuthRoute } from '../hooks/useAuthRoute';

export const LoginScreen: React.FC<{ navigate: (route: AuthRoute) => void }> = ({ navigate }) => {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);
    if (signInError) setError(signInError);
  };

  const handleGoogle = async () => {
    setError(null);
    setGoogleSubmitting(true);
    const { error: googleError } = await signInWithGoogle();
    if (googleError) {
      setError(googleError);
      setGoogleSubmitting(false);
    }
    // On success the page redirects to Google immediately — no further state change here.
  };

  return (
    <div className="bg-[#F7F7F8] dark:bg-[#191c1f] min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#25282c] rounded-2xl border border-[#e5e5ea] dark:border-[#35383c] shadow-2xl w-full max-w-sm p-6 sm:p-7"
      >
        <div className="flex flex-col items-center gap-2.5 mb-6">
          <BrandMark size={48} />
          <h1 className="text-lg font-black tracking-tight text-[#2C2C2E] dark:text-[#eff1f5]">TASKN</h1>
          <p className="text-xs text-[#8E8E93] dark:text-[#8e9095] text-center">Sign in to your store workspace</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={() => void handleGoogle()}
          disabled={googleSubmitting}
          className="w-full flex items-center justify-center gap-2.5 border border-[#e5e5ea] dark:border-[#35383c] rounded-xl py-2.5 text-xs font-bold text-[#2C2C2E] dark:text-[#eff1f5] bg-white dark:bg-[#191c1f] hover:bg-[#F7F7F8] dark:hover:bg-[#25282c] transition-colors disabled:opacity-60"
        >
          <GoogleIcon />
          {googleSubmitting ? 'Redirecting…' : 'Continue with Google'}
        </motion.button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-[#e5e5ea] dark:bg-[#35383c]" />
          <span className="text-[10px] font-bold uppercase text-[#8E8E93] dark:text-[#8e9095]">or</span>
          <div className="flex-1 h-px bg-[#e5e5ea] dark:bg-[#35383c]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[#2C2C2E] dark:text-[#eff1f5]">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="border border-[#e5e5ea] dark:border-[#35383c] rounded-xl px-3.5 py-2.5 bg-white dark:bg-[#191c1f] text-[#2C2C2E] dark:text-[#eff1f5] focus:outline-none focus:border-[#FF5500]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[#2C2C2E] dark:text-[#eff1f5]">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-[#e5e5ea] dark:border-[#35383c] rounded-xl px-3.5 py-2.5 pr-10 bg-white dark:bg-[#191c1f] text-[#2C2C2E] dark:text-[#eff1f5] focus:outline-none focus:border-[#FF5500]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-[#FF5500] cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 font-semibold">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-[#FF5500] to-[#E04800] text-white py-2.5 rounded-xl font-bold text-xs shadow-md disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </motion.button>

          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="w-full text-center text-[#8E8E93] dark:text-[#8e9095] hover:text-[#FF5500] font-semibold py-1"
          >
            Forgot password?
          </button>
        </form>

        <div className="pt-4 mt-4 border-t border-[#e5e5ea] dark:border-[#35383c] text-center text-xs">
          <span className="text-[#8E8E93] dark:text-[#8e9095]">New to this store? </span>
          <button onClick={() => navigate('/signup')} className="font-bold text-[#FF5500] hover:underline">
            Create an account
          </button>
        </div>
      </motion.div>
    </div>
  );
};

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.78-2.4 3.63v3.02h3.88c2.27-2.09 3.57-5.17 3.57-8.84z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.88-3.02c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.94H1.28v3.11C3.26 21.3 7.3 24 12 24z"
      />
      <path fill="#FBBC05" d="M5.29 14.29a7.2 7.2 0 0 1 0-4.58V6.6H1.28a12 12 0 0 0 0 10.8l4.01-3.11z" />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.3 0 3.26 2.7 1.28 6.6l4.01 3.11C6.23 6.86 8.88 4.75 12 4.75z"
      />
    </svg>
  );
}
