'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { LearningHeader } from '@/components/learning/LearningHeader';
import { ReadingProgress } from '@/components/learning/ReadingProgress';
import { LessonHero } from '@/components/learning/LessonHero';
import { LessonSidebar } from '@/components/learning/LessonSidebar';
import { LessonNavigation } from '@/components/learning/LessonNavigation';
import { SoundProvider, useSound } from '@/context/SoundContext';
import { EffectPreferenceProvider } from '@/context/EffectPreferenceContext';
import {
  LESSONS,
  COURSE_TITLE,
  getLessonBySlug,
  getPreviousLesson,
  getNextLesson,
  getCourseProgress,
} from '@/lib/lessons-data';

interface CompletedLessons {
  [key: string]: boolean;
}

function LessonPageContent() {
  const params = useParams();
  const slug = params?.slug as string;
  const { play } = useSound();

  const [completed, setCompleted] = useState<CompletedLessons>({});
  const [mounted, setMounted] = useState(false);

  const lesson = getLessonBySlug(slug);
  const previousLesson = lesson ? getPreviousLesson(lesson.number) : undefined;
  const nextLesson = lesson ? getNextLesson(lesson.number) : undefined;

  // Load completed lessons from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('completedLessons');
      if (stored) {
        setCompleted(JSON.parse(stored));
      }
    } catch (err) {
      console.warn('Failed to load completed lessons:', err);
    }
  }, []);

  // Save completed lessons
  const saveCompleted = (newCompleted: CompletedLessons) => {
    setCompleted(newCompleted);
    try {
      localStorage.setItem('completedLessons', JSON.stringify(newCompleted));
    } catch (err) {
      console.warn('Failed to save completed lessons:', err);
    }
  };

  const handleMarkComplete = () => {
    if (!lesson) return;
    const newCompleted = { ...completed, [lesson.slug]: !completed[lesson.slug] };
    saveCompleted(newCompleted);
    play('success');
  };

  const courseProgress = getCourseProgress(
    Object.entries(completed)
      .filter(([, isCompleted]) => isCompleted)
      .map(([lessonSlug]) => {
        const l = getLessonBySlug(lessonSlug);
        return l ? l.number : 0;
      })
  );

  if (!mounted || !lesson) {
    return (
      <div style={{ padding: '40px 16px', textAlign: 'center' }}>
        <p>Đang tải bài học...</p>
      </div>
    );
  }

  const lessonStatuses = LESSONS.map((l) => {
    const isCompleted = completed[l.slug];
    return {
      ...l,
      status: isCompleted
        ? ('completed' as const)
        : l.number === lesson.number
          ? ('in-progress' as const)
          : ('not-started' as const),
    };
  });

  return (
    <div className="lesson-page">
      {/* Header */}
      <LearningHeader
        courseTitle={COURSE_TITLE}
        lessonNumber={lesson.number}
        totalLessons={LESSONS.length}
        progressPercent={courseProgress}
      />

      {/* Reading Progress Bar */}
      <ReadingProgress stickyHeaderHeight={72} />

      {/* Lesson Hero */}
      <LessonHero
        lessonNumber={lesson.number}
        totalLessons={LESSONS.length}
        title={lesson.title}
        description={lesson.description}
        duration={lesson.duration}
        difficulty={lesson.difficulty}
        isCompleted={completed[lesson.slug] || false}
        onComplete={handleMarkComplete}
      />

      {/* Sidebar */}
      <LessonSidebar
        lessons={lessonStatuses}
        currentLessonNumber={lesson.number}
        courseProgress={courseProgress}
        courseTitle={COURSE_TITLE}
      />

      {/* Main Content */}
      <main className="lesson-content">
        <article className="lesson-article">
          {/* Placeholder for lesson content - will be populated from dist/client/lay-goc-hoa/[slug]/ HTML */}
          <section className="lesson-section">
            <h2>Nội dung bài học</h2>
            <p className="text-muted">
              Nội dung chi tiết sẽ được tải từ bài học gốc.
              <br />
              Bài {lesson.number}: {lesson.title}
            </p>
          </section>

          {/* Placeholder for tabs and panels */}
          <section className="lesson-section">
            <h2>Phần luyện tập</h2>
            <p className="text-muted">
              Công cụ tương tác, bảng tính, hoặc game sẽ được embed tại đây.
            </p>
          </section>
        </article>
      </main>

      {/* Navigation */}
      <LessonNavigation
        previousLesson={
          previousLesson
            ? {
                slug: previousLesson.slug,
                title: previousLesson.title,
              }
            : undefined
        }
        nextLesson={
          nextLesson
            ? {
                slug: nextLesson.slug,
                title: nextLesson.title,
              }
            : undefined
        }
      />
    </div>
  );
}

export default function LessonPage() {
  return (
    <SoundProvider>
      <EffectPreferenceProvider>
        <LessonPageContent />
      </EffectPreferenceProvider>
    </SoundProvider>
  );
}
