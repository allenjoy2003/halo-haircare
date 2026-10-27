import React from 'react';

/**
 * HaloMark - The geometric open ring with soft aqua center dot.
 * Features rounded stroke caps, 30° open gap, and precision centering.
 */
export function HaloMark({ size = 32, variant = 'navy', className = '', animated = false }) {
  const strokeColor = variant === 'white' ? '#FFFFFF' : variant === 'aqua' ? '#7FD6D0' : '#0B1B2B';
  const dotColor = variant === 'aqua' ? '#0B1B2B' : '#7FD6D0';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${animated ? 'group-hover:rotate-12 transition-transform duration-500 ease-out' : ''} ${className}`}
      aria-label="Halo brand mark"
    >
      <circle
        cx="60"
        cy="60"
        r="40"
        stroke={strokeColor}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="230 21"
        transform="rotate(-60 60 60)"
        className={animated ? 'transition-all duration-700' : ''}
      />
      <circle
        cx="60"
        cy="60"
        r="10"
        fill={dotColor}
        className={animated ? 'group-hover:scale-125 transition-transform origin-center duration-300' : ''}
      />
    </svg>
  );
}

/**
 * HaloLogo - Full brand lockup: HaloMark + lowercase "halo" wordmark converted to vector paths.
 * Renders identically across devices without relying on external fonts.
 */
export function HaloLogo({ size = 28, variant = 'navy', showTagline = false, className = '' }) {
  const textColor = variant === 'white' ? '#FFFFFF' : variant === 'aqua' ? '#7FD6D0' : '#0B1B2B';
  const scale = size / 28;

  return (
    <div className={`inline-flex items-center space-x-2.5 select-none group cursor-pointer ${className}`}>
      <HaloMark size={size} variant={variant} animated={true} />
      <div className="flex flex-col">
        {/* Lowercase "halo" vector wordmark (Sora geometric paths) */}
        <svg
          height={size * 0.72}
          viewBox="0 0 136 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
          aria-label="halo"
        >
          {/* h */}
          <path
            d="M6 3V31M6 14.5C8.8 11.2 12.8 9.5 17.5 9.5C24.5 9.5 28 13.8 28 21.2V31"
            stroke={textColor}
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* a */}
          <path
            d="M58 20.5V31M58 21C58 14.6 52.8 10 46 10C39.2 10 34 14.5 34 20.8C34 27.2 39.2 31.5 46 31.5C51 31.5 55.4 29 57.5 25M58 20.5C54.8 20.5 40 19.5 35 24"
            stroke={textColor}
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* l */}
          <path
            d="M74 3V31"
            stroke={textColor}
            strokeWidth="4.2"
            strokeLinecap="round"
          />
          {/* o */}
          <circle
            cx="108"
            cy="20.8"
            r="10.8"
            stroke={textColor}
            strokeWidth="4.2"
          />
        </svg>
        {showTagline && (
          <span className="text-[10px] font-sans tracking-tight text-halo-muted -mt-0.5 font-medium">
            Haircare, clarified.
          </span>
        )}
      </div>
    </div>
  );
}

export default HaloLogo;
