import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { Unlock, AlertTriangle, CheckCircle } from 'lucide-react';
import { decryptText } from '../utils/ciphers';
import { audioManager } from '../utils/audio';

interface DecryptionModuleProps {
  onBack: () => void;
}

const DecryptionModule: React.FC<DecryptionModuleProps> = ({ onBack }) => {
  const [encrypted, setEncrypted] = useState('');
  const [key, setKey] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [method, setMethod] = useState('caesar');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Animate in
    gsap.fromTo('.decrypt-module', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
  }, []);

  const handleDecrypt = async () => {
    if (!encrypted.trim() || !key.trim() || !authCode.trim()) return;

    setIsLoading(true);
    setError('');
    audioManager.play('click');

    // Show loading animation
    gsap.to('.loading-circuit', { rotation: 360, duration: 2, ease: 'none', repeat: -1 });

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing
      const decrypted = decryptText(encrypted, key, authCode, method);
      setResult(decrypted);
      setShowSuccess(true);
      audioManager.play('success');
      
      // Show success modal
      gsap.fromTo('.success-modal',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
      );
    } catch (err) {
      setError('ACCESS DENIED // AUTHENTICATION FAILED');
      audioManager.play('error');
      
      // Flash error on inputs
      gsap.to('.error-input', {
        borderColor: 'var(--color-error)',
        duration: 0.1,
        yoyo: true,
        repeat: 3
      });
    } finally {
      setIsLoading(false);
      gsap.set('.loading-circuit', { rotation: 0 });
    }
  };

  const closeSuccessModal = () => {
    gsap.to('.success-modal', {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      onComplete: () => setShowSuccess(false)
    });
  };

  return (
    <div className="decrypt-module min-h-screen p-8 flex items-center justify-center">
      <div className="glass-panel p-8 max-w-2xl w-full relative">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-orbitron font-bold text-secondary neon-text" style={{ letterSpacing: '2px' }}>
            DECRYPTION MODULE
          </h2>
          <button
            onClick={onBack}
            className="text-primary hover:text-secondary transition-colors font-mono"
            onMouseEnter={() => audioManager.play('hover')}
            onMouseDown={() => audioManager.play('click')}
          >
            [RETURN]
          </button>
        </div>

        <div className="space-y-6">
          {/* Cipher Method */}
          <div>
            <label className="block text-sm font-mono text-gray-300 mb-2">
              CIPHER METHOD
            </label>
            <select
              value={method}
              onChange={(e) => {
                setMethod(e.target.value);
                audioManager.play('click');
              }}
              className="w-full bg-gray-900/50 border border-secondary/30 rounded p-3 text-text font-mono focus:border-secondary focus:outline-none transition-colors"
              onFocus={() => audioManager.play('hover')}
            >
              <option value="caesar">Caesar Cipher</option>
              <option value="vigenere">Vigenère Cipher</option>
              <option value="substitution">Substitution Cipher</option>
            </select>
          </div>

          {/* Encrypted Payload */}
          <div>
            <label className="block text-sm font-mono text-gray-300 mb-2">
              ENCRYPTED PAYLOAD
            </label>
            <textarea
              value={encrypted}
              onChange={(e) => setEncrypted(e.target.value)}
              className={`error-input w-full bg-gray-900/50 border border-secondary/30 rounded p-3 text-text font-mono resize-none focus:border-secondary focus:outline-none transition-colors ${error ? 'border-error' : ''}`}
              rows={3}
              placeholder="Enter encrypted message..."
              onFocus={() => audioManager.play('hover')}
            />
          </div>

          {/* Cipher Key */}
          <div>
            <label className="block text-sm font-mono text-gray-300 mb-2">
              CIPHER KEY
            </label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className={`error-input w-full bg-gray-900/50 border border-secondary/30 rounded p-3 text-text font-mono focus:border-secondary focus:outline-none transition-colors ${error ? 'border-error' : ''}`}
              placeholder="Enter cipher key..."
              onFocus={() => audioManager.play('hover')}
            />
          </div>

          {/* Auth Code */}
          <div>
            <label className="block text-sm font-mono text-gray-300 mb-2">
              AUTH CODE
            </label>
            <input
              type="text"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              className={`error-input w-full bg-gray-900/50 border border-secondary/30 rounded p-3 text-text font-mono focus:border-secondary focus:outline-none transition-colors ${error ? 'border-error' : ''}`}
              placeholder="Enter authentication code..."
              onFocus={() => audioManager.play('hover')}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 text-error font-mono text-sm p-3 bg-red-900/20 border border-error/30 rounded">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Decrypt Button */}
          <button
            onClick={handleDecrypt}
            disabled={!encrypted.trim() || !key.trim() || !authCode.trim() || isLoading}
            className="w-full glass-panel border-secondary text-secondary font-mono py-4 px-6 rounded hover:neon-border hover:text-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            onMouseEnter={() => audioManager.play('hover')}
          >
            {isLoading ? (
              <>
                <div className="loading-circuit w-6 h-6 border-2 border-secondary rounded-full border-t-transparent" />
                <span>VERIFYING & DECRYPTING...</span>
              </>
            ) : (
              <>
                <Unlock size={20} />
                <span>VERIFY & DECRYPT</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="success-modal fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="glass-panel p-8 max-w-md w-full mx-4 neon-border">
            <div className="text-center">
              <CheckCircle className="mx-auto text-green-400 mb-4" size={48} />
              <h3 className="text-xl font-orbitron text-primary mb-4">
                ACCESS GRANTED
              </h3>
              <div className="bg-gray-900/50 p-4 rounded border border-green-500/30 mb-6">
                <p className="text-green-400 font-mono break-words">
                  {result}
                </p>
              </div>
              <button
                onClick={closeSuccessModal}
                className="glass-panel border-primary text-primary font-mono py-2 px-6 rounded hover:neon-border hover:text-secondary transition-all duration-300"
                onMouseEnter={() => audioManager.play('hover')}
                onMouseDown={() => audioManager.play('click')}
              >
                [CLOSE]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecryptionModule;