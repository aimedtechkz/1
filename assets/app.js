const CATEGORY_NAMES = {
  furniture: "Мебель и оснащение",
  cardiology: "Кардиология",
  diagnostics: "Диагностика",
  urology: "Урология",
  gynecology: "Гинекология",
  lor: "ЛОР",
  orthopedics: "Ортопедия",
  resuscitation: "Реанимация",
  therapy: "Терапия",
  surgery: "Хирургия",
  traumatology: "Травматология",
  laboratory: "Лаборатория",
  dentistry: "Стоматология",
  ophthalmology: "Офтальмология",
  "electrical-equipment": "Электрооборудование",
  transport: "Транспорт"
};

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

function productCard(p) {
  const cat = CATEGORY_NAMES[p.category] || p.category;
  return `<article class="product-card" data-id="${p.id}" role="button" tabindex="0">
    <div class="img-wrap"><img src="${esc(p.image)}" alt="${esc(p.alt)}" loading="lazy" onerror="this.style.opacity='.3'"></div>
    <div class="body">
      <div class="cat">${esc(cat)}</div>
      <h3>${esc(p.title)}</h3>
      <p class="desc">${esc(p.short)}</p>
      <div class="more"><span>Подробнее</span></div>
    </div>
  </article>`;
}

function openModal(p) {
  const cat = CATEGORY_NAMES[p.category] || p.category;
  const overlay = document.getElementById("product-modal");
  if (!overlay) return;
  overlay.querySelector(".modal-img img").src = p.image;
  overlay.querySelector(".modal-img img").alt = p.alt || p.title;
  overlay.querySelector(".modal-info .cat").textContent = cat;
  overlay.querySelector(".modal-info h2").textContent = p.title;
  overlay.querySelector(".modal-info .short").textContent = p.short;
  overlay.querySelector(".modal-info .full").textContent = p.full;
  const link = overlay.querySelector(".modal-info .btn-gold");
  if (link) link.href = "contact.html?product=" + encodeURIComponent(p.title);
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const overlay = document.getElementById("product-modal");
  if (!overlay) return;
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}

function bindProductCards(root) {
  root.querySelectorAll(".product-card").forEach(el => {
    const id = Number(el.dataset.id);
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    el.addEventListener("click", () => openModal(p));
    el.addEventListener("keydown", e => { if (e.key === "Enter") openModal(p); });
  });
}

function initMenu() {
  const btn = document.getElementById("menu-btn");
  const nav = document.getElementById("mobile-nav");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => nav.classList.toggle("open"));
}

function initCatalog() {
  const grid = document.getElementById("product-grid");
  const filters = document.getElementById("filters");
  const search = document.getElementById("search");
  const countEl = document.getElementById("result-count");
  if (!grid) return;

  const params = new URLSearchParams(location.search);
  let activeCat = params.get("cat") || "all";
  let query = params.get("q") || "";

  const counts = {};
  PRODUCTS.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
  const order = Object.keys(CATEGORY_NAMES);
  let chips = `<button type="button" class="chip ${activeCat==="all"?"active":""}" data-cat="all">Все · ${PRODUCTS.length}</button>`;
  order.forEach(id => {
    if (!counts[id]) return;
    chips += `<button type="button" class="chip ${activeCat===id?"active":""}" data-cat="${id}">${CATEGORY_NAMES[id]} · ${counts[id]}</button>`;
  });
  filters.innerHTML = chips;

  function render() {
    const q = query.trim().toLowerCase();
    const list = PRODUCTS.filter(p => {
      if (activeCat !== "all" && p.category !== activeCat) return false;
      if (!q) return true;
      const hay = (p.title + " " + p.short + " " + p.full + " " + (CATEGORY_NAMES[p.category]||"")).toLowerCase();
      return hay.includes(q);
    });
    countEl.textContent = "Найдено: " + list.length;
    if (!list.length) {
      grid.innerHTML = `<div class="empty"><p style="font-family:var(--display);font-size:1.5rem">Ничего не найдено</p><p class="muted mt-2">Сбросьте фильтр или измените запрос</p></div>`;
      return;
    }
    grid.innerHTML = list.map(productCard).join("");
    bindProductCards(grid);
  }

  filters.addEventListener("click", e => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    activeCat = btn.dataset.cat;
    filters.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c.dataset.cat === activeCat));
    const url = new URL(location.href);
    if (activeCat === "all") url.searchParams.delete("cat"); else url.searchParams.set("cat", activeCat);
    history.replaceState(null, "", url);
    render();
  });

  if (search) {
    search.value = query;
    search.addEventListener("input", () => {
      query = search.value;
      const url = new URL(location.href);
      if (query) url.searchParams.set("q", query); else url.searchParams.delete("q");
      history.replaceState(null, "", url);
      render();
    });
  }

  render();
}

function initHomeFeatured() {
  const grid = document.getElementById("featured-grid");
  if (!grid) return;
  const ids = [1, 22, 35, 55, 90, 140];
  const list = ids.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  grid.innerHTML = list.map(productCard).join("");
  bindProductCards(grid);
}

function initContactPrefill() {
  const params = new URLSearchParams(location.search);
  const product = params.get("product");
  const msg = document.querySelector('textarea[name="message"]');
  if (product && msg && !msg.value) {
    msg.value = "Интересует позиция: " + product + ". Прошу прислать наличие, сроки и коммерческое предложение.";
  }
}

function initForm() {
  const form = document.getElementById("inquiry-form");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    if ((fd.get("company_website") || "").toString().trim()) {
      form.innerHTML = '<div class="text-center" style="padding:2rem"><p style="font-family:var(--display);font-size:1.5rem">Заявка отправлена</p></div>';
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = "Отправка…";
    try {
      const res = await fetch("https://formspree.io/f/xnnlaqjp", {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" }
      });
      if (!res.ok) throw new Error("fail");
      form.innerHTML = '<div class="text-center" style="padding:2rem"><p style="font-family:var(--display);font-size:1.5rem">Заявка отправлена</p><p class="muted mt-2">Мы ответим в рабочие часы Пн–Пт, 9:00–18:00</p></div>';
    } catch {
      btn.disabled = false;
      btn.textContent = "Отправить запрос";
      alert("Не удалось отправить. Позвоните +7 (702) 204-01-12 или напишите info@aimedtech.kz");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initCatalog();
  initHomeFeatured();
  initContactPrefill();
  initForm();
  const overlay = document.getElementById("product-modal");
  if (overlay) {
    overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
    overlay.querySelector(".modal-close")?.addEventListener("click", closeModal);
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
  }
});
