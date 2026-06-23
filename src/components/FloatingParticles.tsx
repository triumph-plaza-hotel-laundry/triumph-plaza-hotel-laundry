import React from 'react';

export default function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Subtle ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 opacity-20">
        <div className="w-full h-full bg-gold-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 opacity-15">
        <div className="w-full h-full bg-gold-500/10 rounded-full blur-[80px]" />
      </div>
    </div>
  );
}
