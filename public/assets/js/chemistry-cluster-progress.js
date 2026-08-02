(() => {
  const lessons = [...document.querySelectorAll("[data-lesson]")];
  const storageKey = "chamcham-chemistry-cluster";
  let state = {};
  try { state = JSON.parse(localStorage.getItem(storageKey) || "{}"); } catch {}
  const current = state.current;
  let completed = 0;
  lessons.forEach(card => {
    const id = card.dataset.lesson;
    const status = card.querySelector(".hub-status");
    if (state[id] === "complete") {
      card.classList.add("is-complete");
      status.textContent = "Đã hoàn thành";
      completed++;
    } else if (id === current || state[id] === "active") {
      card.classList.add("is-active");
      status.textContent = "Đang học";
    }
    card.addEventListener("click", () => {
      state.current = id;
      if (!state[id]) state[id] = "active";
      localStorage.setItem(storageKey, JSON.stringify(state));
    });
  });
  document.getElementById("hubProgressText").textContent = `${completed}/11 bài đã học`;
  document.getElementById("hubProgressBar").style.width = `${completed / 11 * 100}%`;
})();
