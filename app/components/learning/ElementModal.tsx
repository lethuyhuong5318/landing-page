'use client';

import React, { useEffect, useRef } from 'react';
import styles from './ElementModal.module.css';

export interface ElementData {
  symbol: string;
  name: string;
  atomicNumber: number;
  atomicMass: number;
  category: string;
  electronConfiguration: string;
  oxidationStates?: string;
  electronegativity?: number;
  density?: number;
  meltingPoint?: number;
  boilingPoint?: number;
  group?: number;
  period?: number;
}

interface ElementModalProps {
  isOpen: boolean;
  element: ElementData | null;
  onClose: () => void;
}

export function ElementModal({
  isOpen,
  element,
  onClose,
}: ElementModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus management and body scroll prevention
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus trap: keep focus within modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;

      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    modalRef.current.addEventListener('keydown', handleKeyDown);
    return () => modalRef.current?.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen || !element) return null;

  const elementTitleId = `element-${element.symbol}-title`;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
      aria-hidden="false"
    >
      <div
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={elementTitleId}
      >
        {/* Header */}
        <div className={styles.header}>
          <button
            ref={closeButtonRef}
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Đóng (ESC)"
            title="Đóng"
          >
            ✕
          </button>
          <div className={styles.headerContent}>
            <div className={styles.symbol}>{element.symbol}</div>
            <div id={elementTitleId} className={styles.name}>{element.name}</div>
          </div>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Basic Properties */}
          <div className={styles.property}>
            <span className={styles.label}>Số nguyên tử</span>
            <span className={styles.value}>{element.atomicNumber}</span>
          </div>

          <div className={styles.property}>
            <span className={styles.label}>Khối lượng nguyên tử</span>
            <span className={styles.value}>{element.atomicMass.toFixed(3)}</span>
          </div>

          <div className={styles.property}>
            <span className={styles.label}>Loại</span>
            <span className={styles.value}>{element.category}</span>
          </div>

          {element.group && (
            <div className={styles.property}>
              <span className={styles.label}>Nhóm</span>
              <span className={styles.value}>{element.group}</span>
            </div>
          )}

          {element.period && (
            <div className={styles.property}>
              <span className={styles.label}>Chu kỳ</span>
              <span className={styles.value}>{element.period}</span>
            </div>
          )}

          {/* Electron Configuration */}
          {element.electronConfiguration && (
            <div className={styles.property}>
              <span className={styles.label}>Cấu hình electron</span>
              <span className={`${styles.value} ${styles.mono}`}>
                {element.electronConfiguration}
              </span>
            </div>
          )}

          {/* Chemical Properties */}
          {element.oxidationStates && (
            <div className={styles.property}>
              <span className={styles.label}>Số oxi hóa</span>
              <span className={styles.value}>{element.oxidationStates}</span>
            </div>
          )}

          {element.electronegativity && (
            <div className={styles.property}>
              <span className={styles.label}>Độ âm điện</span>
              <span className={styles.value}>{element.electronegativity}</span>
            </div>
          )}

          {/* Physical Properties */}
          {element.density && (
            <div className={styles.property}>
              <span className={styles.label}>Mật độ</span>
              <span className={styles.value}>{element.density} g/cm³</span>
            </div>
          )}

          {element.meltingPoint && (
            <div className={styles.property}>
              <span className={styles.label}>Nhiệt độ nóng chảy</span>
              <span className={styles.value}>{element.meltingPoint}°C</span>
            </div>
          )}

          {element.boilingPoint && (
            <div className={styles.property}>
              <span className={styles.label}>Nhiệt độ sôi</span>
              <span className={styles.value}>{element.boilingPoint}°C</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
