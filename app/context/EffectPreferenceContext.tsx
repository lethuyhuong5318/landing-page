'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState, useCallback } from 'react';

export type EffectLevel = 'full' | 'balanced' | 'minimal';

interface EffectPreferences {
  level: EffectLevel;
  prefersReducedMotion: boolean;
  prefersReducedData: boolean;
  isLowEndDevice: boolean;
}

interface EffectContextType {
  preferences: EffectPreferences;
  setEffectLevel: (level: EffectLevel) => void;
}

const EffectContext = createContext<EffectContextType | null>(null);

function detectLowEndDevice(): boolean {
  if (typeof navigator === 'undefined') return false;

  // Check device memory (if available)
  const deviceMemory = (navigator as any).deviceMemory;
  if (deviceMemory && deviceMemory < 4) {
    return true;
  }

  // Check processor count (if available)
  const hardwareConcurrency = navigator.hardwareConcurrency;
  if (hardwareConcurrency && hardwareConcurrency < 4) {
    return true;
  }

  // Check connection speed (if available)
  const connection = (navigator as any).connection;
  if (connection) {
    const effectiveType = connection.effectiveType;
    if (effectiveType === '3g' || effectiveType === '4g') {
      return true;
    }
  }

  return false;
}

function getDefaultEffectLevel(preferences: {
  prefersReducedMotion: boolean;
  prefersReducedData: boolean;
  isLowEndDevice: boolean;
}): EffectLevel {
  if (preferences.prefersReducedMotion || preferences.isLowEndDevice) {
    return 'minimal';
  }

  if (preferences.prefersReducedData) {
    return 'balanced';
  }

  return 'full';
}

export function EffectPreferenceProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<EffectPreferences>({
    level: 'balanced',
    prefersReducedMotion: false,
    prefersReducedData: false,
    isLowEndDevice: false,
  });

  useEffect(() => {
    // Detect media queries
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reduceData = window.matchMedia('(prefers-reduced-data: reduce)');
    const isLowEnd = detectLowEndDevice();

    const newPreferences: EffectPreferences = {
      level: 'balanced',
      prefersReducedMotion: reduceMotion.matches,
      prefersReducedData: reduceData.matches,
      isLowEndDevice: isLowEnd,
    };

    newPreferences.level = getDefaultEffectLevel(newPreferences);

    // Try to load saved preference
    try {
      const saved = localStorage.getItem('effectLevel');
      if (saved && ['full', 'balanced', 'minimal'].includes(saved)) {
        newPreferences.level = saved as EffectLevel;
      }
    } catch (err) {
      console.warn('Failed to load effect preference:', err);
    }

    setPreferences(newPreferences);

    // Listen for changes
    const handleReduceMotion = (e: MediaQueryListEvent) => {
      setPreferences(prev => ({
        ...prev,
        prefersReducedMotion: e.matches,
      }));
    };

    const handleReduceData = (e: MediaQueryListEvent) => {
      setPreferences(prev => ({
        ...prev,
        prefersReducedData: e.matches,
      }));
    };

    reduceMotion.addEventListener('change', handleReduceMotion);
    reduceData.addEventListener('change', handleReduceData);

    return () => {
      reduceMotion.removeEventListener('change', handleReduceMotion);
      reduceData.removeEventListener('change', handleReduceData);
    };
  }, []);

  const setEffectLevel = useCallback((level: EffectLevel) => {
    setPreferences(prev => ({
      ...prev,
      level,
    }));

    try {
      localStorage.setItem('effectLevel', level);
    } catch (err) {
      console.warn('Failed to save effect preference:', err);
    }
  }, []);

  // Add CSS classes to document root based on effect level
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-effect-level', preferences.level);
    root.setAttribute('data-reduce-motion', preferences.prefersReducedMotion ? 'true' : 'false');
    root.setAttribute('data-reduce-data', preferences.prefersReducedData ? 'true' : 'false');
  }, [preferences]);

  return (
    <EffectContext.Provider value={{ preferences, setEffectLevel }}>
      {children}
    </EffectContext.Provider>
  );
}

export function useEffectPreference() {
  const context = useContext(EffectContext);
  if (!context) {
    throw new Error('useEffectPreference must be used within EffectPreferenceProvider');
  }
  return context;
}
