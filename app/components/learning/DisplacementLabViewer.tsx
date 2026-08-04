'use client';

import React, { useEffect, useRef } from 'react';
import { useEffectPreference } from '@/context/EffectPreferenceContext';
import { WebGLErrorBoundary } from './WebGLErrorBoundary';

export function DisplacementLabViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { preferences } = useEffectPreference();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const script = document.createElement('script');
    script.src = '/displacement-lab-3d.js';
    script.async = true;

    script.onload = () => {
      if (window.DisplacementLab3D) {
        window.DisplacementLab3D.init(canvas, {
          quality: preferences.level === 'full' ? 'high' : 'medium',
          particleCount: preferences.level === 'full' ? 50 : 20,
        });
      }
    };

    script.onerror = () => {
      console.error('Failed to load displacement-lab-3d.js');
    };

    document.head.appendChild(script);

    return () => {
      if (window.DisplacementLab3D?.dispose) {
        window.DisplacementLab3D.dispose();
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
          aria-label="Mô phỏng điện hóa 3D"
        />
      </div>
    </WebGLErrorBoundary>
  );
}

declare global {
  interface Window {
    DisplacementLab3D?: {
      init: (canvas: HTMLCanvasElement, options: any) => void;
      dispose: () => void;
    };
  }
}
