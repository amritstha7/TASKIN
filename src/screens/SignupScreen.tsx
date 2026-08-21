import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../providers/AuthProvider';
import { BrandMark } from '../components/BrandMark';

export const SignupScreen: React.FC<{ onSwitchToLogin: () => void }> = ({ onSwitchToLogin }) => {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [branchName, setBranchName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signUpError, needsEmailConfirmation } = await signUp({
      email,
      password,
      name,
      role: role.trim() || 'Store Associate',
      branchName,
    });
    setSubmitting(false);
    if (signUpError) {
      setError(signUpError);
      return;
    }
    if (needsEmailConfirmation) setConfirmationSent(true);
  };

  if (confirmationSent) {
    return (
      <div className="bg-[#F7F7F8] dark:bg-[#191c1f] min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#25282c] rounded-2xl border border-[#e5e5ea] dark:border-[#35383c] shadow-2xl w-full max-w-sm p-6 sm:p-7 text-center space-y-3"
        >
          <div className="flex justify-center">
            <BrandMark size={48} />
          </div>
          <h2 className="text-sm font-black text-[#2C2C2E] dark:text-[#eff1f5]">Check your email</h2>
          <p className="text-xs text-[#8E8E93] dark:text-[#8e9095]">
            We sent a confirmation link to <span className="font-bold">{email}</span>. Confirm your address, then sign in.
          </p>
          <button onClick={onSwitchToLogin} className="text-xs font-bold text-[#FF5500] hover:underline pt-2">
            Back to sign in
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F7F8] dark:bg-[#191c1f] min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#25282c] rounded-2xl border border-[#e5e5ea] dark:border-[#35383c] shadow-2xl w-full max-w-sm p-6 sm:p-7"
      >
        <div className="flex flex-col items-center gap-2.5 mb-6">
          <BrandMark size={48} />
          <h1 className="text-lg font-black tracking-tight text-[#2C2C2E] dark:text-[#eff1f5]">Create Account</h1>
          <p className="text-xs text-[#8E8E93] dark:text-[#8e9095] text-center">Join or create your store's shared workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
              Full Name <span className="text-[#FF5500]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              className="border border-[#e5e5ea] dark:border-[#35383c] rounded-xl px-3.5 py-2.5 bg-white dark:bg-[#191c1f] text-[#2C2C2E] dark:text-[#eff1f5] focus:outline-none focus:border-[#FF5500]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
              Email Address <span className="text-[#FF5500]">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-[#e5e5ea] dark:border-[#35383c] rounded-xl px-3.5 py-2.5 bg-white dark:bg-[#191c1f] text-[#2C2C2E] dark:text-[#eff1f5] focus:outline-none focus:border-[#FF5500]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
              Password <span className="text-[#FF5500]">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="border border-[#e5e5ea] dark:border-[#35383c] rounded-xl px-3.5 py-2.5 bg-white dark:bg-[#191c1f] text-[#2C2C2E] dark:text-[#eff1f5] focus:outline-none focus:border-[#FF5500]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[#2C2C2E] dark:text-[#eff1f5]">Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Store Associate"
                className="border border-[#e5e5ea] dark:border-[#35383c] rounded-xl px-3.5 py-2.5 bg-white dark:bg-[#191c1f] text-[#2C2C2E] dark:text-[#eff1f5] focus:outline-none focus:border-[#FF5500]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
                Store Branch <span className="text-[#FF5500]">*</span>
              </label>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                required
                placeholder="Metro Central"
                className="border border-[#e5e5ea] dark:border-[#35383c] rounded-xl px-3.5 py-2.5 bg-white dark:bg-[#191c1f] text-[#2C2C2E] dark:text-[#eff1f5] focus:outline-none focus:border-[#FF5500]"
              />
            </div>
          </div>
          <p className="text-[10px] text-[#8E8E93] dark:text-[#8e9095]">
            Use the exact same branch name as your teammates to join their shared workspace.
          </p>

          {error && <p className="text-red-500 font-semibold">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-[#FF5500] to-[#E04800] text-white py-2.5 rounded-xl font-bold text-xs shadow-md disabled:opacity-60"
          >
            {submitting ? 'Creating account...' : 'Create Account'}
          </motion.button>
        </form>

        <div className="pt-4 mt-4 border-t border-[#e5e5ea] dark:border-[#35383c] text-center text-xs">
          <span className="text-[#8E8E93] dark:text-[#8e9095]">Already have an account? </span>
          <button onClick={onSwitchToLogin} className="font-bold text-[#FF5500] hover:underline">
            Sign in
          </button>
        </div>
      </motion.div>
    </div>
  );
};
