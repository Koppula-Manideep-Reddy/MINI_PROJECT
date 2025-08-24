import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';

// --- Component Imports ---
import LoadingScreen from './components/LoadingScreen';
import SystemBoot from './components/SystemBoot';
import HomeView from './components/HomeView';
import EncryptionModule from './components/EncryptionModule';
import DecryptionModule from './components/DecryptionModule';
import ThreeScene from './components/ThreeScene';
import ArachnidCursor from './components/ArachnidCursor';

// --- Utilities ---
import { audioManager } from './utils/audio';

export type AppState = 'loading' | 'booting' | 'home' | 'encrypt' | 'decrypt';

function App() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [isLoaded, setIsLoaded] = useState(false); // New state to track if initial loading is done
  const [audioInitialized, setAudioInitialized] = useState(false);

  useEffect(() => {
    const initAudio = async () => {
      if (!audioInitialized) {
        try {
          await audioManager.init();
          setAudioInitialized(true);
        } catch (error) {
          console.warn('Audio initialization failed:', error);
        }
      }
    };
    const handleUserInteraction = () => {
      initAudio();
      document.removeEventListener('mousedown', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
    document.addEventListener('mousedown', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    return () => {
      document.removeEventListener('mousedown', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [audioInitialized]);

  // --- State Transition Handlers ---

  const handleLoadingComplete = () => {
    setIsLoaded(true); // Mark initial loading as complete
    setAppState('booting'); // Transition to the boot sequence
  };

  const handleBootComplete = () => {
    // When boot is complete, fade out both the boot text and the loading screen background
    gsap.to(['.boot-sequence', '.loading-background'], {
        opacity: 0,
        duration: 0.8,
        ease: 'power1.in',
        onComplete: () => {
            setAppState('home');
        }
    });
  };

  const handleNavigate = (targetState: AppState) => {
    gsap.to('.view-container', {
      opacity: 0,
      duration: 0.5,
      ease: 'power1.in',
      onComplete: () => setAppState(targetState)
    });
  };

  const handleBackToHome = () => {
    gsap.to('.module-view', {
      opacity: 0,
      y: 30,
      duration: 0.5,
      ease: 'power1.in',
      onComplete: () => setAppState('home')
    });
  };

  const getThreeSceneMode = (): 'home' | 'encrypt' | 'decrypt' => {
    switch (appState) {
      case 'encrypt': return 'encrypt';
      case 'decrypt': return 'decrypt';
      default: return 'home';
    }
  };

  // --- Render Logic ---

  return (
    <div className="relative min-h-screen bg-background text-text overflow-hidden">
      {appState !== 'loading' && appState !== 'booting' && (
        <ThreeScene 
          mode={getThreeSceneMode()}
          onHolocronClick={appState === 'home' ? () => handleNavigate('encrypt') : undefined}
        />
      )}

      <ArachnidCursor />

      <div className="relative z-10 w-full h-full">
        {audioInitialized && (
        <div className="fixed bottom-4 right-4 text-xs font-mono text-gray-500 z-30 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span>AUDIO SYSTEMS ONLINE</span>
        </div>
        )}
        
        {/*
          MODIFIED LOGIC:
          The LoadingScreen now persists through the 'booting' state
          but receives a prop to tell it to stop animating and just be a background.
        */}
        {(appState === 'loading' || appState === 'booting') && (
            <LoadingScreen 
                onComplete={handleLoadingComplete} 
                isBooting={appState === 'booting'}
            />
        )}

        {appState === 'booting' && (
          <SystemBoot onComplete={handleBootComplete} />
        )}

        {appState === 'home' && (
          <div className="view-container">
            <HomeView 
              onEncrypt={() => handleNavigate('encrypt')}
              onDecrypt={() => handleNavigate('decrypt')}
            />
          </div>
        )}

        {appState === 'encrypt' && (
          <div className="module-view">
            <EncryptionModule onBack={handleBackToHome} />
          </div>
        )}

        {appState === 'decrypt' && (
          <div className="module-view">
            <DecryptionModule onBack={handleBackToHome} />
          </div>
        )}
      </div>

      {audioInitialized && (
        <div className="fixed bottom-4 right-4 text-xs font-mono text-gray-500 z-30 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span>AUDIO SYSTEMS ONLINE</span>
        </div>
      )}
    </div>
  );
}

export default App;