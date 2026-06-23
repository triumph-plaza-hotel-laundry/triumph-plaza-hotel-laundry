import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'loading' | 'logo' | 'text' | 'fade'>('loading');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('logo'), 400);
    const t2 = setTimeout(() => setPhase('text'), 1200);
    const t3 = setTimeout(() => setPhase('fade'), 3200);
    const t4 = setTimeout(() => onComplete(), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ${
      phase === 'fade' ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
    }`}
    style={{ background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #050505 100%)' }}
    >
      {/* Ambient gold glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px] animate-pulse-gold" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-[80px] animate-float" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Radial lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 h-px bg-gradient-to-r from-gold-500/30 to-transparent"
            style={{
              width: '50%',
              transform: `rotate(${i * 30}deg) translateX(-50%)`,
              transformOrigin: '0 0',
            }}
          />
        ))}
      </div>

      {/* Logo container */}
      <div className={`relative z-10 transition-all duration-1000 ease-out ${
        phase === 'loading' ? 'opacity-0 scale-75 rotate-[-10deg]' : 'opacity-100 scale-100 rotate-0'
      }`}>
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full animate-spin-slow">
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold-500/40" />
          </div>

          {/* Inner rotating ring */}
          <div className="absolute inset-3 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '8s' }}>
            <div className="absolute inset-0 rounded-full border border-transparent border-b-gold-500/30" />
          </div>

          {/* Gold glow rings */}
          <div className="absolute inset-0 rounded-full animate-glow" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-500/0 via-gold-500/5 to-gold-500/0 blur-xl" />

          {/* Premium glow effect for logo */}
          <div className="absolute inset-4 rounded-full bg-black shadow-[0_0_60px_20px_rgba(212,175,55,0.15),0_0_100px_40px_rgba(212,175,55,0.1),inset_0_0_60px_30px_rgba(0,0,0,0.8)]" />

          {/* Logo image with gold glow filter */}
          <img
            src="/assets/images/1000407416 copy.png"
            alt="Triumph Plaza Logo"
            className="relative z-10 w-32 h-32 object-contain transition-transform duration-500 hover:scale-105"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(212, 175, 55, 0.6)) drop-shadow(0 0 60px rgba(212, 175, 55, 0.3))',
            }}
          />
        </div>
      </div>

      {/* Hotel name with luxury animation */}
      <div className={`relative z-10 mt-10 text-center transition-all duration-1000 ease-out ${
        phase === 'text' || phase === 'fade' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Decorative line above */}
        <div className={`flex items-center justify-center gap-4 mb-6 transition-all duration-700 delay-200 ${
          phase === 'text' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
        }`}>
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-gold-500/50" />
          <div className="w-2 h-2 rotate-45 bg-gold-500 animate-pulse" />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-gold-500/50" />
        </div>

        <div className="text-4xl font-bold tracking-[0.4em] uppercase mb-2 animate-shine" style={{
          background: 'linear-gradient(135deg, #d4af37 0%, #f5d97a 25%, #d4af37 50%, #f5d97a 75%, #d4af37 100%)',
          backgroundSize: '300% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 40px rgba(212, 175, 55, 0.3)',
        }}>
          TRIUMPH PLAZA
        </div>

        <div className="text-gold-400/60 tracking-[0.8em] uppercase text-sm mt-3 font-light">
          H O T E L
        </div>

        {/* Decorative line below */}
        <div className={`flex items-center justify-center gap-4 mt-6 transition-all duration-700 delay-300 ${
          phase === 'text' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
        }`}>
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-gold-500/50" />
          <div className="w-2 h-2 rotate-45 bg-gold-500/50" />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-gold-500/50" />
        </div>
      </div>

      {/* Premium loading animation */}
      <div className={`relative z-10 mt-12 transition-all duration-500 ${
        phase === 'text' ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="relative w-40 h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent animate-shimmer" style={{ width: '50%' }} />
        </div>
      </div>
    </div>
  );
}
