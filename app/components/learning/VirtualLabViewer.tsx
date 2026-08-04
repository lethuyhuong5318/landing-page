'use client';

import React, { useEffect, useRef } from 'react';
import { WebGLErrorBoundary } from './WebGLErrorBoundary';

export function VirtualLabViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const script = document.createElement('script');
    script.src = '/virtual-lab.js';
    script.async = true;

    script.onload = () => {
      if (window.VirtualLab) {
        window.VirtualLab.init(canvas);
      }
    };

    script.onerror = () => {
      console.error('Failed to load virtual-lab.js');
    };

    document.head.appendChild(script);

    return () => {
      if (window.VirtualLab?.dispose) {
        window.VirtualLab.dispose();
      }
      document.head.removeChild(script);
    };
  }, []);

  return (
    <WebGLErrorBoundary>
      <div style={{ marginTop: '24px', borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/9' }}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            background: '#fff',
          }}
          aria-label="Phòng thí nghiệm ảo 2D"
        />
      </div>
    </WebGLErrorBoundary>
  );
}

declare global {
  interface Window {
    VirtualLab?: {
      init: (canvas: HTMLCanvasElement) => void;
      dispose: () => void;
    };
  }
}
