import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../providers/AuthProvider';
import { BrandMark } from '../components/BrandMark';

export const UpdatePasswordScreen: React.FC = () => {
  const { updatePassword, clearPasswordRecovery, signOut } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: updateError } = await updatePassword(password);
    setSubmitting(false);
    if (updateError) setError(updateError);
    else setDone(true);
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
          <h1 className="text-lg font-black tracking-tight text-[#2C2C2E] dark:text-[#eff1f5]">Set a New Password</h1>
        </div>

        {done ? (
          <div className="text-center space-y-3 text-xs">
            <p className="text-[#008259] font-semibold">Password updated. You can sign in with it now.</p>
            <button
              onClick={() => {
                clearPasswordRecovery();
                void signOut();
              }}
              className="font-bold text-[#FF5500] hover:underline"
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[#2C2C2E] dark:text-[#eff1f5]">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
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
              {submitting ? 'Updating...' : 'Update Password'}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
