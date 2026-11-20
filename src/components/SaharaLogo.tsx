import React from 'react';

interface SaharaLogoProps {
  className?: string;
  showWordmark?: boolean;
}

export const SaharaLogo: React.FC<SaharaLogoProps> = ({
  className = 'w-10 h-10',
  showWordmark = false,
}) => {
  const emblem = (
    <div className={`relative overflow-hidden shrink-0 ${className}`}>
      <img
        src="/assets/aistudio/image_8daf8d86.png"
        alt="sahara emblem"
        referrerPolicy="no-referrer"
        className="absolute max-w-none w-[130px] h-auto -left-[13px] top-1/2 -translate-y-1/2 mix-blend-multiply pointer-events-none select-none"
      />
    </div>
  );

  if (!showWordmark) {
    return emblem;
  }

  return (
    <div className="flex items-center gap-2 min-w-0">
      {emblem}
      <div className="flex flex-col leading-none text-left">
        <span className="font-display text-lg font-extrabold tracking-tight text-[#3D2E3F]">
          sahara
        </span>
        <span className="text-[10px] font-medium text-[#5A4A5C] mt-0.5 whitespace-nowrap">
          with you, for you.
        </span>
      </div>
    </div>
  );
};

export const SaharaFullBanner: React.FC<{ className?: string }> = ({ className = 'w-full' }) => (
  <div className={`overflow-hidden ${className}`}>
    <img
      src="/assets/aistudio/image_8daf8d86.png"
      alt="sahara — with you, for you."
      referrerPolicy="no-referrer"
      className="w-full h-auto object-contain mix-blend-multiply select-none"
    />
  </div>
);
