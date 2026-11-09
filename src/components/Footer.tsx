import React, { useState } from 'react';
import { Globe, ChevronDown, HelpCircle, Shield, FileText, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English (United States)');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'help' | 'privacy' | 'terms' | null>(null);

  const languages = [
    'English (United States)',
    'English (United Kingdom)',
    'Español (España)',
    'Français (France)',
    'Deutsch (Deutschland)',
    '日本語 (Japan)',
    'Português (Brasil)',
  ];

  return (
    <>
      <footer className="w-full max-w-[450px] sm:max-w-[480px] mt-6 px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#5f6368] gap-3 select-none">
        {/* Language Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:bg-neutral-100 text-[#3c4043] transition-colors focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
            aria-expanded={isLangOpen}
            aria-haspopup="listbox"
          >
            <Globe className="w-3.5 h-3.5 text-[#5f6368]" />
            <span>{selectedLanguage}</span>
            <ChevronDown className="w-3 h-3 text-[#5f6368]" />
          </button>

          {isLangOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsLangOpen(false)}
              />
              <div className="absolute bottom-full mb-1 left-0 w-52 bg-white rounded-lg shadow-lg border border-[#dadce0] py-1 z-40 max-h-60 overflow-y-auto">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
                      selectedLanguage === lang
                        ? 'bg-blue-50 text-[#1a73e8] font-medium'
                        : 'text-[#3c4043] hover:bg-neutral-50'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer Links */}
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => setActiveModal('help')}
            className="hover:text-[#202124] transition-colors hover:underline focus:outline-none"
          >
            Help
          </button>
          <button
            type="button"
            onClick={() => setActiveModal('privacy')}
            className="hover:text-[#202124] transition-colors hover:underline focus:outline-none"
          >
            Privacy
          </button>
          <button
            type="button"
            onClick={() => setActiveModal('terms')}
            className="hover:text-[#202124] transition-colors hover:underline focus:outline-none"
          >
            Terms
          </button>
        </div>
      </footer>

      {/* Interactive Modal for Help, Privacy & Terms */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#dadce0] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#dadce0]">
              <div className="flex items-center gap-2 text-[#202124]">
                {activeModal === 'help' && <HelpCircle className="w-5 h-5 text-[#1a73e8]" />}
                {activeModal === 'privacy' && <Shield className="w-5 h-5 text-[#0f9d58]" />}
                {activeModal === 'terms' && <FileText className="w-5 h-5 text-[#f4b400]" />}
                <h3 className="font-semibold text-lg capitalize">
                  {activeModal === 'help' && 'AdPulse Publisher Help Center'}
                  {activeModal === 'privacy' && 'Privacy Policy & Publisher Data'}
                  {activeModal === 'terms' && 'Publisher Terms of Service'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-[#5f6368] hover:text-[#202124] hover:bg-neutral-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 text-sm text-[#3c4043] space-y-3 max-h-80 overflow-y-auto leading-relaxed">
              {activeModal === 'help' && (
                <>
                  <p>
                    <strong>Signing In:</strong> Use your registered AdPulse publisher email or demo credentials to access your monetized ad inventory, real-time telemetry, and payment receipts.
                  </p>
                  <p>
                    <strong>Two-Step Verification:</strong> For maximum account security, AdPulse recommends linking your security keys or authenticator app inside your Account Console.
                  </p>
                  <p>
                    <strong>Need direct support?</strong> Reach our global publisher operations at <span className="text-[#1a73e8]">support@adpulse.io</span>.
                  </p>
                </>
              )}

              {activeModal === 'privacy' && (
                <>
                  <p>
                    <strong>AdPulse Privacy Commitment:</strong> We process publisher traffic logs, cookie consents (GDPR & CCPA), and ad placement metrics strictly to deliver relevant programmatic ads and revenue payouts.
                  </p>
                  <p>
                    <strong>No Password Tracking:</strong> All credentials and authentication tokens use industry-standard bcrypt hashing and encrypted sessions.
                  </p>
                  <p>
                    <strong>First-Party Data:</strong> Publishers maintain full data sovereignty over site visitor audience segments.
                  </p>
                </>
              )}

              {activeModal === 'terms' && (
                <>
                  <p>
                    <strong>1. Publisher Agreement:</strong> By using AdPulse Monetization Services, publishers agree to follow our Invalid Traffic & Ad Placement Policies.
                  </p>
                  <p>
                    <strong>2. Revenue Payouts:</strong> Net-30 monthly automated wire transfers and ACH deposits for all accounts meeting the $100 payout threshold.
                  </p>
                  <p>
                    <strong>3. Compliance:</strong> Zero-tolerance policy toward artificial click inflation or automated scraping bot traffic.
                  </p>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-[#dadce0] flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1557bf] rounded-full transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
