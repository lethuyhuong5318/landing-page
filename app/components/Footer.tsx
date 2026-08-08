"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getAssetPath } from "../basePath";
import "./footer-companion.css";

const STORAGE_KEY = "chamcham-chemistry-cluster";
const DAILY_GOAL = 3;
const XP_PER_LESSON = 50;

const LESSONS = [
  { id: "p-basics", href: "/lay-goc-hoa/nen-tang-hoa-hoc-6-7/", title: "Nền tảng Hóa học lớp 6–7", minutes: 25 },
  { id: "p-formula", href: "/lay-goc-hoa/cong-thuc-hoa-hoc/", title: "Công thức và tính toán Hóa học", minutes: 30 },
  { id: "p-valence", href: "/lay-goc-hoa/hoa-tri/", title: "Hóa trị và lập công thức hóa học", minutes: 35 },
  { id: "p-table", href: "/lay-goc-hoa/bang-tuan-hoan/", title: "Bảng tuần hoàn hóa học", minutes: 30 },
  { id: "p-reaction", href: "/lay-goc-hoa/phan-ung-va-phuong-trinh-hoa-hoc/", title: "Phản ứng và phương trình hóa học", minutes: 35 },
  { id: "p-rules", href: "/lay-goc-hoa/tan-ph-quy-tim/", title: "Độ tan, pH và quỳ tím", minutes: 25 },
  { id: "p-series", href: "/lay-goc-hoa/day-hoat-dong-khi-ket-tua/", title: "Dãy hoạt động, chất khí và kết tủa", minutes: 30 },
  { id: "p-organic", href: "/lay-goc-hoa/hoa-hoc-huu-co-co-ban/", title: "Hóa học hữu cơ cơ bản", minutes: 30 },
  { id: "p-iupac", href: "/lay-goc-hoa/danh-phap-iupac/", title: "Danh pháp IUPAC", minutes: 30 },
  { id: "p-mass", href: "/lay-goc-hoa/phan-tu-khoi/", title: "Phân tử khối và bài tập", minutes: 20 },
  { id: "p-quiz", href: "/lay-goc-hoa/bai-tap-lay-goc-hoa/", title: "Bài tập tổng hợp Lấy gốc Hóa", minutes: 20 },
];

const MOTIVATIONS = [
  "Mỗi bài học giúp em vững hơn một chút.",
  "Tiến bộ nhỏ mỗi ngày cũng là tiến bộ.",
  "Hóa học sẽ dễ dần, từng bước một.",
  "Hôm nay học một chút, ngày mai tự tin hơn.",
  "Đừng dừng lại khi đã đi được nửa chặng đường.",
];

const QUICK_ACTIONS = [
  { icon: "🏠", label: "Trang chủ", href: "/" },
  { icon: "📚", label: "Lộ trình Lấy gốc Hóa", href: "/lay-goc-hoa/" },
  { icon: "✍️", label: "Blog Hóa", href: "/blog/" },
  { icon: "💬", label: "Góp ý", href: "/feedback/" },
];

const COMMUNITY_LINKS = [
  { icon: "f", label: "Facebook", href: "https://www.facebook.com/profile.php?id=61590518783118" },
  { icon: "▶", label: "YouTube", href: "https://www.youtube.com/@chamcham97-c6f" },
  { icon: "♪", label: "TikTok", href: "https://www.tiktok.com/@chamchamedemy?_r=1&_t=ZS-98BKi5KPsQB" },
  { icon: "Z", label: "Zalo", href: "https://zalo.me/0329309293" },
];

type Progress = {
  streak: number;
  completedCount: number;
  todayCount: number;
  currentLesson: (typeof LESSONS)[number] | null;
  allComplete: boolean;
  ready: boolean;
};

const DEFAULT_PROGRESS: Progress = {
  streak: 0,
  completedCount: 0,
  todayCount: 0,
  currentLesson: null,
  allComplete: false,
  ready: false,
};

// Cached lazily on first read so re-renders don't re-parse localStorage;
// invalidated only when another tab/window actually writes to this key
// (the native "storage" event never fires for same-document writes).
let cachedProgress: Progress | null = null;

function computeProgress(): Progress {
  let state: Record<string, unknown> = {};
  try {
    state = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    state = {};
  }
  const todayISO = new Date().toISOString().slice(0, 10);
  const completedCount = LESSONS.filter((lesson) => state[lesson.id] === "complete").length;
  const currentId = typeof state.current === "string" ? state.current : null;
  const currentLesson = currentId ? LESSONS.find((lesson) => lesson.id === currentId && state[lesson.id] !== "complete") ?? null : null;
  const completedDates = (state.completedDates ?? {}) as Record<string, number>;
  return {
    streak: typeof state.streak === "number" ? state.streak : 0,
    completedCount,
    todayCount: completedDates[todayISO] ?? 0,
    currentLesson: currentLesson ?? (completedCount === 0 ? LESSONS[0] : null),
    allComplete: completedCount >= LESSONS.length,
    ready: true,
  };
}

function getProgressSnapshot(): Progress {
  cachedProgress ??= computeProgress();
  return cachedProgress;
}

function getServerProgressSnapshot(): Progress {
  return DEFAULT_PROGRESS;
}

function subscribeProgress(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      cachedProgress = null;
      onStoreChange();
    }
  };
  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}

