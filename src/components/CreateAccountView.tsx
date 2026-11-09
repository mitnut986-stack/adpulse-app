import React, { useState } from 'react';
import { MaterialInput } from './MaterialInput';
import { Logo } from './Logo';
import { UserProfile } from '../types';
import { Check, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

interface CreateAccountViewProps {
  onSuccess: (user: UserProfile) => void;
  onNavigateLogin: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const CreateAccountView: React.FC<CreateAccountViewProps> = ({
  onSuccess,
  onNavigateLogin,
  showToast,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('News & Content Website');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
  }>({});

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: '', color: 'bg-neutral-200' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-[#ea4335]' };
      case 2:
        return { score: 2, label: 'Fair', color: 'bg-[#fbbc05]' };
      case 3:
        return { score: 3, label: 'Good', color: 'bg-[#4285f4]' };
      case 4:
      default:
        return { score: 4, label: 'Strong', color: 'bg-[#34a853]' };
    }
  };

  const strength = getPasswordStrength();

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'Enter first name';
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'Enter last name';
    }

    if (!email.trim()) {
      newErrors.email = 'Enter an email address';
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.trim())) {
        newErrors.email = 'Enter a valid email address';
      }
    }

    if (!password) {
      newErrors.password = 'Enter a password';
    } else if (password.length < 8) {
      newErrors.password = 'Use 8 or more characters with letters and numbers';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Those passwords didn't match. Try again.";
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const generatedPubId = `pub-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      const newUser: UserProfile = {
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        role: `Publisher (${category})`,
        publisherId: generatedPubId,
        website: email.split('@')[1] ? `www.${email.split('@')[1]}` : 'mywebsite.com',
      };

      showToast(`Account created! Welcome to AdPulse, ${newUser.name}.`, 'success');
      onSuccess(newUser);
    }, 950);
  };

  return (
    <div className="w-full">
      <div className="w-full bg-white sm:border sm:border-[#dadce0] sm:rounded-[28px] p-6 sm:p-10 shadow-xs sm:shadow-sm">
        {/* Header */}
        <div className="flex flex-col items-start mb-6">
          <Logo size="md" showSubtitle className="mb-4" />
          <h1 className="text-2xl sm:text-[28px] font-normal tracking-tight text-[#202124] mb-1.5">
            Create an AdPulse Account
          </h1>
          <p className="text-sm text-[#5f6368]">
            Start monetizing your web audience with automated ad placements.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} noValidate className="space-y-4">
          {/* Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <MaterialInput
              label="First name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (errors.firstName) setErrors({ ...errors, firstName: undefined });
              }}
              error={errors.firstName}
              disabled={isLoading}
              autoFocus
            />
            <MaterialInput
              label="Last name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                if (errors.lastName) setErrors({ ...errors, lastName: undefined });
              }}
              error={errors.lastName}
              disabled={isLoading}
            />
          </div>

          {/* Email */}
          <MaterialInput
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            error={errors.email}
            helperText="You will use this address to receive monthly publisher revenue reports."
            disabled={isLoading}
          />

          {/* Publisher Category Select */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#5f6368] block">
              Primary Publisher Property
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isLoading}
                className="w-full h-[50px] px-3.5 rounded-[6px] border border-[#dadce0] bg-white text-[14px] text-[#202124] focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] outline-none transition-colors"
              >
                <option value="News & Content Website">Content Blog / Magazine / News</option>
                <option value="SaaS & Developer Web App">Web App / SaaS Platform</option>
                <option value="Mobile App (iOS / Android)">Mobile App Developer</option>
                <option value="Video & Media Publishing">Video Channel & Streaming Network</option>
                <option value="E-Commerce & Niche Directory">Directory / Niche Community</option>
              </select>
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <MaterialInput
              label="Password"
              isPassword
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              error={errors.password}
              disabled={isLoading}
            />
            <MaterialInput
              label="Confirm"
              isPassword
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
              }}
              error={errors.confirmPassword}
              disabled={isLoading}
            />
          </div>

          {/* Real-time Password Strength Meter */}
          {password && (
            <div className="bg-[#f8fafd] p-2.5 rounded-lg border border-[#e8eaed] space-y-1.5 text-xs text-[#5f6368]">
              <div className="flex items-center justify-between">
                <span>Password strength:</span>
                <span className="font-semibold text-[#202124]">{strength.label}</span>
              </div>
              <div className="w-full bg-[#dadce0] h-1.5 rounded-full overflow-hidden flex gap-1">
                <div className={`h-full flex-1 ${strength.score >= 1 ? strength.color : 'bg-transparent'}`} />
                <div className={`h-full flex-1 ${strength.score >= 2 ? strength.color : 'bg-transparent'}`} />
                <div className={`h-full flex-1 ${strength.score >= 3 ? strength.color : 'bg-transparent'}`} />
                <div className={`h-full flex-1 ${strength.score >= 4 ? strength.color : 'bg-transparent'}`} />
              </div>
              <p className="text-[11px] text-[#5f6368] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1a73e8]" />
                Use 8+ characters with a mix of letters, numbers & symbols.
              </p>
            </div>
          )}

          {/* Terms & Conditions Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer select-none group">
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: undefined });
                  }}
                  disabled={isLoading}
                  className="sr-only peer"
                />
                <div className="w-[18px] h-[18px] rounded-[3px] border border-[#5f6368] peer-checked:bg-[#1a73e8] peer-checked:border-[#1a73e8] transition-colors flex items-center justify-center group-hover:border-[#202124]">
                  {agreeTerms && <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
                </div>
              </div>
              <span className="text-xs sm:text-[13px] text-[#3c4043] leading-relaxed">
                I agree to the <span className="text-[#1a73e8] hover:underline">AdPulse Publisher Terms</span> and confirm my traffic complies with anti-fraud guidelines.
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-xs text-[#d93025] mt-1.5 px-1">{errors.agreeTerms}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-5 sm:pt-6">
            <button
              type="button"
              onClick={onNavigateLogin}
              disabled={isLoading}
              className="text-xs sm:text-sm font-medium text-[#1a73e8] hover:text-[#1557bf] hover:bg-blue-50/60 px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
            >
              Sign in instead
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="relative min-w-[130px] h-[40px] px-6 text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1557bf] active:bg-[#174ea6] rounded-full transition-colors flex items-center justify-center shadow-xs hover:shadow focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span>Create Account</span>
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
