/* ============================================================
   The Anatomy of a Workflow Skill
   Scroll reveals, diagram animations, scroll progress, theme.
   No dependencies. Reduced-motion aware (handled in CSS).
   ============================================================ */
(function () {
  "use strict";
  var root = document.documentElement;

  /* ---------- theme toggle ---------- */
  var STORE = "wsk-theme";
  function currentTheme() {
    return root.getAttribute("data-theme") || "light";
  }
  var toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem(STORE, next); } catch (e) {}
    });
  }

  /* ---------- scroll progress bar ---------- */
  var bar = document.getElementById("progress");
  function updateProgress() {
    if (!bar) return;
    var max = root.scrollHeight - root.clientHeight;
    var top = window.pageYOffset || root.scrollTop || 0;
    var pct = max > 0 ? (top / max) * 100 : 0;
    bar.style.width = pct.toFixed(2) + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  /* ---------- reveal + diagram animation on scroll ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (!("IntersectionObserver" in window)) {
    // No observer support: show everything.
    reveals.forEach(function (el) { el.classList.add("in-view"); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        io.unobserve(entry.target); // reveal once, then stop watching
      }
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.15 });

  reveals.forEach(function (el) { io.observe(el); });
})();
