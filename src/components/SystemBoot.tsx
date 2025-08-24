import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface SystemBootProps {
  onComplete: () => void;
}

const SystemBoot: React.FC<SystemBootProps> = ({ onComplete }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  

  const bootSequence = [
    '[>> INITIALIZING AEGIS CRYPTOGRAPHIC CORE...]',
    '[>> LOADING QUANTUM ENCRYPTION PROTOCOLS...]',
    '[>> ESTABLISHING SECURE MEMORY CHANNELS...]',
    '[>> CALIBRATING CIPHER ALGORITHMS...]',
    '[>> CALIBRATING NEURAL NETWORKS...]',
    '[>> VERIFYING SECURITY PARAMETERS...]',
    '[>> INITIALIZING 3D INTERFACE...]',
    '[SYSTEM ONLINE]'
  ];

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const typeText = (text: string, index: number = 0) => {

      
      if (index <= text.length) {
        setDisplayedText(text.substring(0, index));
        timeout = setTimeout(() => typeText(text, index + 1), 10);
      } else {
        // Move to next line after a pause
        setTimeout(() => {
          if (currentLine < bootSequence.length - 1) {
            setCurrentLine(prev => prev + 1);
            setDisplayedText('');
          } else {
            // Boot sequence complete
            setTimeout(() => {
              gsap.to('.boot-sequence', {
                opacity: 0,
                y: -20,
                duration: 0.2,
                onComplete: onComplete
              });
            }, 1000);
          }
        }, 500);
      }
    };

    if (currentLine < bootSequence.length) {
      typeText(bootSequence[currentLine]);
    }

    return () => clearTimeout(timeout);
  }, [currentLine, onComplete]);

  return (
    <div className="boot-sequence fixed top-8 left-8 z-40">
      <div className="space-y-2">
        {bootSequence.slice(0, currentLine).map((line, index) => (
          <div key={index} className="text-primary font-mono text-sm opacity-60">
            {line}
          </div>
        ))}
        <div className="text-third font-mono text-sm flex items-center">
          {displayedText}
          <span className="ml-1 w-2 h-4 bg-primary animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default SystemBoot;