export default function Footer() {
  const progress = useSyncExternalStore(subscribeProgress, getProgressSnapshot, getServerProgressSnapshot);
  const [motivIndex, setMotivIndex] = useState(0);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const timer = window.setInterval(() => {
      setMotivIndex((current) => (current + 1) % MOTIVATIONS.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const goalPct = Math.min(100, Math.round((progress.todayCount / DAILY_GOAL) * 100));

  return (
    <footer className="site-footer footer-companion" ref={footerRef}>
      <div className="fc-inner">
        <div className="fc-grid">
          <section className="fc-card fc-progress" aria-labelledby="fc-progress-heading">
            <h2 id="fc-progress-heading" className="fc-card-title">Tiến độ hôm nay</h2>
            <div className="fc-stat-row">
              <div className="fc-stat">
                <span className="fc-stat-icon" aria-hidden="true">🔥</span>
                <span className="fc-stat-value">{progress.ready ? progress.streak : "–"}</span>
                <span className="fc-stat-label">Ngày liên tiếp</span>
              </div>
              <div className="fc-stat">
                <span className="fc-stat-icon" aria-hidden="true">⭐</span>
                <span className="fc-stat-value">{progress.ready ? progress.todayCount * XP_PER_LESSON : "–"}</span>
                <span className="fc-stat-label">XP hôm nay</span>
              </div>
              <div className="fc-stat">
                <span className="fc-stat-icon" aria-hidden="true">📖</span>
                <span className="fc-stat-value">{progress.ready ? progress.completedCount : "–"}<small>/{LESSONS.length}</small></span>
                <span className="fc-stat-label">Bài đã học</span>
              </div>
            </div>
            <div className="fc-goal">
              <div className="fc-goal-label">
                <span>Mục tiêu hôm nay</span>
                <span>{progress.todayCount} / {DAILY_GOAL} bài</span>
              </div>
              <div className="fc-progress-track" role="progressbar" aria-valuenow={goalPct} aria-valuemin={0} aria-valuemax={100} aria-label="Tiến độ mục tiêu học hôm nay">
                <i className="fc-progress-fill" style={{ width: progress.ready ? `${goalPct}%` : "0%" }} />
              </div>
            </div>
          </section>

          <section className="fc-card fc-continue" aria-labelledby="fc-continue-heading">
            <h2 id="fc-continue-heading" className="fc-card-title">
              {progress.allComplete ? "Đã hoàn thành lộ trình!" : "Tiếp tục học"}
            </h2>
            {progress.allComplete ? (
              <div className="fc-continue-body">
                <p className="fc-continue-lesson">🏆 Em đã học xong cả 11 bài Lấy gốc Hóa!</p>
                <a className="fc-resume-btn" href={getAssetPath("/lay-goc-hoa/")}>Ôn lại lộ trình</a>
              </div>
            ) : (
              <div className="fc-continue-body">
                <p className="fc-continue-lesson">{progress.currentLesson?.title ?? "Chọn bài học đầu tiên"}</p>
                <p className="fc-continue-time">
                  {progress.currentLesson ? `⏱ Khoảng ${progress.currentLesson.minutes} phút` : "Bắt đầu lộ trình Lấy gốc Hóa"}
                </p>
                <a
                  className="fc-resume-btn"
                  href={getAssetPath(progress.currentLesson?.href ?? LESSONS[0].href)}
                >
                  {progress.completedCount > 0 ? "Tiếp tục →" : "Bắt đầu học →"}
                </a>
              </div>
            )}
          </section>

          <section className="fc-card fc-actions" aria-labelledby="fc-actions-heading">
            <h2 id="fc-actions-heading" className="fc-card-title">Truy cập nhanh</h2>
            <nav className="fc-actions-grid" aria-label="Truy cập nhanh">
              {QUICK_ACTIONS.map((action) => (
                <a key={action.href} className="fc-action-btn" href={getAssetPath(action.href)}>
                  <span aria-hidden="true">{action.icon}</span>{action.label}
                </a>
              ))}
            </nav>
          </section>

          <section className="fc-card fc-community" aria-labelledby="fc-community-heading">
            <h2 id="fc-community-heading" className="fc-card-title">Kết nối với ChamChamEdemy</h2>
            <div className="fc-community-grid">
              {COMMUNITY_LINKS.map((link) => (
                <a key={link.href} className="fc-community-btn" href={link.href} target="_blank" rel="noreferrer" aria-label={link.label}>
                  <span aria-hidden="true">{link.icon}</span>
                </a>
              ))}
            </div>
          </section>
        </div>

        <section className="fc-brand-row" aria-label="Về ChamChamEdemy">
          <img
            className="fc-mascot"
            src={getAssetPath("/co-tram-mascot.webp")}
            alt="Mascot gấu Cô Trâm Hóa Học của ChamChamEdemy"
            width={72}
            height={72}
            loading="lazy"
          />
          <div className="fc-brand-copy">
            <a className="fc-brand-name" href={getAssetPath("/")}>ChamCham<span>Edemy</span></a>
            <p className="fc-brand-mission">Giúp học sinh yêu thích Hóa học qua trải nghiệm học trực quan, tương tác.</p>
          </div>
          <p className="fc-motivation" aria-live="polite">{MOTIVATIONS[motivIndex]}</p>
        </section>

        <p className="footer-developer">
          <span className="footer-developer__label">Phát triển bởi</span>
          <strong>Thehuntech</strong>
          <a href="tel:0354375205">0354 375 205</a>
        </p>
      </div>
    </footer>
  );
}
