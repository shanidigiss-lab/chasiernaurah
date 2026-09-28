import React, { useRef, useState, useCallback } from 'react';
import { createParticleBurst } from '../utils/particleBurst';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  magneticStrength?: number; // 0.1 to 0.5 (default: 0.28)
  burstColors?: string[];
  disableBurst?: boolean;
  className?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  magneticStrength = 0.28,
  burstColors,
  disableBurst = false,
  className = '',
  onClick,
  onMouseMove,
  onMouseLeave,
  disabled,
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !btnRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * magneticStrength;
    const deltaY = (e.clientY - centerY) * magneticStrength;

    // Clamp translation for subtle tactile feel
    const maxPull = 12;
    const clampedX = Math.max(-maxPull, Math.min(maxPull, deltaX));
    const clampedY = Math.max(-maxPull, Math.min(maxPull, deltaY));

    setPosition({ x: clampedX, y: clampedY });
    setIsHovered(true);

    if (onMouseMove) onMouseMove(e);
  }, [disabled, magneticStrength, onMouseMove]);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
    if (onMouseLeave) onMouseLeave(e);
  }, [onMouseLeave]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (!disableBurst) {
      createParticleBurst(e.clientX, e.clientY, burstColors);
    }

    if (onClick) {
      onClick(e);
    }
  }, [disabled, disableBurst, burstColors, onClick]);

  return (
    <button
      ref={btnRef}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isHovered 
          ? 'transform 0.12s cubic-bezier(0.25, 1, 0.5, 1)' 
          : 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}
      className={`relative inline-flex items-center justify-center transition-shadow cursor-pointer select-none active:scale-[0.96] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
