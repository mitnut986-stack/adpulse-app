import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = false,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Custom Original Geometric AdPulse Emblem */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
          aria-hidden="true"
        >
          {/* Top-left quadrant: Deep Royal Blue (Primary Engine) */}
          <rect
            x="4"
            y="4"
            width="14"
            height="14"
            rx="4"
            fill="#1A73E8"
          />
          {/* Top-right quadrant: Vibrant Azure (Impressions) */}
          <rect
            x="22"
            y="4"
            width="14"
            height="14"
            rx="4"
            fill="#4285F4"
            opacity="0.9"
          />
          {/* Bottom-left quadrant: Emerald Teal (Yield & Monetization) */}
          <rect
            x="4"
            y="22"
            width="14"
            height="14"
            rx="4"
            fill="#0F9D58"
          />
          {/* Bottom-right quadrant: Amber Gold (Revenue & Growth) */}
          <rect
            x="22"
            y="22"
            width="14"
            height="14"
            rx="4"
            fill="#F4B400"
          />
          {/* Center intersecting dynamic pulse dot */}
          <circle cx="20" cy="20" r="3.5" fill="#FFFFFF" />
          <circle cx="20" cy="20" r="2" fill="#1A73E8" />
        </svg>
      </div>

      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-semibold tracking-tight text-[#202124] ${textSizes[size]}`}>
            AdPulse
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] text-[#5f6368] font-normal tracking-normal mt-0.5">
            Publisher & Advertising Network
          </span>
        )}
      </div>
    </div>
  );
};
