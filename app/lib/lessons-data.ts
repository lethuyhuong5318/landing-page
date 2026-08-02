// Lesson metadata for /lay-goc-hoa/ course
export interface LessonMeta {
  number: number;
  slug: string;
  title: string;
  description: string;
  duration: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard';
}

export const LESSONS: LessonMeta[] = [
  {
    number: 1,
    slug: 'nen-tang-hoa-hoc-6-7',
    title: 'Nền tảng Hóa học lớp 6–7',
    description:
      'Phân biệt chất, vật thể, hỗn hợp, dung dịch, nguyên tử, nguyên tố và phân tử.',
    duration: 25,
    difficulty: 'easy',
  },
  {
    number: 2,
    slug: 'cong-thuc-hoa-hoc',
    title: 'Công thức và tính toán Hóa học',
    description:
      'Ôn số mol, tỉ khối, nồng độ dung dịch và độ tan qua công cụ tính tương tác.',
    duration: 30,
    difficulty: 'medium',
  },
  {
    number: 3,
    slug: 'hoa-tri',
    title: 'Hóa trị và lập công thức hóa học',
    description:
      'Nắm quy tắc hóa trị, luyện flashcard và ghi nhớ bằng game Đào Hóa Trị.',
    duration: 35,
    difficulty: 'medium',
  },
  {
    number: 4,
    slug: 'bang-tuan-hoan',
    title: 'Bảng tuần hoàn hóa học',
    description:
      'Khám phá nguyên tố, cấu tạo nguyên tử, mô hình 2D–3D và ứng dụng trong đời sống.',
    duration: 30,
    difficulty: 'medium',
  },
  {
    number: 5,
    slug: 'phan-ung-va-phuong-trinh-hoa-hoc',
    title: 'Phản ứng và phương trình hóa học',
    description:
      'Hiểu biến đổi hóa học, bảo toàn khối lượng và luyện cân bằng phương trình.',
    duration: 35,
    difficulty: 'medium',
  },
  {
    number: 6,
    slug: 'tan-ph-quy-tim',
    title: 'Độ tan, pH và quỳ tím',
    description:
      'Nhận biết chất tan, kết tủa, môi trường axit–bazơ và màu quỳ tím.',
    duration: 25,
    difficulty: 'medium',
  },
  {
    number: 7,
    slug: 'day-hoat-dong-khi-ket-tua',
    title: 'Dãy hoạt động, chất khí và kết tủa',
    description:
      'Vận dụng dãy hoạt động kim loại, nhận biết khí và màu kết tủa thường gặp.',
    duration: 30,
    difficulty: 'hard',
  },
  {
    number: 8,
    slug: 'hoa-hoc-huu-co-co-ban',
    title: 'Hóa học hữu cơ cơ bản',
    description:
      'Làm quen hydrocarbon, alcohol, acid acetic và các nhóm chất hữu cơ quan trọng.',
    duration: 30,
    difficulty: 'hard',
  },
  {
    number: 9,
    slug: 'danh-phap-iupac',
    title: 'Danh pháp IUPAC',
    description:
      'Học quy tắc gọi tên oxide, acid, base, muối và hydrocarbon theo hệ thống.',
    duration: 30,
    difficulty: 'hard',
  },
  {
    number: 10,
    slug: 'phan-tu-khoi',
    title: 'Phân tử khối và bài tập',
    description:
      'Tính phân tử khối tương đối theo từng bước và luyện tập với ví dụ có lời giải.',
    duration: 20,
    difficulty: 'medium',
  },
  {
    number: 11,
    slug: 'bai-tap-lay-goc-hoa',
    title: 'Bài tập tổng hợp Lấy gốc Hóa',
    description:
      'Kiểm tra kiến thức toàn lộ trình bằng mini quiz tổng hợp có chấm điểm.',
    duration: 20,
    difficulty: 'medium',
  },
];

export const COURSE_TITLE = 'Lấy gốc Hóa từ cơ bản';
export const COURSE_DESCRIPTION =
  'Lộ trình 11 bài học Hóa học THCS dành cho học sinh mất gốc, từ nền tảng đến bài tập tổng hợp.';

export function getLessonBySlug(slug: string): LessonMeta | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

export function getLessonByNumber(number: number): LessonMeta | undefined {
  return LESSONS.find((l) => l.number === number);
}

export function getPreviousLesson(number: number): LessonMeta | undefined {
  return number > 1 ? getLessonByNumber(number - 1) : undefined;
}

export function getNextLesson(number: number): LessonMeta | undefined {
  return number < LESSONS.length ? getLessonByNumber(number + 1) : undefined;
}

export function getCourseProgress(completedLessons: number[]): number {
  if (LESSONS.length === 0) return 0;
  return Math.round((completedLessons.length / LESSONS.length) * 100);
}
