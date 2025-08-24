import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface ThreeSceneProps {
  onHolocronClick?: () => void;
  mode?: 'home' | 'encrypt' | 'decrypt';
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ onHolocronClick, mode = 'home' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const holocronRef = useRef<THREE.Group>();
  const particlesRef = useRef<THREE.Points>();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Camera position
    camera.position.z = 5;

    // Create starfield particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00f6ff,
      size: 0.02,
      transparent: true,
      opacity: 0.6
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Create Holocron
    const holocronGroup = new THREE.Group();
    
    // Outer cube
    const outerGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const outerMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f6ff,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const outerCube = new THREE.Mesh(outerGeometry, outerMaterial);
    
    // Inner cube
    const innerGeometry = new THREE.BoxGeometry(1, 1, 1);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0xd900ff,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const innerCube = new THREE.Mesh(innerGeometry, innerMaterial);
    
    // Core sphere
    const coreGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f6ff,
      transparent: true,
      opacity: 0.8
    });
    const coreSphere = new THREE.Mesh(coreGeometry, coreMaterial);

    holocronGroup.add(outerCube);
    holocronGroup.add(innerCube);
    holocronGroup.add(coreSphere);
    
    scene.add(holocronGroup);
    holocronRef.current = holocronGroup;

    // Grid floor
    const gridHelper = new THREE.GridHelper(20, 40, 0x00f6ff, 0x00f6ff);
    gridHelper.position.y = -3;
    gridHelper.material.opacity = 0.1;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Mouse movement handler
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Click handler for holocron
    const raycaster = new THREE.Raycaster();
    const handleClick = (event: MouseEvent) => {
      if (!cameraRef.current || !holocronRef.current) return;

      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(holocronRef.current.children);

      if (intersects.length > 0 && onHolocronClick) {
        onHolocronClick();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);

    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;

      // Rotate holocron
      if (holocronRef.current) {
        holocronRef.current.rotation.x += 0.005;
        holocronRef.current.rotation.y += 0.01;
        
        // Mouse interaction
        holocronRef.current.rotation.x += mouseRef.current.y * 0.001;
        holocronRef.current.rotation.y += mouseRef.current.x * 0.001;
      }

      // Animate particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.0005;
        
        // Parallax effect
        particlesRef.current.position.x = mouseRef.current.x * 0.1;
        particlesRef.current.position.y = mouseRef.current.y * 0.1;
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, [onHolocronClick]);

  // Handle mode changes
  useEffect(() => {
    if (!holocronRef.current) return;

    switch (mode) {
      case 'encrypt':
        gsap.to(holocronRef.current.scale, {
          x: 0.5, y: 0.5, z: 0.5,
          duration: 1,
          ease: 'power2.inOut'
        });
        gsap.to(holocronRef.current.position, {
          x: -2, y: 1,
          duration: 1,
          ease: 'power2.inOut'
        });
        break;
      case 'decrypt':
        gsap.to(holocronRef.current.scale, {
          x: 0.5, y: 0.5, z: 0.5,
          duration: 1,
          ease: 'power2.inOut'
        });
        gsap.to(holocronRef.current.position, {
          x: 2, y: 1,
          duration: 1,
          ease: 'power2.inOut'
        });
        break;
      default:
        gsap.to(holocronRef.current.scale, {
          x: 1, y: 1, z: 1,
          duration: 1,
          ease: 'power2.inOut'
        });
        gsap.to(holocronRef.current.position, {
          x: 0, y: 0,
          duration: 1,
          ease: 'power2.inOut'
        });
    }
  }, [mode]);

  return <div ref={mountRef} className="fixed inset-0 -z-10" />;
};

export default ThreeScene;