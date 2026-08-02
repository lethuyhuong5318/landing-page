'use client';

import React from 'react';
import Link from 'next/link';
import styles from './LessonSidebar.module.css';

export interface LessonItem {
  number: number;
  slug: string;
  title: string;
  status: 'completed' | 'in-progress' | 'not-started';
  duration: number;
}

interface LessonSidebarProps {
  lessons: LessonItem[];
  currentLessonNumber: number;
  courseProgress: number; // 0-100
  courseTitle: string;
}

export function LessonSidebar({
  lessons,
  currentLessonNumber,
  courseProgress,
  courseTitle,
}: LessonSidebarProps) {
  const completedCount = lessons.filter((l) => l.status === 'completed').length;

  return (
    <aside className={styles.sidebar}>
      {/* Course Progress */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Tiến độ lộ trình</h3>
        <div className={styles.progressInfo}>
          <p className={styles.progressText}>
            {completedCount} / {lessons.length} bài
          </p>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${courseProgress}%`,
              }}
              role="progressbar"
              aria-valuenow={courseProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>

      {/* Lessons Navigation */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Danh sách bài học</h3>
        <nav className={styles.nav}>
          {lessons.map((lesson) => (
            <Link
              key={lesson.slug}
              href={`/lay-goc-hoa/${lesson.slug}/`}
              className={`${styles.link} ${
                currentLessonNumber === lesson.number ? styles.active : ''
              }`}
              aria-current={currentLessonNumber === lesson.number ? 'page' : undefined}
            >
              <span className={styles.linkNumber}>
                {lesson.number.toString().padStart(2, '0')}
              </span>
              <span className={styles.linkTitle}>{lesson.title}</span>
              <span className={`${styles.linkStatus} ${styles[lesson.status]}`}>
                {lesson.status === 'completed' && '✓'}
                {lesson.status === 'in-progress' && '◐'}
                {lesson.status === 'not-started' && '○'}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Course Info */}
      <div className={styles.courseInfo}>
        <p className={styles.courseInfoTitle}>{courseTitle}</p>
        <p className={styles.courseInfoText}>
          {completedCount} bài đã hoàn thành. Tiếp tục bước tiếp!
        </p>
      </div>
    </aside>
  );
}
