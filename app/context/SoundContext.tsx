'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState, useCallback } from 'react';

export type SoundType = 'click' | 'success' | 'error' | 'complete';

interface SoundSettings {
  enabled: boolean;
  uiSounds: boolean;
  quizSounds: boolean;
  completionSounds: boolean;
  volume: number;
}

interface SoundContextType {
  settings: SoundSettings;
  play: (type: SoundType) => void;
  updateSettings: (settings: Partial<SoundSettings>) => void;
  toggleSound: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

const DEFAULT_SETTINGS: SoundSettings = {
  enabled: true,
  uiSounds: true,
  quizSounds: true,
  completionSounds: true,
  volume: 0.3,
};

const SOUND_DURATIONS: Record<SoundType, number> = {
  click: 80,
  success: 300,
  error: 200,
  complete: 600,
};

export function SoundProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SoundSettings>(DEFAULT_SETTINGS);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Initialize AudioContext on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (audioContext || audioInitialized) return;

      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(ctx);
        setAudioInitialized(true);

        // Resume if suspended (mobile)
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // Remove listener after initialization
        document.removeEventListener('click', initAudio);
        document.removeEventListener('touchstart', initAudio);
      } catch (err) {
        console.warn('AudioContext not supported:', err);
        setAudioInitialized(true);
      }
    };

    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });

    // Load saved settings
    try {
      const saved = localStorage.getItem('soundSettings');
      if (saved) {
        setSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch (err) {
      console.warn('Failed to load sound settings:', err);
    }

    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };
  }, [audioContext, audioInitialized]);

  // Play sound using Web Audio API
  const play = useCallback((type: SoundType) => {
    if (!settings.enabled || !audioContext || audioContext.state !== 'running') {
      return;
    }

    // Check sound type settings
    if (type === 'click' && !settings.uiSounds) return;
    if ((type === 'success' || type === 'error') && !settings.quizSounds) return;
    if (type === 'complete' && !settings.completionSounds) return;

    try {
      const now = audioContext.currentTime;
      const duration = SOUND_DURATIONS[type];
      const durationInSeconds = duration / 1000;

      // Create oscillator
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.connect(gain);
      gain.connect(audioContext.destination);

      // Set frequency and envelope based on type
      switch (type) {
        case 'click':
          osc.frequency.value = 600;
          gain.gain.setValueAtTime(settings.volume * 0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + durationInSeconds);
          break;

        case 'success':
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(1200, now + durationInSeconds * 0.3);
          osc.frequency.exponentialRampToValueAtTime(1000, now + durationInSeconds);
          gain.gain.setValueAtTime(settings.volume * 0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + durationInSeconds);
          break;

        case 'error':
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + durationInSeconds);
          gain.gain.setValueAtTime(settings.volume * 0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + durationInSeconds);
          break;

        case 'complete':
          // Arpeggio: C-E-G
          osc.frequency.setValueAtTime(262, now);
          osc.frequency.setValueAtTime(330, now + durationInSeconds * 0.3);
          osc.frequency.setValueAtTime(392, now + durationInSeconds * 0.6);
          osc.frequency.setValueAtTime(524, now + durationInSeconds * 0.8);
          gain.gain.setValueAtTime(settings.volume * 0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + durationInSeconds);
          break;
      }

      osc.type = 'sine';
      osc.start(now);
      osc.stop(now + durationInSeconds);
    } catch (err) {
      console.warn('Failed to play sound:', err);
    }
  }, [settings.enabled, settings.uiSounds, settings.quizSounds, settings.completionSounds, settings.volume, audioContext]);

  const updateSettings = useCallback((newSettings: Partial<SoundSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('soundSettings', JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save sound settings:', err);
      }
      return updated;
    });
  }, []);

  const toggleSound = useCallback(() => {
    updateSettings({ enabled: !settings.enabled });
  }, [settings.enabled, updateSettings]);

  return (
    <SoundContext.Provider value={{ settings, play, updateSettings, toggleSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within SoundProvider');
  }
  return context;
}
