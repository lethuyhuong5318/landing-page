(() => {
  const lessonId = document.body.dataset.clusterLesson;
  if (!lessonId) return;
  const storageKey = "chamcham-chemistry-cluster";
  let state = {};
  try { state = JSON.parse(localStorage.getItem(storageKey) || "{}"); } catch {}
  state.current = lessonId;
  if (!state[lessonId]) state[lessonId] = "active";
  localStorage.setItem(storageKey, JSON.stringify(state));
  const navigation = document.querySelector(".cluster-lesson-nav");
  if (!navigation) return;
  const links = [...navigation.querySelectorAll("a")];
  const forward = links.at(-1);
  forward?.addEventListener("click", () => {
    state[lessonId] = "complete";
    localStorage.setItem(storageKey, JSON.stringify(state));
  });
})();
