
export class SoundManager {
  private static instance: SoundManager;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private currentLevel: number = 1;
  private difficulty: number = 1.0;

  private constructor() {
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.error("AudioContext başlatılamadı", e);
    }
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public setLevel(level: number) {
    this.currentLevel = level;
  }

  public setDifficulty(factor: number) {
    this.difficulty = factor;
  }

  private resume() {
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 1, this.ctx!.currentTime, 0.1);
    }
  }

  private getAtmosphere() {
    const idx = Math.floor((this.currentLevel - 1) / 5) % 5;
    const profiles = [
      { type: 'sine' as OscillatorType, freqMod: 1.0, decay: 0.1, resonance: 1.0 },   
      { type: 'sawtooth' as OscillatorType, freqMod: 0.6, decay: 0.2, resonance: 0.5 }, 
      { type: 'triangle' as OscillatorType, freqMod: 1.2, decay: 0.15, resonance: 1.2 }, 
      { type: 'sine' as OscillatorType, freqMod: 0.8, decay: 0.3, resonance: 1.5 },     
      { type: 'triangle' as OscillatorType, freqMod: 0.5, decay: 0.4, resonance: 0.8 }  
    ];
    return profiles[idx];
  }

  public playClick() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    this.resume();
    const atm = this.getAtmosphere();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    osc.type = atm.type;
    // HEYECAN: DDS arttıkça ses daha agresifleşir
    const baseFreq = 800 * atm.freqMod * (0.5 + (this.difficulty * 0.8));
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq / (4 * this.difficulty), this.ctx.currentTime + atm.decay);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3000 * atm.resonance * this.difficulty, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + atm.decay);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + atm.decay);
  }

  public playSuccess() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    this.resume();
    const now = this.ctx.currentTime;
    const atm = this.getAtmosphere();
    const baseNotes = [523.25, 659.25, 783.99, 1046.50]; 
    
    baseNotes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = 'triangle'; 
      // HEYECAN: DDS yüksekse başarı sesi daha parlak ve muzaffer
      osc.frequency.setValueAtTime(freq * atm.freqMod * (0.8 + this.difficulty * 0.4), now + i * 0.08);
      
      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.5);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.6);
    });
  }

  public playFail() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    this.resume();
    const now = this.ctx.currentTime;
    const atm = this.getAtmosphere();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    // HEYECAN: DDS yüksekken hata sesi daha karanlık ve derin
    osc.frequency.setValueAtTime(100 * atm.freqMod / this.difficulty, now);
    osc.frequency.exponentialRampToValueAtTime(20, now + 0.5);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(now + 0.6);
  }

  public playPop() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    this.resume();
    const atm = this.getAtmosphere();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const startFreq = (300 + Math.random() * 300) * atm.freqMod * this.difficulty;
    osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 2, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playCoin() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    this.resume();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2000 * this.difficulty, now);
    osc.frequency.exponentialRampToValueAtTime(1500, now + 0.1);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(now + 0.2);
  }

  public playJackpot() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    this.resume();
    this.playSuccess();
    setTimeout(() => this.playSuccess(), 120);
    if (this.difficulty > 1.2) {
        setTimeout(() => this.playSuccess(), 240);
    }
  }
}
