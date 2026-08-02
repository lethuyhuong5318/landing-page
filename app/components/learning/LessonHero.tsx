'use client';

import React from 'react';
import Link from 'next/link';
import styles from './LessonHero.module.css';

interface LessonHeroProps {
  lessonNumber: number;
  totalLessons: number;
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty?: 'easy' | 'medium' | 'hard';
  onComplete?: () => void;
  isCompleted?: boolean;
}

const difficultyLabels: Record<string, string> = {
  easy: 'Dễ',
  medium: 'Vừa phải',
  hard: 'Khó',
};

export function LessonHero({
  lessonNumber,
  totalLessons,
  title,
  description,
  duration,
  difficulty = 'medium',
  onComplete,
  isCompleted = false,
}: LessonHeroProps) {
  return (
    <section className={styles.hero}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span>›</span>
        <Link href="/lay-goc-hoa/">Lấy gốc Hóa</Link>
        <span>›</span>
        <span aria-current="page">{title}</span>
      </nav>

      {/* Meta */}
      <div className={styles.meta}>
        <span className={styles.badge}>Bài {lessonNumber.toString().padStart(2, '0')}</span>
        <span className={styles.divider}>·</span>
        <span>{duration} phút</span>
        {difficulty && (
          <>
            <span className={styles.divider}>·</span>
            <span>Độ khó: {difficultyLabels[difficulty]}</span>
          </>
        )}
      </div>

      {/* Title */}
      <h1 className={styles.title}>{title}</h1>

      {/* Description */}
      <p className={styles.description}>{description}</p>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={`${styles.completeButton} ${isCompleted ? styles.completed : ''}`}
          onClick={onComplete}
          aria-pressed={isCompleted}
        >
          {isCompleted ? '✓ Đã hoàn thành' : '☐ Đánh dấu hoàn thành'}
        </button>
      </div>

      {/* Progress indicator */}
      <div className={styles.progress}>
        <span className={styles.progressText}>
          Bài {lessonNumber} / {totalLessons}
        </span>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${(lessonNumber / totalLessons) * 100}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
