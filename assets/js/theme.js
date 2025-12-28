// Theme: system-aware + persisted
const storageKey = "qc-theme";

function getPreferredTheme() {
  const stored = localStorage.getItem(storageKey);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(storageKey, theme);
  const btn = document.querySelector("[data-theme-toggle]");
  if (btn) {
    btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    btn.querySelector("[data-theme-label]").textContent = theme === "dark" ? "Dark" : "Light";
  }
}

export function initTheme() {
  applyTheme(getPreferredTheme());

  // Update if system changes and user hasn't explicitly chosen
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener?.("change", () => {
    const stored = localStorage.getItem(storageKey);
    if (!stored) applyTheme(getPreferredTheme());
  });

  const toggle = document.querySelector("[data-theme-toggle]");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }
}
