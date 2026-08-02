'use client';

import React from 'react';
import Link from 'next/link';
import styles from './LessonNavigation.module.css';

interface LessonNavigationProps {
  previousLesson?: {
    slug: string;
    title: string;
  };
  nextLesson?: {
    slug: string;
    title: string;
  };
}

export function LessonNavigation({
  previousLesson,
  nextLesson,
}: LessonNavigationProps) {
  return (
    <nav className={styles.navigation} aria-label="Điều hướng bài học">
      {previousLesson ? (
        <Link href={`/lay-goc-hoa/${previousLesson.slug}/`} className={`${styles.button} ${styles.prev}`}>
          <span className={styles.arrow}>←</span>
          <span className={styles.text}>
            <span className={styles.label}>Bài trước</span>
            <span className={styles.title}>{previousLesson.title}</span>
          </span>
        </Link>
      ) : (
        <div className={`${styles.button} ${styles.prev} ${styles.disabled}`}>
          <span className={styles.arrow}>←</span>
          <span className={styles.text}>
            <span className={styles.label}>Bài trước</span>
            <span className={styles.title}>Không có</span>
          </span>
        </div>
      )}

      {nextLesson ? (
        <Link href={`/lay-goc-hoa/${nextLesson.slug}/`} className={`${styles.button} ${styles.next}`}>
          <span className={styles.text}>
            <span className={styles.label}>Bài tiếp theo</span>
            <span className={styles.title}>{nextLesson.title}</span>
          </span>
          <span className={styles.arrow}>→</span>
        </Link>
      ) : (
        <div className={`${styles.button} ${styles.next} ${styles.disabled}`}>
          <span className={styles.text}>
            <span className={styles.label}>Bài tiếp theo</span>
            <span className={styles.title}>Hoàn thành!</span>
          </span>
          <span className={styles.arrow}>→</span>
        </div>
      )}
    </nav>
  );
}
