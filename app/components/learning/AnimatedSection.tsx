'use client';

import React, { useEffect, useRef, ReactNode } from 'react';
import styles from './AnimatedSection.module.css';

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  id?: string;
}

export function AnimatedSection({
  children,
  delay = 0,
  className = '',
  id,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Trigger animation
            setTimeout(() => {
              entry.target.classList.add(styles.visible);
            }, delay);

            // Unobserve after first intersection
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${styles.section} ${className}`}
      id={id}
    >
      {children}
    </div>
  );
}
