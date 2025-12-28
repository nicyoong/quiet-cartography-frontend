import { initTheme } from "./theme.js";
import { initSiteText, initFeaturedPosts, initBlogIndex, initPostPage } from "./renderBlog.js";

function setActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav.site-nav a").forEach(a => {
    const href = (a.getAttribute("href") || "").split("/").pop();
    if (href === path) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

// Slightly refined "hide on scroll down"
function initNavScroll() {
  const header = document.querySelector("header.site-header");
  if (!header) return;
  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    const goingDown = y > lastY;
    const nearTop = y < 16;

    header.style.transform = (!nearTop && goingDown) ? "translateY(-110%)" : "translateY(0)";
    header.style.transition = "transform 240ms var(--ease)";
    lastY = y;
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

initTheme();
initSiteText();
setActiveNav();
initNavScroll();

initFeaturedPosts();
initBlogIndex();
initPostPage();
