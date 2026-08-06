(() => {
  const lessonId = document.body.dataset.clusterLesson;
  if (!lessonId) return;
  const storageKey = "chamcham-chemistry-cluster";
  let state = {};
  try { state = JSON.parse(localStorage.getItem(storageKey) || "{}"); } catch {}
  state.current = lessonId;
  if (!state[lessonId]) state[lessonId] = "active";
  localStorage.setItem(storageKey, JSON.stringify(state));

  // Record today's visit for the streak counter shown in the footer
  // "Learning Companion" card, even if the visitor doesn't finish a
  // lesson this session — a streak should track showing up, not just
  // completions.
  const todayISO = new Date().toISOString().slice(0, 10);
  if (state.lastActiveDate !== todayISO) {
    const prevDate = state.lastActiveDate ? new Date(state.lastActiveDate) : null;
    const isYesterday = prevDate && (new Date(todayISO).getTime() - prevDate.getTime()) === 86400000;
    state.streak = isYesterday ? (state.streak || 0) + 1 : 1;
    state.lastActiveDate = todayISO;
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  const navigation = document.querySelector(".cluster-lesson-nav");
  if (!navigation) return;
  const links = [...navigation.querySelectorAll("a")];
  const forward = links.at(-1);
  forward?.addEventListener("click", () => {
    state[lessonId] = "complete";
    state.completedDates = state.completedDates || {};
    state.completedDates[todayISO] = (state.completedDates[todayISO] || 0) + 1;
    localStorage.setItem(storageKey, JSON.stringify(state));
  });
})();
