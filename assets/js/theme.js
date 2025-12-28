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
  console.log("initTheme running");
  const stored = localStorage.getItem(storageKey);
  if (stored === "light" || stored === "dark") {
    applyTheme(stored);
  } else {
    applyTheme(getPreferredTheme());
  }
  const toggle = document.querySelector("[data-theme-toggle]");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const next =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }
}
