import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { Lock, Copy, CheckCircle } from 'lucide-react';
import { encryptText } from '../utils/ciphers';
import { audioManager } from '../utils/audio';

interface EncryptionModuleProps {
  onBack: () => void;
}

const EncryptionModule: React.FC<EncryptionModuleProps> = ({ onBack }) => {
  const [message, setMessage] = useState('');
  const [method, setMethod] = useState('caesar');
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState<{ encrypted: string; key: string; authCode: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    // Animate in
    gsap.fromTo('.encrypt-module', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
  }, []);

  const handleEncrypt = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    audioManager.play('click');

    // Show loading animation
    gsap.to('.loading-circuit', { rotation: 360, duration: 2, ease: 'none', repeat: -1 });

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing
      const encrypted = encryptText(message, method, keyword);
      setResult(encrypted);
      audioManager.play('success');
      
      // Animate result in
      setTimeout(() => {
        gsap.fromTo('.result-panel',
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
        );
      }, 100);
    } catch (error) {
      console.error('Encryption error:', error);
      audioManager.play('error');
    } finally {
      setIsLoading(false);
      gsap.set('.loading-circuit', { rotation: 0 });
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    audioManager.play('click');
    setTimeout(() => setCopied(''), 2000);
  };

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMethod(e.target.value);
    audioManager.play('click');
  };

  return (
    <div className="encrypt-module min-h-screen p-8 flex items-center justify-center">
      <div className="glass-panel p-8 max-w-2xl w-full relative">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-orbitron font-bold text-primary neon-text" style={{ letterSpacing: '2px' }}>
            ENCRYPTION MODULE
          </h2>
          <button
            onClick={onBack}
            className="text-secondary hover:text-primary transition-colors font-mono"
            onMouseEnter={() => audioManager.play('hover')}
            onMouseDown={() => audioManager.play('click')}
          >
            [RETURN]
          </button>
        </div>

        <div className="space-y-6">
          {/* Message Input */}
          <div>
            <label className="block text-sm font-mono text-gray-300 mb-2">
              MESSAGE TO ENCRYPT
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-gray-900/50 border border-primary/30 rounded p-3 text-text font-mono resize-none focus:border-primary focus:outline-none transition-colors"
              rows={4}
              placeholder="Enter your secret message..."
              onFocus={() => audioManager.play('hover')}
            />
          </div>

          {/* Cipher Selection */}
          <div>
            <label className="block text-sm font-mono text-gray-300 mb-2">
              CIPHER METHOD
            </label>
            <select
              value={method}
              onChange={handleMethodChange}
              className="w-full bg-gray-900/50 border border-primary/30 rounded p-3 text-text font-mono focus:border-primary focus:outline-none transition-colors"
              onFocus={() => audioManager.play('hover')}
            >
              <option value="caesar">Caesar Cipher (Simple Shift)</option>
              <option value="vigenere">Vigenère Cipher (Keyword-based)</option>
              <option value="substitution">Substitution Cipher (Random Alphabet)</option>
            </select>
          </div>

          {/* Keyword Input (for Vigenère) */}
          {method === 'vigenere' && (
            <div>
              <label className="block text-sm font-mono text-gray-300 mb-2">
                ENCRYPTION KEYWORD
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-gray-900/50 border border-primary/30 rounded p-3 text-text font-mono focus:border-primary focus:outline-none transition-colors"
                placeholder="Enter keyword..."
                onFocus={() => audioManager.play('hover')}
              />
            </div>
          )}

          {/* Encrypt Button */}
          <button
            onClick={handleEncrypt}
            disabled={!message.trim() || (method === 'vigenere' && !keyword.trim()) || isLoading}
            className="w-full glass-panel border-primary text-primary font-mono py-4 px-6 rounded hover:neon-border hover:text-secondary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            onMouseEnter={() => audioManager.play('hover')}
          >
            {isLoading ? (
              <>
                <div className="loading-circuit w-6 h-6 border-2 border-primary rounded-full border-t-transparent animate-spin" />
                <span>GENERATING SECURE PAYLOAD...</span>
              </>
            ) : (
              <>
                <Lock size={20} />
                <span>GENERATE SECURE PAYLOAD</span>
              </>
            )}
          </button>

          {/* Results */}
          {result && (
            <div className="result-panel space-y-4 mt-8">
              <h3 className="text-xl font-orbitron text-secondary mb-4">
                ENCRYPTION COMPLETE
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">
                    ENCRYPTED PAYLOAD
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      readOnly
                      value={result.encrypted}
                      className="flex-1 bg-gray-900/70 border border-green-500/30 rounded p-2 text-green-400 font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(result.encrypted, 'encrypted')}
                      className="p-2 text-primary hover:text-secondary transition-colors"
                      onMouseEnter={() => audioManager.play('hover')}
                      onMouseDown={() => audioManager.play('click')}
                    >
                      {copied === 'encrypted' ? <CheckCircle size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">
                    CIPHER KEY
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      readOnly
                      value={result.key}
                      className="flex-1 bg-gray-900/70 border border-yellow-500/30 rounded p-2 text-yellow-400 font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(result.key, 'key')}
                      className="p-2 text-primary hover:text-secondary transition-colors"
                      onMouseEnter={() => audioManager.play('hover')}
                      onMouseDown={() => audioManager.play('click')}
                    >
                      {copied === 'key' ? <CheckCircle size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">
                    AUTH CODE
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      readOnly
                      value={result.authCode}
                      className="flex-1 bg-gray-900/70 border border-blue-500/30 rounded p-2 text-blue-400 font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(result.authCode, 'auth')}
                      className="p-2 text-primary hover:text-secondary transition-colors"
                      onMouseEnter={() => audioManager.play('hover')}
                      onMouseDown={() => audioManager.play('click')}
                    >
                      {copied === 'auth' ? <CheckCircle size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-xs font-mono text-gray-500 mt-4 p-3 bg-gray-900/30 rounded">
                Store these values securely. All three components are required for decryption.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EncryptionModule;