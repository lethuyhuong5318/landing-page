'use client';

import React, { useEffect, useState, useRef } from 'react';
import styles from './ReadingProgress.module.css';

interface ReadingProgressProps {
  stickyHeaderHeight?: number;
}

export function ReadingProgress({ stickyHeaderHeight = 72 }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - stickyHeaderHeight - windowHeight;

      if (documentHeight <= 0) {
        setProgress(100);
        return;
      }

      const scrolled = Math.max(0, window.scrollY - stickyHeaderHeight);
      const scrollPercent = Math.min(100, (scrolled / documentHeight) * 100);
      setProgress(scrollPercent);
    };

    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(calculateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    calculateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [stickyHeaderHeight]);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Tiến độ đọc bài"
    >
      <div
        className={styles.fill}
        style={{
          transform: `scaleX(${progress / 100})`,
        }}
      />
    </div>
  );
}
