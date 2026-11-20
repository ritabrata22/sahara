import React from 'react';

interface IconProps {
  className?: string;
}

export const WorkBriefcaseSymbol: React.FC<IconProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
    <path
      d="M17 14V11.5C17 9.84 18.34 8.5 20 8.5H28C29.66 8.5 31 9.84 31 11.5V14"
      stroke="#0B4148"
      strokeWidth="3.2"
      strokeLinecap="round"
    />
    <rect x="6" y="14" width="36" height="26" rx="5.5" fill="#0B4148" />
    <path d="M6 23.5C14 27 34 27 42 23.5" stroke="#7AE0B9" strokeWidth="2.4" />
    <rect x="20.5" y="21" width="7" height="6" rx="1.8" fill="#7AE0B9" />
  </svg>
);

export const EarningsWalletSymbol: React.FC<IconProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
    <rect x="6" y="12" width="34" height="26" rx="5.5" fill="#0B4148" />
    <path d="M10 12L31 7.5C33.2 7 35 8.6 35 10.8V12H10Z" fill="#1F6F78" />
    <rect x="27" y="20" width="15" height="10" rx="3.5" fill="#7AE0B9" stroke="#0B4148" strokeWidth="2" />
    <circle cx="33" cy="25" r="2.2" fill="#0B4148" />
    <path
      d="M14 21H21M14 25H20M16 21C18.2 21 19.5 22.2 19.5 24C19.5 25.8 18 27 15.5 27L20 31.5"
      stroke="#F9FAFB"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TravelShieldSymbol: React.FC<IconProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
    <path
      d="M24 5L9 11.5V22.5C9 32.2 15.4 40.6 24 43.5C32.6 40.6 39 32.2 39 22.5V11.5L24 5Z"
      fill="#0B4148"
    />
    <path
      d="M24 9.5L13 14.3V22.5C13 29.8 17.6 36.2 24 38.8C30.4 36.2 35 29.8 35 22.5V14.3L24 9.5Z"
      fill="#1A656E"
    />
    <path
      d="M18 24.5L22.2 28.7L30.5 19.5"
      stroke="#F9FAFB"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ClinicHospitalSymbol: React.FC<IconProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
    {/* Side wings */}
    <rect x="6" y="21" width="10" height="20" rx="2" fill="#2A7A9B" />
    <rect x="32" y="21" width="10" height="20" rx="2" fill="#2A7A9B" />
    {/* Center building */}
    <rect x="14" y="13" width="20" height="28" rx="2.5" fill="#0B4148" />
    {/* Windows */}
    <rect x="17.5" y="23" width="3.5" height="4" rx="0.8" fill="#E6F4F8" />
    <rect x="27" y="23" width="3.5" height="4" rx="0.8" fill="#E6F4F8" />
    <rect x="9" y="25" width="3.5" height="3.5" rx="0.8" fill="#E6F4F8" />
    <rect x="35.5" y="25" width="3.5" height="3.5" rx="0.8" fill="#E6F4F8" />
    {/* Door */}
    <rect x="21" y="32" width="6" height="9" rx="1.2" fill="#E6F4F8" />
    {/* Red medical cross badge */}
    <circle cx="24" cy="12" r="7" fill="#EA4335" stroke="#FFFFFF" strokeWidth="1.5" />
    <path d="M24 8.5V15.5M20.5 12H27.5" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

export const LegalScalesSymbol: React.FC<IconProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
    <path d="M24 8V38" stroke="#0B4148" strokeWidth="3.4" strokeLinecap="round" />
    <path d="M14 40H34" stroke="#0B4148" strokeWidth="3.8" strokeLinecap="round" />
    <path d="M10 15H38" stroke="#0B4148" strokeWidth="3.2" strokeLinecap="round" />
    <circle cx="24" cy="10" r="3" fill="#0B4148" />
    {/* Left scale */}
    <path d="M12 15L7 27H17L12 15Z" stroke="#0B4148" strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M6.5 27C6.5 30.2 9 32.5 12 32.5C15 32.5 17.5 30.2 17.5 27H6.5Z" fill="#0B4148" />
    {/* Right scale */}
    <path d="M36 15L31 27H41L36 15Z" stroke="#0B4148" strokeWidth="2.2" strokeLinejoin="round" />
    <path d="M30.5 27C30.5 30.2 33 32.5 36 32.5C39 32.5 41.5 30.2 41.5 27H30.5Z" fill="#0B4148" />
  </svg>
);

export const GovernmentBuildingSymbol: React.FC<IconProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
    <path d="M24 7L7 16H41L24 7Z" fill="#0B4148" />
    <rect x="8" y="17.5" width="32" height="3" rx="1" fill="#0B4148" />
    <rect x="11.5" y="21.5" width="4" height="14" rx="1" fill="#0B4148" />
    <rect x="22" y="21.5" width="4" height="14" rx="1" fill="#0B4148" />
    <rect x="32.5" y="21.5" width="4" height="14" rx="1" fill="#0B4148" />
    <rect x="7" y="36.5" width="34" height="4.5" rx="1.5" fill="#0B4148" />
  </svg>
);

export const SkillCapSymbol: React.FC<IconProps> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
    <path d="M24 10L5 19.5L24 29L43 19.5L24 10Z" fill="#0B4148" />
    <path
      d="M13 24.5V33C13 36 18 39 24 39C30 39 35 36 35 33V24.5L24 30L13 24.5Z"
      fill="#1A5C64"
    />
    <path d="M40 21V33" stroke="#0B4148" strokeWidth="2.6" strokeLinecap="round" />
    <circle cx="40" cy="34.5" r="2.5" fill="#0B4148" />
  </svg>
);

export const VoiceMicSymbol: React.FC<IconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <rect x="14.5" y="6" width="11" height="18" rx="5.5" fill="#C83E26" />
    <path
      d="M10 19.5C10 25 14.5 29.5 20 29.5C25.5 29.5 30 25 30 19.5"
      stroke="#0B4148"
      strokeWidth="2.8"
      strokeLinecap="round"
    />
    <path d="M20 29.5V35M14.5 35H25.5" stroke="#0B4148" strokeWidth="2.8" strokeLinecap="round" />
  </svg>
);
