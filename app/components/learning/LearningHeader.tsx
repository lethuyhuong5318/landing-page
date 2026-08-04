'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './LearningHeader.module.css';

interface LearningHeaderProps {
  courseTitle: string;
  lessonNumber?: number;
  totalLessons?: number;
  progressPercent?: number;
  onSoundToggle?: (enabled: boolean) => void;
  onFocusMode?: () => void;
  onHome?: () => void;
  soundEnabled?: boolean;
  focusModeActive?: boolean;
}

export function LearningHeader({
  courseTitle,
  lessonNumber,
  totalLessons,
  progressPercent = 0,
  onSoundToggle,
  onFocusMode,
  onHome,
  soundEnabled = true,
  focusModeActive = false,
}: LearningHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const firstMenuItemRef = useRef<HTMLButtonElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  const handleMenuClose = useCallback(() => {
    setMobileMenuOpen(false);
    menuToggleRef.current?.focus();
  }, []);

  const toggleMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  // Handle keyboard: Escape to close menu
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleMenuClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, handleMenuClose]);

  // Focus first menu item when menu opens
  useEffect(() => {
    if (mobileMenuOpen && firstMenuItemRef.current) {
      firstMenuItemRef.current.focus();
    }
  }, [mobileMenuOpen]);

  const progressDisplay = lessonNumber && totalLessons
    ? `${lessonNumber}/${totalLessons}`
    : `${Math.round(progressPercent)}%`;

  return (
    <header className={styles.header}>
      {/* Logo & Title */}
      <div className={styles.brandSection}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/chamcham-logo-256.webp"
            alt="ChamChamEdemy"
            width={40}
            height={40}
            priority
          />
        </Link>
        <div className={styles.titleSection}>
          <p className={styles.courseTitle}>{courseTitle}</p>
          {(lessonNumber || progressPercent > 0) && (
            <span className={styles.progressBadge} aria-label={`Tiến độ ${progressDisplay}`}>
              {progressDisplay}
            </span>
          )}
        </div>
      </div>

      {/* Desktop Buttons */}
      <div className={styles.desktopButtons} aria-label="Điều khiển">
        <button
          className={styles.headerButton}
          onClick={() => onSoundToggle?.(!soundEnabled)}
          title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          aria-pressed={soundEnabled}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {soundEnabled ? (
              <>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a7 7 0 0 1 0 9.9M23 9v6" />
              </>
            ) : (
              <>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </>
            )}
          </svg>
        </button>

        <button
          className={`${styles.headerButton} ${focusModeActive ? styles.active : ''}`}
          onClick={onFocusMode}
          title="Chế độ tập trung"
          aria-label="Chế độ tập trung"
          aria-pressed={focusModeActive}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
          </svg>
        </button>

        <Link
          href="/"
          className={styles.headerButton}
          title="Về trang chủ"
          aria-label="Về trang chủ"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        ref={menuToggleRef}
        className={styles.mobileMenuToggle}
        onClick={toggleMenu}
        aria-expanded={mobileMenuOpen}
        aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className={styles.mobileMenu} role="navigation" aria-label="Menu di động">
          <button
            ref={firstMenuItemRef}
            className={styles.mobileMenuButton}
            onClick={() => {
              onSoundToggle?.(!soundEnabled);
              handleMenuClose();
            }}
            aria-pressed={soundEnabled}
          >
            {soundEnabled ? '🔊 Tắt âm thanh' : '🔇 Bật âm thanh'}
          </button>
          <button
            className={styles.mobileMenuButton}
            onClick={() => {
              onFocusMode?.();
              handleMenuClose();
            }}
            aria-pressed={focusModeActive}
          >
            {focusModeActive ? '⭕ Tắt chế độ tập trung' : '⭕ Chế độ tập trung'}
          </button>
          <Link href="/" className={styles.mobileMenuButton} onClick={handleMenuClose}>
            🏠 Về trang chủ
          </Link>
        </nav>
      )}
    </header>
  );
}
