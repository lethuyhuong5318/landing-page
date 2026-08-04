import { LESSONS } from '@/app/lib/lessons-data';
import LessonPageClient from './LessonPageClient';

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ slug: lesson.slug }));
}

export default function LessonPage() {
  return <LessonPageClient />;
}
