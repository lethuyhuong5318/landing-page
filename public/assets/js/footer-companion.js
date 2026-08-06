/* Sister script to app/components/Footer.tsx for the static
   /lay-goc-hoa/ pages. Reads the SAME "chamcham-chemistry-cluster"
   localStorage key that chemistry-lesson-progress.js and duo-path.js
   already write to, so progress shown here always matches what those
   pages recorded — no separate/duplicate storage schema. */
(() => {
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

  const root = document.getElementById("footerCompanion");
  if (!root) return;

  let state = {};
  try { state = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch {}

  const todayISO = new Date().toISOString().slice(0, 10);
  const completedCount = LESSONS.filter((l) => state[l.id] === "complete").length;
  const currentId = typeof state.current === "string" ? state.current : null;
  const currentLesson = (currentId && LESSONS.find((l) => l.id === currentId && state[l.id] !== "complete")) || (completedCount === 0 ? LESSONS[0] : null);
  const completedDates = state.completedDates || {};
  const todayCount = completedDates[todayISO] || 0;
  const streak = typeof state.streak === "number" ? state.streak : 0;
  const allComplete = completedCount >= LESSONS.length;

  document.getElementById("fcStreak").textContent = String(streak);
  document.getElementById("fcXp").textContent = String(todayCount * XP_PER_LESSON);
  document.getElementById("fcCompleted").childNodes[0].nodeValue = String(completedCount);
  document.getElementById("fcGoalText").textContent = `${todayCount} / ${DAILY_GOAL} bài`;
  const goalPct = Math.min(100, Math.round((todayCount / DAILY_GOAL) * 100));
  document.getElementById("fcGoalFill").style.width = goalPct + "%";
  document.getElementById("fcGoalTrack").setAttribute("aria-valuenow", String(goalPct));

  const heading = document.getElementById("fc-continue-heading");
  const lessonEl = document.getElementById("fcContinueLesson");
  const timeEl = document.getElementById("fcContinueTime");
  const btn = document.getElementById("fcResumeBtn");
  if (allComplete) {
    heading.textContent = "Đã hoàn thành lộ trình!";
    lessonEl.textContent = "🏆 Em đã học xong cả 11 bài Lấy gốc Hóa!";
    timeEl.textContent = "";
    btn.textContent = "Ôn lại lộ trình";
    btn.href = "/lay-goc-hoa/";
  } else {
    heading.textContent = "Tiếp tục học";
    const lesson = currentLesson || LESSONS[0];
    lessonEl.textContent = lesson.title;
    timeEl.textContent = `⏱ Khoảng ${lesson.minutes} phút`;
    btn.textContent = completedCount > 0 ? "Tiếp tục →" : "Bắt đầu học →";
    btn.href = lesson.href;
  }

  const motivEl = document.getElementById("fcMotivation");
  if (motivEl) {
    let motivIndex = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) {
      setInterval(() => {
        motivIndex = (motivIndex + 1) % MOTIVATIONS.length;
        motivEl.textContent = MOTIVATIONS[motivIndex];
      }, 5000);
    }
  }
})();
