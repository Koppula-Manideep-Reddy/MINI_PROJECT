import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ArachnidCursor: React.FC = () => {
  const cursorRef = useRef<SVGSVGElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const isClicking = useRef(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    // Mouse down handler
    const handleMouseDown = () => {
      isClicking.current = true;
      gsap.to('.arachnid-leg', {
        scaleY: 0.3,
        duration: 0.1,
        ease: 'power2.out'
      });
    };

    // Mouse up handler
    const handleMouseUp = () => {
      isClicking.current = false;
      gsap.to('.arachnid-leg', {
        scaleY: 1,
        duration: 0.3,
        ease: 'elastic.out(1, 0.5)'
      });
    };

    // Hover handlers
    const handleMouseEnter = () => {
      isHovering.current = true;
      gsap.to('.arachnid-leg', {
        stroke: 'var(--color-secondary)',
        scaleX: 1.2,
        duration: 0.2
      });
    };

    const handleMouseLeave = () => {
      isHovering.current = false;
      gsap.to('.arachnid-leg', {
        stroke: 'var(--color-primary)',
        scaleX: 1,
        duration: 0.2
      });
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll('button, input, select, textarea, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Animation loop
    const animate = () => {
      if (!cursor) return;

      // Smooth cursor movement with lerp
      const lerpFactor = isHovering.current ? 1 : 0.1;
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * lerpFactor;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * lerpFactor;

      cursor.style.transform = `translate(${cursorPos.current.x - 20}px, ${cursorPos.current.y - 20}px)`;

      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <svg
      ref={cursorRef}
      className="custom-cursor"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      style={{ display: window.innerWidth <= 768 ? 'none' : 'block' }}
    >
      <g transform="translate(20,20)">
        {/* Arachnid legs */}
        <line x1="-15" y1="-8" x2="-8" y2="-4" className="arachnid-leg" stroke="var(--color-primary)" strokeWidth="1" />
        <line x1="-15" y1="-4" x2="-8" y2="-2" className="arachnid-leg" stroke="var(--color-primary)" strokeWidth="1" />
        <line x1="-15" y1="4" x2="-8" y2="2" className="arachnid-leg" stroke="var(--color-primary)" strokeWidth="1" />
        <line x1="-15" y1="8" x2="-8" y2="4" className="arachnid-leg" stroke="var(--color-primary)" strokeWidth="1" />
        
        <line x1="15" y1="-8" x2="8" y2="-4" className="arachnid-leg" stroke="var(--color-primary)" strokeWidth="1" />
        <line x1="15" y1="-4" x2="8" y2="-2" className="arachnid-leg" stroke="var(--color-primary)" strokeWidth="1" />
        <line x1="15" y1="4" x2="8" y2="2" className="arachnid-leg" stroke="var(--color-primary)" strokeWidth="1" />
        <line x1="15" y1="8" x2="8" y2="4" className="arachnid-leg" stroke="var(--color-primary)" strokeWidth="1" />
        
        {/* Central body */}
        <circle cx="0" cy="0" r="3" fill="var(--color-primary)" opacity="0.8" />
        <circle cx="0" cy="0" r="1" fill="var(--color-secondary)" />
      </g>
    </svg>
  );
};

export default ArachnidCursor;