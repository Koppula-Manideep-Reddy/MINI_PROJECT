import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
  isBooting?: boolean; // New optional prop
}

// Scramble text utility remains the same...
const scrambleText = (
  targetText: string,
  onUpdate: (text: string) => void,
  onComplete: () => void
) => {
  let frame = 0;
  const chars = '!<>-_\\/[]{}—=+*^?#';
  const update = () => {
    frame++;
    let output = '';
    let complete = 0;
    for (let i = 0; i < targetText.length; i++) {
      const from = targetText[i];
      if (frame >= i * 3) {
        output += from;
        complete++;
      } else {
        output += `<span class="opacity-50">${chars[Math.floor(Math.random() * chars.length)]}</span>`;
      }
    }
    onUpdate(output);
    if (complete === targetText.length) {
      onComplete();
    } else {
      requestAnimationFrame(update);
    }
  };
  update();
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, isBooting = false }) => {
  const [progress, setProgress] = useState(0);
  const [displayMessage, setDisplayMessage] = useState('');
  const componentRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const loadingMessages = [
    'INITIALIZING AEGIS V2.1...',
    'LOADING CRYPTOGRAPHIC CORE...',
    'ESTABLISHING SECURE PROTOCOLS...',
    'CALIBRATING QUANTUM ENCRYPTION...',
    'SYSTEM ONLINE'
  ];

  useEffect(() => {
    // If the component is in 'booting' mode, just set everything to 100% and do nothing else.
    if (isBooting) {
      setProgress(100);
      setDisplayMessage('SYSTEM ONLINE');
      if (tlRef.current) {
        tlRef.current.kill(); // Stop any running animations
      }
      return;
    }

    const tl = gsap.timeline({ onComplete });
    tlRef.current = tl;

    tl.to({ val: 0 }, {
      val: 100,
      duration: 4,
      ease: 'power2.out',
      onUpdate: function() {
        setProgress(Math.round(this.targets()[0].val));
      }
    });
    
    loadingMessages.forEach((msg, index) => {
      tl.add(() => {
        scrambleText(msg, (text) => setDisplayMessage(text), () => {});
      }, (index * 4.0) / loadingMessages.length);
    });

    tl.fromTo('.loading-content > *', 
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power2.out' },
      0.2
    );

    return () => {
      tl.kill();
    };
  }, [onComplete, isBooting]); // Add isBooting to the dependency array

  return (
    // We add a 'loading-background' class to target it for fade-out in App.tsx
    <div ref={componentRef} className="fixed inset-0 bg-background z-30 flex items-center justify-center overflow-hidden loading-background">
      
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="absolute bg-cyan-400/30" style={{ top: `${i * 2.5}%`, left: 0, right: 0, height: '1px' }} />
        ))}
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="absolute bg-cyan-400/30" style={{ left: `${i * 2.5}%`, top: 0, bottom: 0, width: '1px' }} />
        ))}
      </div>

      {/* When booting, we fade the main content out to focus on the boot text */}
      <div className={`relative z-10 text-center loading-content transition-opacity duration-500 ${isBooting ? 'opacity-0' : 'opacity-100'}`}>
        
        <div className="aegis-title mb-8">
          <h1 className="font-orbitron text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-wider">
            PAEGIS
          </h1>
          <div className="mt-2 text-fourth font-mono text-sm tracking-[0.2em]">
            ANURAG'S ADVANCED ENCRYPTION INTERFACE
          </div>
        </div>
        
        <div className="w-80 md:w-96 mx-auto">
          <div className="glass-panel p-4 md:p-6 text-center">
            <div className="mb-4 h-5 font-mono text-white-500 text-sm" 
                 dangerouslySetInnerHTML={{ __html: displayMessage || '&nbsp;' }}
            />
            
            <div className="relative bg-slate-800/50 rounded-full h-2 overflow-hidden border border-cyan-400/20">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 to-blue-500 transition-all duration-300 ease-linear flex items-center justify-end"
                style={{ width: `${progress}%` }}
              >
                {/* Percentage text on the bar */}
                {progress > 10 && (
                    <span className="text-white text-[8px] font-bold mr-2">{progress}%</span>
                )}
              </div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;