(() => {
  const wrap = document.getElementById("duoPathWrap");
  const nodes = [...document.querySelectorAll(".duo-node[data-lesson]")];
  if (!wrap || !nodes.length) return;

  const storageKey = "chamcham-chemistry-cluster";
  let state = {};
  try { state = JSON.parse(localStorage.getItem(storageKey) || "{}"); } catch {}

  let completedCount = 0;
  let currentIndex = -1;
  nodes.forEach((node, index) => {
    const id = node.dataset.lesson;
    node.classList.remove("is-complete", "is-current", "is-upcoming");
    if (state[id] === "complete") {
      node.classList.add("is-complete");
      completedCount++;
      const status = node.querySelector(".duo-node-status");
      if (status) status.textContent = "Đã hoàn thành";
    } else if (currentIndex === -1) {
      // first not-yet-complete lesson in order becomes "current"
      node.classList.add("is-current");
      currentIndex = index;
      const status = node.querySelector(".duo-node-status");
      if (status) status.textContent = state[id] === "active" ? "Đang học" : "Bắt đầu tại đây";
    } else {
      node.classList.add("is-upcoming");
    }
    node.addEventListener("click", () => {
      state.current = id;
      if (!state[id]) state[id] = "active";
      localStorage.setItem(storageKey, JSON.stringify(state));
    });
  });

  const progressText = document.getElementById("hubProgressText");
  const progressBar = document.getElementById("hubProgressBar");
  if (progressText) progressText.textContent = `${completedCount}/${nodes.length} bài đã học`;
  if (progressBar) progressBar.style.width = `${(completedCount / nodes.length) * 100}%`;

  // --- draw the winding SVG path through each node's circle center ---
  const svg = document.getElementById("duoPathSvg");
  const basePath = document.getElementById("duoPathLine");
  const donePath = document.getElementById("duoPathLineDone");
  if (!svg || !basePath) return;

  const buildCurve = (points) => {
    if (points.length < 2) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const dy = (p1.y - p0.y) / 2;
      d += ` C ${p0.x} ${p0.y + dy}, ${p1.x} ${p1.y - dy}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const redraw = () => {
    const wrapRect = wrap.getBoundingClientRect();
    svg.setAttribute("width", wrapRect.width);
    svg.setAttribute("height", wrapRect.height);
    svg.setAttribute("viewBox", `0 0 ${wrapRect.width} ${wrapRect.height}`);
    const points = nodes.map((node) => {
      const circle = node.querySelector(".duo-node-circle");
      const rect = circle.getBoundingClientRect();
      return { x: rect.left + rect.width / 2 - wrapRect.left, y: rect.top + rect.height / 2 - wrapRect.top };
    });
    basePath.setAttribute("d", buildCurve(points));
    if (donePath) {
      const highlightTo = currentIndex === -1 ? points.length - 1 : currentIndex;
      donePath.setAttribute("d", buildCurve(points.slice(0, highlightTo + 1)));
    }
  };

  redraw();
  new ResizeObserver(redraw).observe(wrap);
  window.addEventListener("load", redraw);
})();
