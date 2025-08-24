class AudioManager {
  private context: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private backgroundGain: GainNode | null = null;
  private backgroundSource: AudioBufferSourceNode | null = null;

  async init() {
    this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    await this.loadSounds();
    this.startBackgroundAmbient();
  }

  private async loadSounds() {
    if (!this.context) return;

    // Create synthetic sounds using Web Audio API
    const sounds = {
      hover: this.createHoverSound(),
      click: this.createClickSound(),
      success: this.createSuccessSound(),
      error: this.createErrorSound(),
      swoosh: this.createSwooshSound(),
      typing: this.createTypingSound()
    };

    for (const [name, buffer] of Object.entries(sounds)) {
      this.sounds.set(name, buffer);
    }
  }

  private createHoverSound(): AudioBuffer {
    if (!this.context) throw new Error('Audio context not initialized');
    
    const buffer = this.context.createBuffer(1, this.context.sampleRate * 0.1, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      const t = i / this.context.sampleRate;
      data[i] = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 20) * 0.1;
    }
    
    return buffer;
  }

  private createClickSound(): AudioBuffer {
    if (!this.context) throw new Error('Audio context not initialized');
    
    const buffer = this.context.createBuffer(1, this.context.sampleRate * 0.15, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      const t = i / this.context.sampleRate;
      data[i] = (Math.sin(2 * Math.PI * 600 * t) + Math.sin(2 * Math.PI * 400 * t)) * Math.exp(-t * 15) * 0.15;
    }
    
    return buffer;
  }

  private createSuccessSound(): AudioBuffer {
    if (!this.context) throw new Error('Audio context not initialized');
    
    const buffer = this.context.createBuffer(1, this.context.sampleRate * 0.5, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      const t = i / this.context.sampleRate;
      const freq = 440 + (t * 220); // Rising tone
      data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 3) * 0.2;
    }
    
    return buffer;
  }

  private createErrorSound(): AudioBuffer {
    if (!this.context) throw new Error('Audio context not initialized');
    
    const buffer = this.context.createBuffer(1, this.context.sampleRate * 0.3, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      const t = i / this.context.sampleRate;
      const freq = 200 - (t * 50); // Falling tone
      data[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 8) * 0.25;
    }
    
    return buffer;
  }

  private createSwooshSound(): AudioBuffer {
    if (!this.context) throw new Error('Audio context not initialized');
    
    const buffer = this.context.createBuffer(1, this.context.sampleRate * 0.4, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      const t = i / this.context.sampleRate;
      const noise = (Math.random() - 0.5) * 2;
      data[i] = noise * Math.exp(-t * 8) * (1 - t) * 0.1;
    }
    
    return buffer;
  }

  private createTypingSound(): AudioBuffer {
    if (!this.context) throw new Error('Audio context not initialized');
    
    const buffer = this.context.createBuffer(1, this.context.sampleRate * 0.05, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      const t = i / this.context.sampleRate;
      data[i] = (Math.random() - 0.5) * Math.exp(-t * 30) * 0.08;
    }
    
    return buffer;
  }

  private startBackgroundAmbient() {
    if (!this.context) return;

    // Create background ambient drone
    const oscillator = this.context.createOscillator();
    const oscillator2 = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(40, this.context.currentTime);
    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(60, this.context.currentTime);

    gainNode.gain.setValueAtTime(0.02, this.context.currentTime);

    oscillator.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.start();
    oscillator2.start();

    this.backgroundGain = gainNode;
  }

  play(soundName: string, volume: number = 1) {
    if (!this.context || !this.sounds.has(soundName)) return;

    try {
      const buffer = this.sounds.get(soundName)!;
      const source = this.context.createBufferSource();
      const gainNode = this.context.createGain();

      source.buffer = buffer;
      gainNode.gain.setValueAtTime(volume, this.context.currentTime);

      source.connect(gainNode);
      gainNode.connect(this.context.destination);

      source.start();
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }

  setBackgroundVolume(volume: number) {
    if (this.backgroundGain) {
      this.backgroundGain.gain.setValueAtTime(volume, this.context?.currentTime || 0);
    }
  }
}

export const audioManager = new AudioManager();