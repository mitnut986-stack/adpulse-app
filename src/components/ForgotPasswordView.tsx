import React, { useState } from 'react';
import { MaterialInput } from './MaterialInput';
import { Logo } from './Logo';
import { Loader2, ArrowRight, CheckCircle2, KeyRound, Mail, Sparkles } from 'lucide-react';

interface ForgotPasswordViewProps {
  onNavigateLogin: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({
  onNavigateLogin,
  showToast,
}) => {
  const [step, setStep] = useState<'email' | 'code' | 'new-password' | 'done'>('email');
  const [email, setEmail] = useState('alex.chen@adpulse.io');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const DEMO_RESET_CODE = '482910';

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      setIsLoading(false);
      setStep('code');
      showToast(`Verification code sent to ${email}`, 'info');
    }, 700);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Enter the 6-digit verification code');
      return;
    }
    if (code.trim() !== DEMO_RESET_CODE) {
      setError(`Invalid code. For this prototype, use demo code: ${DEMO_RESET_CODE}`);
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      setIsLoading(false);
      setStep('new-password');
      showToast('Code verified! Enter your new password.', 'success');
    }, 600);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      setIsLoading(false);
      setStep('done');
      showToast('Password updated successfully!', 'success');
    }, 750);
  };

  return (
    <div className="w-full">
      <div className="w-full bg-white sm:border sm:border-[#dadce0] sm:rounded-[28px] p-6 sm:p-10 shadow-xs sm:shadow-sm">
        {/* Header */}
        <div className="flex flex-col items-start mb-6">
          <Logo size="md" showSubtitle className="mb-4" />
          <h1 className="text-2xl sm:text-[28px] font-normal tracking-tight text-[#202124] mb-1.5">
            Account recovery
          </h1>
          <p className="text-sm text-[#5f6368]">
            {step === 'email' && 'Enter your AdPulse email address to receive a security reset code.'}
            {step === 'code' && `AdPulse sent a verification code to ${email}`}
            {step === 'new-password' && 'Create a strong, unique password for your account.'}
            {step === 'done' && 'Your password has been changed successfully.'}
          </p>
        </div>

        {/* STEP 1: Enter Email */}
        {step === 'email' && (
          <form onSubmit={handleSendCode} noValidate className="space-y-6">
            <MaterialInput
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              error={error || undefined}
              helperText="We'll send a 6-digit confirmation code to verify your identity."
              disabled={isLoading}
              autoFocus
            />

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={onNavigateLogin}
                disabled={isLoading}
                className="text-xs sm:text-sm font-medium text-[#1a73e8] hover:text-[#1557bf] hover:bg-blue-50/60 px-3 py-2 rounded-md transition-colors"
              >
                Back to sign in
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="min-w-[100px] h-[40px] px-6 text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1557bf] active:bg-[#174ea6] rounded-full transition-colors flex items-center justify-center shadow-xs"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Enter Verification Code */}
        {step === 'code' && (
          <form onSubmit={handleVerifyCode} noValidate className="space-y-5">
            {/* Prototype helper banner */}
            <div className="bg-[#e8f0fe] border border-[#d2e3fc] rounded-lg p-3 text-xs text-[#174ea6] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#1a73e8] shrink-0" />
                <span>Demo Code: <strong className="font-mono text-sm">{DEMO_RESET_CODE}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCode(DEMO_RESET_CODE);
                  setError(null);
                }}
                className="text-[#1a73e8] font-semibold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Auto-paste
              </button>
            </div>

            <MaterialInput
              label="Enter 6-digit code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                if (error) setError(null);
              }}
              error={error || undefined}
              disabled={isLoading}
              autoFocus
            />

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep('email')}
                disabled={isLoading}
                className="text-xs sm:text-sm font-medium text-[#1a73e8] hover:text-[#1557bf] px-3 py-2 rounded-md transition-colors"
              >
                Try another way
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="min-w-[100px] h-[40px] px-6 text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1557bf] rounded-full transition-colors flex items-center justify-center shadow-xs"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span>Verify</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Enter New Password */}
        {step === 'new-password' && (
          <form onSubmit={handleResetPassword} noValidate className="space-y-4">
            <MaterialInput
              label="Create new password"
              isPassword
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (error) setError(null);
              }}
              disabled={isLoading}
              autoFocus
            />

            <MaterialInput
              label="Confirm new password"
              isPassword
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError(null);
              }}
              disabled={isLoading}
            />

            {error && (
              <p className="text-xs text-[#d93025] px-1">{error}</p>
            )}

            <div className="flex items-center justify-end pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="min-w-[140px] h-[40px] px-6 text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1557bf] rounded-full transition-colors flex items-center justify-center shadow-xs"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <div className="flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4" />
                    <span>Save Password</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Success confirmation */}
        {step === 'done' && (
          <div className="py-4 space-y-6 text-center">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-medium text-[#202124] mb-1">
                Password Reset Complete
              </h2>
              <p className="text-sm text-[#5f6368] max-w-sm mx-auto">
                Your password has been securely updated. You can now log into your AdPulse Publisher Console.
              </p>
            </div>

            <button
              type="button"
              onClick={onNavigateLogin}
              className="w-full h-[42px] px-6 text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1557bf] rounded-full transition-colors flex items-center justify-center shadow-xs"
            >
              Sign in with new password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
