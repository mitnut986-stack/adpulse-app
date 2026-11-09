/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PageView, UserProfile } from './types';
import { INITIAL_USER } from './data/mockAuth';
import { SignInView } from './components/SignInView';
import { CreateAccountView } from './components/CreateAccountView';
import { ForgotPasswordView } from './components/ForgotPasswordView';
import { PublisherDashboardView } from './components/PublisherDashboardView';
import { Footer } from './components/Footer';
import { NotificationToast, ToastMessage } from './components/NotificationToast';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('login');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLoginSuccess = (signedInUser: UserProfile) => {
    setUser(signedInUser);
    setCurrentPage('dashboard');
  };

  const handleRegisterSuccess = (registeredUser: UserProfile) => {
    setUser(registeredUser);
    setCurrentPage('dashboard');
  };

  // Page Transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 12, scale: 0.99 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, ease: 'easeOut' as const } },
    exit: { opacity: 0, y: -12, scale: 0.99, transition: { duration: 0.15, ease: 'easeIn' as const } },
  };

  // If in dashboard, show the full Publisher Console
  if (currentPage === 'dashboard') {
    return (
      <div className="min-h-screen bg-white">
        <NotificationToast toasts={toasts} onDismiss={handleDismissToast} />
        <PublisherDashboardView
          user={user}
          onSignOut={() => {
            setCurrentPage('login');
            showToast('Signed out of AdPulse session', 'info');
          }}
          showToast={showToast}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white sm:bg-[#f8fafd] flex flex-col justify-between items-center selection:bg-blue-100 selection:text-blue-900">
      {/* Top Prototype Navigation Bar to easily inspect all pages */}
      <div className="w-full bg-white border-b border-[#dadce0] px-4 py-2 text-xs text-[#5f6368] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#1a73e8]" />
          <span className="font-medium text-[#202124]">AdPulse Auth Suite</span>
          <span className="hidden md:inline text-[#747775]">· Prototype Navigation:</span>
        </div>

        {/* Quick Page Jump Tabs */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentPage('login')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              currentPage === 'login'
                ? 'bg-blue-50 text-[#1a73e8] font-medium'
                : 'hover:bg-neutral-100 text-[#5f6368]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage('register')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              currentPage === 'register'
                ? 'bg-blue-50 text-[#1a73e8] font-medium'
                : 'hover:bg-neutral-100 text-[#5f6368]'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage('forgot-password')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              currentPage === 'forgot-password'
                ? 'bg-blue-50 text-[#1a73e8] font-medium'
                : 'hover:bg-neutral-100 text-[#5f6368]'
            }`}
          >
            Forgot Password
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentPage('dashboard');
              showToast('Previewing logged-in Publisher Console', 'info');
            }}
            className="px-2.5 py-1 rounded text-xs text-[#1a73e8] hover:bg-blue-50 transition-colors hidden sm:block font-medium"
          >
            Dashboard Preview →
          </button>
        </div>
      </div>

      {/* Main Centered Authentication Panel */}
      <div className="w-full flex-1 flex flex-col items-center justify-center py-6 sm:py-12 px-4 sm:px-6">
        <div className="w-full max-w-[450px] sm:max-w-[480px]">
          <AnimatePresence mode="wait">
            {currentPage === 'login' && (
              <motion.div
                key="login-page"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <SignInView
                  onSuccess={handleLoginSuccess}
                  onNavigateRegister={() => setCurrentPage('register')}
                  onNavigateForgotPassword={() => setCurrentPage('forgot-password')}
                  showToast={showToast}
                />
              </motion.div>
            )}

            {currentPage === 'register' && (
              <motion.div
                key="register-page"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <CreateAccountView
                  onSuccess={handleRegisterSuccess}
                  onNavigateLogin={() => setCurrentPage('login')}
                  showToast={showToast}
                />
              </motion.div>
            )}

            {currentPage === 'forgot-password' && (
              <motion.div
                key="forgot-password-page"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <ForgotPasswordView
                  onNavigateLogin={() => setCurrentPage('login')}
                  showToast={showToast}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Footer (Language & Terms) */}
        <Footer />
      </div>

      {/* Toast Notifications */}
      <NotificationToast toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
