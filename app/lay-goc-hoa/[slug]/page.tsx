import { LESSONS, COURSE_TITLE, COURSE_DESCRIPTION } from '@/app/lib/lessons-data';
import JsonLd from '../../../components/seo/JsonLd';
import { courseSchema } from '../../../lib/schema';
import LessonPageClient from './LessonPageClient';

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ slug: lesson.slug }));
}

export default function LessonPage() {
  return (
    <>
      <JsonLd
        data={courseSchema({
          name: COURSE_TITLE,
          description: COURSE_DESCRIPTION,
          path: '/lay-goc-hoa',
          numberOfLessons: LESSONS.length,
        })}
      />
      <LessonPageClient />
    </>
  );
}
