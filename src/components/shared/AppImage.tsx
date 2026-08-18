import React, { useState } from 'react';

interface AppImageProps {
  src?: string;
  alt?: string;
  className?: string;
  type?: 'avatar' | 'vehicle' | 'incident' | 'document' | 'mechanic' | 'logo';
  fallbackIcon?: string;
}

export const AppImage: React.FC<AppImageProps> = ({
  src,
  alt = '',
  className = '',
  type = 'avatar',
  fallbackIcon,
}) => {
  const [hasError, setHasError] = useState(false);

  // Default fallback icons based on image type
  const getDefaultIcon = () => {
    if (fallbackIcon) return fallbackIcon;
    switch (type) {
      case 'avatar':
      case 'mechanic':
        return 'person';
      case 'vehicle':
        return 'directions_car';
      case 'incident':
        return 'minor_crash';
      case 'document':
        return 'description';
      case 'logo':
        return 'car_repair';
      default:
        return 'image';
    }
  };

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 text-slate-500 font-medium select-none overflow-hidden ${className}`}
        title={alt}
      >
        <span className="material-symbols-outlined text-[1.4em]">
          {getDefaultIcon()}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
};
