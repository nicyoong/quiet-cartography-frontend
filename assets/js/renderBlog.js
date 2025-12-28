import { posts, categories, site } from "./blogData.js";

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function byNewest(a, b) {
  return new Date(b.date) - new Date(a.date);
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[m]));
}

export function initSiteText() {
  const nameNodes = document.querySelectorAll("[data-site-name]");
  nameNodes.forEach(n => n.textContent = site.name);
  const tag = document.querySelector("[data-site-tagline]");
  if (tag) tag.textContent = site.tagline;
}

export function initBlogIndex() {
  const list = document.querySelector("[data-post-list]");
  const select = document.querySelector("[data-category-select]");
  const search = document.querySelector("[data-search-input]");
  const count = document.querySelector("[data-result-count]");

  if (!list || !select) return;

  // Build category options
  select.innerHTML = categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");

  let state = { category: "All", q: "" };

  function getFiltered() {
    const q = state.q.trim().toLowerCase();
    return posts
      .slice()
      .sort(byNewest)
      .filter(p => (state.category === "All" ? true : p.category === state.category))
      .filter(p => {
        if (!q) return true;
        return (p.title + " " + p.excerpt + " " + p.tags.join(" ")).toLowerCase().includes(q);
      });
  }

  function render() {
    const items = getFiltered();
    if (count) count.textContent = `${items.length} post${items.length === 1 ? "" : "s"}`;

    list.innerHTML = items.map(p => `
      <article class="post-row">
        <div class="topline">
          <div style="display:flex; gap: 10px; align-items:center; flex-wrap:wrap;">
            <a class="title link" href="../pages/post.html?slug=${encodeURIComponent(p.slug)}">${escapeHtml(p.title)}</a>
            <span class="pill">${escapeHtml(p.category)}</span>
          </div>
          <div class="small faint">${formatDate(p.date)} · ${p.readTime} min</div>
        </div>
        <p class="desc">${escapeHtml(p.excerpt)}</p>
        <div class="tags" aria-label="Tags">
          ${p.tags.map(t => `<span class="pill">${escapeHtml(t)}</span>`).join("")}
        </div>
      </article>
    `).join("");

    if (!items.length) {
      list.innerHTML = `
        <div class="card">
          <div class="kicker">No matches</div>
          <p class="lede">Try a different category or search term.</p>
        </div>`;
    }
  }

  select.addEventListener("change", () => { state.category = select.value; render(); });
  if (search) search.addEventListener("input", () => { state.q = search.value; render(); });

  render();
}

export function initFeaturedPosts() {
  const wrap = document.querySelector("[data-featured]");
  if (!wrap) return;

  const featured = posts.slice().sort(byNewest).slice(0, 3);

  wrap.innerHTML = featured.map(p => `
    <a class="card" href="./pages/post.html?slug=${encodeURIComponent(p.slug)}">
      <div class="meta">
        <span>${escapeHtml(p.category)}</span>
        <span aria-hidden="true">·</span>
        <span>${new Date(p.date + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "2-digit" })}</span>
        <span aria-hidden="true">·</span>
        <span>${p.readTime} min</span>
      </div>
      <h3>${escapeHtml(p.title)}</h3>
      <p>${escapeHtml(p.excerpt)}</p>
    </a>
  `).join("");
}

export function initPostPage() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const node = document.querySelector("[data-post]");

  if (!node) return;

  const post = posts.find(p => p.slug === slug) || posts.slice().sort(byNewest)[0];

  // Fill metadata
  document.title = `${post.title} · ${site.name}`;
  const title = node.querySelector("[data-post-title]");
  const subtitle = node.querySelector("[data-post-excerpt]");
  const meta = node.querySelector("[data-post-meta]");
  const heroAlt = node.querySelector("[data-hero-alt]");
  const heroCap = node.querySelector("[data-hero-caption]");
  const content = node.querySelector("[data-post-content]");
  const tagWrap = node.querySelector("[data-post-tags]");

  if (title) title.textContent = post.title;
  if (subtitle) subtitle.textContent = post.excerpt;
  if (meta) meta.textContent = `${site.author} · ${formatDate(post.date)} · ${post.readTime} min read`;
  if (heroAlt) heroAlt.textContent = post.hero?.alt || "";
  if (heroCap) heroCap.textContent = post.hero?.caption || "";
  if (content) content.innerHTML = post.content.join("\n");
  if (tagWrap) tagWrap.innerHTML = post.tags.map(t => `<span class="pill">${escapeHtml(t)}</span>`).join("");

  // Reading progress
  const bar = document.querySelector("[data-progress]");
  const onScroll = () => {
    if (!bar) return;
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const pct = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0;
    bar.style.width = pct.toFixed(2) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Back link remembers blog filters (nice detail)
  const back = document.querySelector("[data-back]");
  if (back && document.referrer && document.referrer.includes("blog.html")) {
    back.href = document.referrer;
  }
}
