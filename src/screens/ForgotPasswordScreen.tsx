import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../providers/AuthProvider';
import { BrandMark } from '../components/BrandMark';
import type { AuthRoute } from '../hooks/useAuthRoute';

export const ForgotPasswordScreen: React.FC<{ navigate: (route: AuthRoute) => void }> = ({ navigate }) => {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: resetError } = await requestPasswordReset(email);
    setSubmitting(false);
    if (resetError) setError(resetError);
    else setSent(true);
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
          <h1 className="text-lg font-black tracking-tight text-[#2C2C2E] dark:text-[#eff1f5]">Reset Your Password</h1>
          <p className="text-xs text-[#8E8E93] dark:text-[#8e9095] text-center">
            Enter your account email and we'll send you a link to reset it
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-3 text-xs">
            <p className="text-[#008259] font-semibold py-2">
              If an account exists for <span className="font-bold">{email}</span>, a reset link has been sent.
            </p>
            <button onClick={() => navigate('/login')} className="font-bold text-[#FF5500] hover:underline">
              Back to sign in
            </button>
          </div>
        ) : (
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

            {error && <p className="text-red-500 font-semibold">{error}</p>}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-[#FF5500] to-[#E04800] text-white py-2.5 rounded-xl font-bold text-xs shadow-md disabled:opacity-60"
            >
              {submitting ? 'Sending...' : 'Send Reset Link'}
            </motion.button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full text-center text-[#8E8E93] dark:text-[#8e9095] hover:text-[#FF5500] font-semibold py-1"
            >
              Back to sign in
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
