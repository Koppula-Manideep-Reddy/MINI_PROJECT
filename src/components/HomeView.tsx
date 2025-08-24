import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { Shield, Lock, Unlock } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface HomeViewProps {
  onEncrypt: () => void;
  onDecrypt: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onEncrypt, onDecrypt }) => {
  useEffect(() => {
    // Animate in elements
    gsap.fromTo('.home-title', 
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.5 }
    );

    gsap.fromTo('.home-subtitle', 
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.8 }
    );

    gsap.fromTo('.action-button', 
      { opacity: 0, y: 30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)', delay: 1.2, stagger: 0.2 }
    );

    gsap.fromTo('.status-indicator', 
      { opacity: 0 },
      { opacity: 1, duration: 0.5, delay: 1.8 }
    );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-4xl">
        {/* Main Title */}
        <div className="home-title mb-8">
          <h1 className="text-6xl md:text-8xl font-orbitron font-black text-primary neon-text mb-4" style={{ letterSpacing: '8px' }}>
            PAEGIS
          </h1>
          <div className="flex items-center justify-center space-x-4 text-primary/60">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary" />
            <Shield size={24} />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary" />
          </div>
        </div>

        {/* Subtitle */}
        <p className="home-subtitle text-xl md:text-2xl font-mono text-gray-300 mb-12" style={{ letterSpacing: '2px' }}>
         ANURAG'S ADVANCED ENCRYPTION & GUARDED INTELLIGENCE SYSTEM
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-12">
          <button
            onClick={() => {
              audioManager.play('swoosh');
              onEncrypt();
            }}
            className="action-button group glass-panel border-primary text-primary font-mono py-6 px-12 rounded-lg hover:neon-border hover:text-fourth transition-all duration-500 transform hover:scale-105 flex items-center space-x-4 w-full sm:w-auto"
            onMouseEnter={() => audioManager.play('hover')}
          >
            <Lock size={24} className="group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-lg" style={{ letterSpacing: '2px' }}>ENGAGE ENCRYPTION</span>
          </button>

          <button
            onClick={() => {
              audioManager.play('swoosh');
              onDecrypt();
            }}
            className="action-button group glass-panel border-secondary text-secondary font-mono py-6 px-12 rounded-lg hover:neon-border hover:text-third transition-all duration-500 transform hover:scale-105 flex items-center space-x-4 w-full sm:w-auto"
            onMouseEnter={() => audioManager.play('hover')}
          >
            <Unlock size={24} className="group-hover:-rotate-12 transition-transform duration-300" />
            <span className="text-lg" style={{ letterSpacing: '2px' }}>INITIATE DECRYPTION</span>
          </button>
        </div>

        {/* Status Indicator */}
        <div className="status-indicator flex items-center justify-center space-x-3 text-sm font-mono text-gray-500">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>SYSTEM STATUS: OPERATIONAL</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 grid-bg opacity-20 -z-10" />
      </div>
    </div>
  );
};

export default HomeView;