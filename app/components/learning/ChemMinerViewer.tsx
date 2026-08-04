'use client';

import React, { useEffect, useRef } from 'react';
import { useEffectPreference } from '@/app/context/EffectPreferenceContext';
import { WebGLErrorBoundary } from './WebGLErrorBoundary';

export function ChemMinerViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { preferences } = useEffectPreference();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const script = document.createElement('script');
    script.src = '/chem-miner-3d.js';
    script.async = true;

    script.onload = () => {
      if (window.ChemMiner3D) {
        window.ChemMiner3D.init(canvas, {
          quality: preferences.level === 'full' ? 'high' : 'medium',
          dustParticles: preferences.level === 'full' ? 50 : 20,
          antiAlias: preferences.level === 'full',
        });
      }
    };

    script.onerror = () => {
      console.error('Failed to load chem-miner-3d.js');
    };

    document.head.appendChild(script);

    return () => {
      if (window.ChemMiner3D?.dispose) {
        window.ChemMiner3D.dispose();
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
            background: '#0a1628',
          }}
          aria-label="Game khai thác hóa chất 3D"
        />
      </div>
    </WebGLErrorBoundary>
  );
}

declare global {
  interface Window {
    ChemMiner3D?: {
      init: (canvas: HTMLCanvasElement, options: any) => void;
      dispose: () => void;
    };
  }
}
