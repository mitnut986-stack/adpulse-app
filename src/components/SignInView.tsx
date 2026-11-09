import React, { useState } from 'react';
import { MaterialInput } from './MaterialInput';
import { Logo } from './Logo';
import { DEMO_CREDENTIALS } from '../data/mockAuth';
import { UserProfile } from '../types';
import { Check, Sparkles, Loader2, ArrowRight } from 'lucide-react';

interface SignInViewProps {
  onSuccess: (user: UserProfile) => void;
  onNavigateRegister: () => void;
  onNavigateForgotPassword: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const SignInView: React.FC<SignInViewProps> = ({
  onSuccess,
  onNavigateRegister,
  onNavigateForgotPassword,
  showToast,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string; general?: string }>({});

  const validate = (): boolean => {
    const newErrors: { identifier?: string; password?: string } = {};

    if (!identifier.trim()) {
      newErrors.identifier = 'Enter an email or username';
    } else if (identifier.includes('@')) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(identifier.trim())) {
        newErrors.identifier = 'Enter a valid email address';
      }
    } else if (identifier.trim().length < 3) {
      newErrors.identifier = 'Username must be at least 3 characters';
    }

    if (!password) {
      newErrors.password = 'Enter your password';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    // Simulate network authentication latency
    setTimeout(() => {
      const cleanEmail = identifier.trim().toLowerCase();
      const matchedCred = DEMO_CREDENTIALS.find(
        (c) => c.email.toLowerCase() === cleanEmail || c.name.toLowerCase() === cleanEmail
      );

      if (!matchedCred) {
        // If it's a test custom email but valid, allow simulated sign-in or check match
        if (cleanEmail.includes('adpulse.io') || cleanEmail.includes('@')) {
          if (password !== 'Publisher2026!' && password !== 'AdRevenue#2026' && password.length < 8) {
            setErrors({
              password: 'Wrong password. Try again or click Forgot password to reset it.',
            });
            setIsLoading(false);
            showToast('Authentication failed. Check your password.', 'error');
            return;
          }

          const customUser: UserProfile = {
            name: identifier.split('@')[0].replace('.', ' ').toUpperCase(),
            email: identifier.trim(),
            role: 'Verified Web Publisher',
            publisherId: `pub-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
            website: 'mywebsite.com',
          };
          setIsLoading(false);
          showToast(`Welcome back, ${customUser.name}!`, 'success');
          onSuccess(customUser);
          return;
        }

        setErrors({
          identifier: "Couldn't find your AdPulse account with this identifier.",
        });
        setIsLoading(false);
        showToast("Account not found. Click 'Demo Credentials' to autofill.", 'error');
        return;
      }

      if (matchedCred.password !== password) {
        setErrors({
          password: 'Wrong password. Try again or click Forgot password to reset it.',
        });
        setIsLoading(false);
        showToast('Incorrect password. Try again or use Quick Demo Fill.', 'error');
        return;
      }

      // Successful sign in
      setIsLoading(false);
      const user: UserProfile = {
        name: matchedCred.name,
        email: matchedCred.email,
        role: matchedCred.role,
        publisherId: matchedCred.publisherId,
        website: 'techpulse-daily.com',
      };
      showToast(`Signed in successfully as ${user.name}`, 'success');
      onSuccess(user);
    }, 850);
  };

  const handleQuickFill = (cred: typeof DEMO_CREDENTIALS[0]) => {
    setIdentifier(cred.email);
    setPassword(cred.password);
    setErrors({});
    showToast(`Autofilled credentials for ${cred.name}`, 'info');
  };

  return (
    <div className="w-full">
      {/* Demo Credentials Quick Switcher Banner */}
      <div className="mb-4 bg-[#f8fafd] border border-[#d2e3fc] rounded-xl p-3.5 text-xs text-[#1e293b]">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 font-semibold text-[#1a73e8]">
            <Sparkles className="w-4 h-4 shrink-0 text-[#1a73e8]" />
            <span>Interactive Demo Credentials</span>
          </div>
          <span className="text-[11px] text-[#5f6368] font-normal">Click to fill</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {DEMO_CREDENTIALS.map((cred) => (
            <button
              key={cred.email}
              type="button"
              onClick={() => handleQuickFill(cred)}
              className="group flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-[#dadce0] hover:border-[#1a73e8] hover:bg-blue-50/50 rounded-lg text-left transition-colors shadow-2xs"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#1a73e8] group-hover:scale-125 transition-transform" />
              <div>
                <p className="font-medium text-[#202124] text-[11px] leading-tight">
                  {cred.name} ({cred.label})
                </p>
                <p className="text-[10px] text-[#5f6368] font-mono leading-tight">
                  {cred.email}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Sign In Form Card */}
      <div className="w-full bg-white sm:border sm:border-[#dadce0] sm:rounded-[28px] p-6 sm:p-10 shadow-xs sm:shadow-sm">
        {/* Logo and Headings */}
        <div className="flex flex-col items-start mb-7">
          <Logo size="md" showSubtitle className="mb-5" />
          <h1 className="text-2xl sm:text-[28px] font-normal tracking-tight text-[#202124] mb-2">
            Sign in
          </h1>
          <p className="text-sm text-[#5f6368]">
            Use your AdPulse account to continue to Publisher Console.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSignIn} noValidate className="space-y-6">
          <div className="space-y-5">
            {/* Email / Username Input */}
            <MaterialInput
              label="Email or username"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (errors.identifier) setErrors({ ...errors, identifier: undefined });
              }}
              error={errors.identifier}
              autoComplete="username"
              disabled={isLoading}
              autoFocus
            />

            {/* Password Input */}
            <div>
              <MaterialInput
                label="Enter your password"
                isPassword
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                error={errors.password}
                autoComplete="current-password"
                disabled={isLoading}
              />

              {/* Forgot password link */}
              <div className="mt-2 flex justify-start">
                <button
                  type="button"
                  onClick={onNavigateForgotPassword}
                  className="text-xs sm:text-sm font-medium text-[#1a73e8] hover:text-[#1557bf] hover:underline focus:outline-none focus:ring-1 focus:ring-[#1a73e8] rounded px-1 py-0.5 -ml-1 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="sr-only peer"
                />
                <div className="w-[18px] h-[18px] rounded-[3px] border border-[#5f6368] peer-checked:bg-[#1a73e8] peer-checked:border-[#1a73e8] transition-colors flex items-center justify-center group-hover:border-[#202124]">
                  {rememberMe && <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
                </div>
              </div>
              <span className="text-xs sm:text-sm text-[#3c4043]">
                Remember me on this device
              </span>
            </label>
          </div>

          {/* Action Row: Create Account & Blue Sign In Button */}
          <div className="flex items-center justify-between pt-4 sm:pt-6">
            <button
              type="button"
              onClick={onNavigateRegister}
              disabled={isLoading}
              className="text-xs sm:text-sm font-medium text-[#1a73e8] hover:text-[#1557bf] hover:bg-blue-50/60 px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
            >
              Create account
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="relative min-w-[104px] h-[40px] px-6 text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1557bf] active:bg-[#174ea6] rounded-full transition-colors flex items-center justify-center shadow-xs hover:shadow focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
