// Utility để gửi sự kiện analytics tới Google Analytics 4 (hoặc hệ thống tương tự)
// Cấu hình sau: thêm Google Analytics script vào layout.tsx

export type EventName =
  | "view_course"
  | "start_diagnostic_test"
  | "submit_diagnostic_test"
  | "click_zalo"
  | "click_phone"
  | "click_facebook"
  | "view_teacher_profile"
  | "view_pricing"
  | "book_trial"
  | "form_error"
  | "form_success"
  | "element_explore"
  | "blog_visit";

interface EventParams {
  [key: string]: string | number | boolean;
}

/**
 * Gửi sự kiện tới Google Analytics 4
 * Yêu cầu: gtag được load ở window
 */
export function trackEvent(eventName: EventName, params?: EventParams) {
  if (typeof window === "undefined") return;

  // Nếu chưa có gtag, log để debug
  if (!window.gtag) {
    console.log("[Analytics Debug]", eventName, params);
    return;
  }

  try {
    window.gtag("event", eventName, {
      ...params,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Analytics Error]", error);
  }
}

/**
 * Sự kiện: Xem khóa học
 */
export function trackViewCourse(courseTitle: string, level: string) {
  trackEvent("view_course", {
    course_title: courseTitle,
    course_level: level,
  });
}

/**
 * Sự kiện: Bắt đầu bài test chẩn đoán
 */
export function trackStartDiagnosticTest() {
  trackEvent("start_diagnostic_test");
}

/**
 * Sự kiện: Gửi bài test chẩn đoán
 */
export function trackSubmitDiagnosticTest(studentGrade: string, goal: string) {
  trackEvent("submit_diagnostic_test", {
    student_grade: studentGrade,
    goal: goal,
  });
}

/**
 * Sự kiện: Click nút Zalo
 */
export function trackClickZalo() {
  trackEvent("click_zalo");
}

/**
 * Sự kiện: Click nút gọi điện
 */
export function trackClickPhone() {
  trackEvent("click_phone");
}

/**
 * Sự kiện: Click Facebook
 */
export function trackClickFacebook() {
  trackEvent("click_facebook");
}

/**
 * Sự kiện: Xem hồ sơ giáo viên
 */
export function trackViewTeacherProfile() {
  trackEvent("view_teacher_profile");
}

/**
 * Sự kiện: Xem giá học phí
 */
export function trackViewPricing() {
  trackEvent("view_pricing");
}

/**
 * Sự kiện: Đặt lịch học thử
 */
export function trackBookTrial(courseType: string) {
  trackEvent("book_trial", {
    course_type: courseType,
  });
}

/**
 * Sự kiện: Lỗi form
 */
export function trackFormError(fieldName: string, errorType: string) {
  trackEvent("form_error", {
    field_name: fieldName,
    error_type: errorType,
  });
}

/**
 * Sự kiện: Form thành công
 */
export function trackFormSuccess(formType: string) {
  trackEvent("form_success", {
    form_type: formType,
  });
}

/**
 * Sự kiện: Khám phá nguyên tố
 */
export function trackElementExplore(elementSymbol: string, elementName: string) {
  trackEvent("element_explore", {
    element_symbol: elementSymbol,
    element_name: elementName,
  });
}

/**
 * Sự kiện: Xem bài blog
 */
export function trackBlogVisit(blogSlug: string, blogTitle: string) {
  trackEvent("blog_visit", {
    blog_slug: blogSlug,
    blog_title: blogTitle,
  });
}

// Extend Window interface để TypeScript nhận gtag
declare global {
  interface Window {
    gtag?: (command: string, event: string, params?: EventParams) => void;
  }
}
