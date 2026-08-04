'use client';

import React, { useEffect, useRef } from 'react';
import { useEffectPreference } from '@/app/context/EffectPreferenceContext';
import { WebGLErrorBoundary } from './WebGLErrorBoundary';

export function AtomicLabViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { preferences } = useEffectPreference();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const script = document.createElement('script');
    script.src = '/atomic-lab.js';
    script.async = true;

    // Initialize viewer after script loads
    script.onload = () => {
      if (window.AtomicLab) {
        window.AtomicLab.init(canvas, {
          quality: preferences.level === 'full' ? 'high' : 'medium',
          antialias: preferences.level === 'full',
        });
      }
    };

    script.onerror = () => {
      console.error('Failed to load atomic-lab.js');
    };

    document.head.appendChild(script);

    return () => {
      if (window.AtomicLab?.dispose) {
        window.AtomicLab.dispose();
      }
      document.head.removeChild(script);
    };
  }, [preferences.level]);

  return (
    <WebGLErrorBoundary>
      <div style={{ marginTop: '24px', borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/9' }}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            background: '#f7fafc',
          }}
          aria-label="Mô phỏng nguyên tử 3D"
        />
      </div>
    </WebGLErrorBoundary>
  );
}

declare global {
  interface Window {
    AtomicLab?: {
      init: (canvas: HTMLCanvasElement, options: any) => void;
      dispose: () => void;
    };
  }
}
