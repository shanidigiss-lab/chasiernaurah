import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Rotate3d, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Wifi, 
  QrCode, 
  Check, 
  Copy, 
  RefreshCw,
  Compass,
  Zap,
  Layers
} from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { usePOS } from '../context/POSContext';
import { SUPER_ADMIN_CREDENTIALS } from '../data/authData';
import { createParticleBurst } from '../utils/particleBurst';

interface GyroscopicDisplayCardProps {
  variant?: 'compact' | 'full';
  className?: string;
  onAutofillLogin?: () => void;
}

export const GyroscopicDisplayCard: React.FC<GyroscopicDisplayCardProps> = ({
  variant = 'full',
  className = '',
  onAutofillLogin,
}) => {
  const { currentUser, addToast } = usePOS();
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // 3D Angles and Glare States
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });
  
  // Interactive Orbit / Drag Mode
  const [isInteractiveDrag, setIsInteractiveDrag] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragRotation, setDragRotation] = useState({ x: 0, y: 0 });
  const [isAutoOrbit, setIsAutoOrbit] = useState(false);

  // Gyroscope tracking status
  const [hasGyroscope, setHasGyroscope] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mouse Move Tilt (Desktop)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isInteractiveDrag || !cardContainerRef.current) return;

    const rect = cardContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Gyroscopic tilt limit: +- 18 degrees
    const rotX = -((y - centerY) / centerY) * 16;
    const rotY = ((x - centerX) / centerX) * 18;

    setRotateX(rotX);
    setRotateY(rotY);

    // Glare position calculation
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY, opacity: 0.35 });
  }, [isInteractiveDrag]);

  const handleMouseLeave = useCallback(() => {
    if (isInteractiveDrag) return;
    setRotateX(0);
    setRotateY(0);
    setGlarePosition({ x: 50, y: 50, opacity: 0 });
  }, [isInteractiveDrag]);

  // Mobile Device Orientation (Real Gyroscope on supported mobile/tablets)
  useEffect(() => {
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (isInteractiveDrag) return;
      if (event.beta !== null && event.gamma !== null) {
        setHasGyroscope(true);
        // Normalize mobile tilt
        const clampedBeta = Math.max(-30, Math.min(30, event.beta - 45));
        const clampedGamma = Math.max(-30, Math.min(30, event.gamma));

        setRotateX(-clampedBeta * 0.5);
        setRotateY(clampedGamma * 0.5);
        setGlarePosition({
          x: 50 + clampedGamma,
          y: 50 + clampedBeta,
          opacity: 0.3,
        });
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }
    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      }
    };
  }, [isInteractiveDrag]);

  // Auto-Orbit 360 Animation Loop
  useEffect(() => {
    let frameId: number;
    let angle = 0;

    if (isAutoOrbit) {
      const animateOrbit = () => {
        angle += 0.8;
        const currentRotY = Math.sin((angle * Math.PI) / 180) * 35;
        const currentRotX = Math.cos((angle * Math.PI) / 180) * 12;

        setDragRotation({ x: currentRotX, y: currentRotY });
        setGlarePosition({
          x: 50 + Math.sin((angle * Math.PI) / 180) * 40,
          y: 50 + Math.cos((angle * Math.PI) / 180) * 30,
          opacity: 0.4,
        });

        frameId = requestAnimationFrame(animateOrbit);
      };
      frameId = requestAnimationFrame(animateOrbit);
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isAutoOrbit]);

  // Drag to Rotate handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isInteractiveDrag) return;
    setIsDragging(true);
    setIsAutoOrbit(false);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleContainerMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isInteractiveDrag) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setDragRotation((prev) => ({
      x: Math.max(-60, Math.min(60, prev.x - deltaY * 0.4)),
      y: prev.y + deltaX * 0.5,
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Flip Toggle
  const toggleFlip = (e?: React.MouseEvent) => {
    if (e) {
      createParticleBurst(e.clientX, e.clientY, ['#2f6481', '#eab308', '#a1d4f5']);
    }
    setIsFlipped((prev) => !prev);
  };

  const reset3DView = () => {
    setDragRotation({ x: 0, y: 0 });
    setRotateX(0);
    setRotateY(0);
    setIsAutoOrbit(false);
    setIsFlipped(false);
  };

  const handleCopyCredentials = (e: React.MouseEvent) => {
    navigator.clipboard.writeText(`User: ${SUPER_ADMIN_CREDENTIALS.username} | Password: ${SUPER_ADMIN_CREDENTIALS.password}`);
    setCopied(true);
    addToast('info', 'Kredensial Disalin', 'Username dan password Super Admin disalin ke clipboard.');
    createParticleBurst(e.clientX, e.clientY, ['#10b981', '#ffffff', '#38bdf8']);
    setTimeout(() => setCopied(false), 2000);
  };

  // Compute final transformation
  const computedRotX = isInteractiveDrag ? dragRotation.x : rotateX;
  const computedRotY = (isInteractiveDrag ? dragRotation.y : rotateY) + (isFlipped ? 180 : 0);

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* 3D Perspective Stage */}
      <div 
        className="w-full py-4 flex justify-center items-center"
        style={{ perspective: '1100px' }}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleContainerMouseMove}
      >
        <div
          ref={cardContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          style={{
            transform: `rotateX(${computedRotX}deg) rotateY(${computedRotY}deg) scale3d(1, 1, 1)`,
            transformStyle: 'preserve-3d',
            transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
            cursor: isInteractiveDrag ? (isDragging ? 'grabbing' : 'grab') : 'default',
          }}
          className="relative w-full max-w-[380px] h-[225px] rounded-2xl shadow-xl transition-shadow duration-300"
        >
          {/* FRONT FACE */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
            }}
            className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1b3b4f] via-[#244f66] to-[#122734] border border-[#5995b7]/50 p-5 text-white flex flex-col justify-between shadow-2xl"
          >
            {/* Specular Dynamic Glare Highlight */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-200"
              style={{
                background: `radial-gradient(circle 240px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,${glarePosition.opacity}), transparent 70%)`,
              }}
            />

            {/* Subtle Metallic Grid Texture */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

            {/* Card Header: Brand & NFC Signal */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-xs">
                  <ShieldCheck className="w-4 h-4 text-[#a1d4f5]" />
                </div>
                <div>
                  <span className="font-black text-[13px] tracking-wider text-white uppercase block leading-none">
                    KASIRKU ENTERPRISE
                  </span>
                  <span className="text-[9px] text-[#a1d4f5] font-semibold tracking-widest uppercase">
                    Security Authorization
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-white/60">
                <Wifi className="w-4 h-4 rotate-90" />
                <span className="text-[9px] font-mono font-bold tracking-widest text-emerald-400">NFC ON</span>
              </div>
            </div>

            {/* Card Mid: EMV Chip & Pass ID */}
            <div className="relative z-10 flex items-center justify-between my-auto pt-2">
              {/* EMV Microchip Render */}
              <div className="w-11 h-9 rounded-md bg-gradient-to-br from-[#ffd700] via-[#e5a900] to-[#b37a00] border border-[#ffeb80] shadow-xs flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(45deg,#000_0,#000_1px,transparent_0,transparent_3px)]" />
                <Cpu className="w-5 h-5 text-amber-950 opacity-75" />
              </div>

              <div className="text-right">
                <span className="text-[9px] text-white/50 block font-semibold uppercase tracking-wider">
                  Tipe Otorisasi
                </span>
                <span className="text-[12px] font-black tracking-wide text-amber-300 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                  SUPER ADMINISTRATOR
                </span>
              </div>
            </div>

            {/* Card Footer: User Credentials & Hologram */}
            <div className="relative z-10 pt-2 border-t border-white/15 flex items-end justify-between">
              <div>
                <span className="text-[9px] text-white/60 block uppercase tracking-wider">Operator ID</span>
                <span className="font-mono font-bold text-[14px] text-white tracking-wider">
                  {currentUser?.username || SUPER_ADMIN_CREDENTIALS.username}
                </span>
                <span className="text-[10px] text-[#a1d4f5] block font-medium">
                  {currentUser?.fullName || 'Naurah Digital HQ'}
                </span>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[8px] text-white/50 font-mono tracking-widest">EXP: 12/2029</span>
                <div className="px-2 py-0.5 mt-0.5 rounded bg-white/15 border border-white/20 text-[9px] font-bold text-white tracking-widest">
                  VALID ACTIVE
                </div>
              </div>
            </div>
          </div>

          {/* BACK FACE (Flipped 180 deg) */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
            className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-[#151c22] via-[#202930] to-[#0f1418] border border-white/20 text-white flex flex-col justify-between shadow-2xl"
          >
            {/* Magnetic Black Stripe */}
            <div className="w-full h-9 bg-[#0a0d0f] border-y border-white/10 mt-3 shadow-inner" />

            {/* Barcode & Security Strip */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 bg-white/95 p-1.5 rounded-lg text-[#191c1e] font-mono text-[10px] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <QrCode className="w-5 h-5 text-[#2f6481]" />
                    <div>
                      <span className="block text-[8px] text-[#71787e] font-sans font-bold leading-none">SIGNATURE CODE</span>
                      <span className="font-bold tracking-wider">AUTH-9942-ND-SA</span>
                    </div>
                  </div>
                  <span className="bg-[#cfe2f1] text-[#2f6481] px-1.5 py-0.5 rounded font-black text-[9px]">
                    256-AES
                  </span>
                </div>

                <MagneticButton
                  onClick={handleCopyCredentials}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold border border-white/20 flex items-center gap-1 shrink-0"
                  title="Salin Kredensial"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </MagneticButton>
              </div>

              {/* Back Info */}
              <div className="text-[10px] text-white/70 space-y-1 bg-black/30 p-2 rounded-lg border border-white/10">
                <div className="flex justify-between items-center">
                  <span>Username Super Admin:</span>
                  <span className="font-mono font-bold text-white">naurahdigiss01</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Password:</span>
                  <span className="font-mono font-bold text-amber-300">10ssigidharuan</span>
                </div>
              </div>

              {/* Action Button on Card Back */}
              {onAutofillLogin && (
                <MagneticButton
                  onClick={onAutofillLogin}
                  burstColors={['#38bdf8', '#fbbf24', '#ffffff']}
                  className="w-full py-1.5 bg-[#2f6481] hover:bg-[#244f66] text-white text-[11px] font-bold rounded-lg shadow-sm border border-[#5995b7]"
                >
                  Gunakan Kredensial Ini ke Form
                </MagneticButton>
              )}
            </div>

            {/* Card Back Warning Footer */}
            <div className="px-4 py-1.5 bg-black/40 text-[8px] text-white/50 border-t border-white/10 flex items-center justify-between">
              <span>Hanya untuk operator berlisensi • KASIRKU OS</span>
              <span>v2.6 Enterprise</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Gyroscopic & 3D Orbit Controls */}
      <div className="w-full max-w-[380px] mt-2 flex flex-wrap items-center justify-between gap-2 text-[12px]">
        {/* Flip Card 3D Button */}
        <MagneticButton
          id="btn-3d-card-flip"
          onClick={toggleFlip}
          className="px-3.5 py-1.5 bg-white border border-[#c1c7cd] hover:border-[#2f6481] text-[#191c1e] rounded-xl font-bold text-[12px] shadow-2xs flex items-center gap-1.5"
        >
          <Rotate3d className="w-4 h-4 text-[#2f6481]" />
          <span>{isFlipped ? 'Lihat Sisi Depan' : 'Balik Kartu (Flip 3D)'}</span>
        </MagneticButton>

        {/* Free Orbit / Gyro Toggle */}
        <MagneticButton
          id="btn-toggle-orbit"
          onClick={() => {
            setIsInteractiveDrag(!isInteractiveDrag);
            setIsAutoOrbit(false);
          }}
          className={`px-3 py-1.5 rounded-xl font-bold text-[12px] border transition-all flex items-center gap-1.5 shadow-2xs ${
            isInteractiveDrag
              ? 'bg-[#cfe2f1] text-[#14374a] border-[#2f6481]'
              : 'bg-white text-[#41484d] border-[#c1c7cd] hover:text-[#191c1e]'
          }`}
          title="Klik & Geser mouse untuk memutar kartu 3D bebas"
        >
          <Compass className="w-4 h-4 text-[#2f6481]" />
          <span>{isInteractiveDrag ? 'Mode Putar Aktif' : 'Rotasi Bebas 3D'}</span>
        </MagneticButton>

        {/* Auto Orbit & Reset Controls */}
        <div className="flex items-center gap-1.5">
          <MagneticButton
            onClick={() => setIsAutoOrbit(!isAutoOrbit)}
            className={`p-2 rounded-xl border transition-colors shadow-2xs ${
              isAutoOrbit 
                ? 'bg-amber-100 border-amber-300 text-amber-900' 
                : 'bg-white border-[#c1c7cd] text-[#41484d] hover:text-[#191c1e]'
            }`}
            title="Putar Otomatis 360°"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAutoOrbit ? 'animate-spin' : ''}`} />
          </MagneticButton>

          <MagneticButton
            onClick={reset3DView}
            className="p-2 bg-white border border-[#c1c7cd] hover:bg-[#edeef0] text-[#71787e] rounded-xl shadow-2xs"
            title="Reset Sudut Posisi"
          >
            <Layers className="w-3.5 h-3.5" />
          </MagneticButton>
        </div>
      </div>

      {/* Gyroscope Indicator */}
      <div className="mt-2 text-[11px] text-[#71787e] flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>
          {hasGyroscope 
            ? 'Gyroscopic Device Sensor Aktif' 
            : isInteractiveDrag 
            ? 'Drag kursor untuk rotasi 3D bebas' 
            : 'Arahkan kursor untuk efek Gyroscopic 3D Tilt'}
        </span>
      </div>
    </div>
  );
};
