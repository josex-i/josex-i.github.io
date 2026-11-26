/* Builds the page from content.js. You normally don't need to edit this file. */
(function () {
  const C = window.CONTENT || CONTENT;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (n) => (n == null ? "—" : Number(n).toLocaleString("en-US"));
  const html = (sel, s) => { const el = $(sel); if (el) el.innerHTML = s; };

  /* ----- simple text ----- */
  document.title = `${C.name} · ${C.role}`;
  document.querySelectorAll("[data-bind]").forEach((el) => {
    const v = C[el.dataset.bind];
    if (v) el.textContent = v;
    else if (el.dataset.bind === "availability") el.closest(".kicker")?.remove();
  });
  $("#year").textContent = new Date().getFullYear();

  /* ----- ticker (duplicated for a seamless loop) ----- */
  const items = (C.ticker || []).map((t) => `<span>${esc(t)}<i>▲</i></span>`).join("");
  if (items) html("#ticker", items + items); else $(".ticker")?.remove();

  /* ----- CV + portrait ----- */
  const cv = $("#cv-link");
  if (C.cv) cv.href = C.cv; else cv.remove();
  html("#portrait", C.portrait
    ? `<img src="${esc(C.portrait)}" alt="Portrait of ${esc(C.name)}">`
    : `<div class="initials" aria-hidden="true">${esc(C.initials)}</div>`);

  /* ----- social pills (hero) + nav counts ----- */
  const K = C.contact || {};
  const ICON = {
    linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
  };
  const socials = [
    K.linkedin && ["LinkedIn", K.linkedin, ICON.linkedin],
    K.youtube && ["YouTube", K.youtube, ICON.youtube],
    K.email && ["Email", `mailto:${K.email}`, ICON.email],
    K.phone && ["Call", `tel:${K.phone.replace(/\s/g, "")}`, ICON.phone],
  ].filter(Boolean);
  html("#socials", socials.map(([label, href, icon]) =>
    `<li><a class="pill pill--link" href="${esc(href)}" ${href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${icon}<span>${esc(label)}</span></a></li>`).join(""));
  document.querySelectorAll("[data-count]").forEach((el) => {
    const n = (C[el.dataset.count] || []).length;
    el.textContent = n ? `[${String(n).padStart(2, "0")}]` : "";
  });

  /* ----- real headshot in the About section ----- */
  html("#about-photo", C.aboutPhoto ? `<img src="${esc(C.aboutPhoto)}" alt="Joseph Omondi Otieno" loading="lazy" width="480" height="480"><figcaption>${esc(C.name)} · ${esc(C.location)}</figcaption>` : "");
  if (!C.aboutPhoto) $("#about-photo")?.remove();

  /* ----- key figures ----- */
  html("#stats", (C.stats || []).map((s) => `<div><dt>${esc(s.value)}</dt><dd>${esc(s.label)}</dd></div>`).join(""));

  /* ----- profile ----- */
  html("#about-text", (C.about || []).map((p) => `<p>${esc(p)}</p>`).join(""));
  html("#expertise-cards", (C.expertise || []).map((e, i) => `
    <article class="comp reveal">
      <h3>${esc(e.title)} <small>0${i + 1}</small></h3>
      <p>${esc(e.summary)}</p>
      <ul>${e.skills.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
      <div class="tags">${(e.tools || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
    </article>`).join(""));

  /* ----- dashboard pieces for each case study ----- */
  const D = C.dashboards || {};
  const nf = (n) => Number(n).toLocaleString("en-US");
  function meterHTML(m) {
    const fill = Math.min(m.pct, 100);
    const over = m.pct > 100;
    return `<div class="card meter">
      <div class="card__head"><span>${esc(m.label)}</span><b>${m.pct}%</b></div>
      <div class="meter__track" role="img" aria-label="${esc(m.label)}: ${m.pct}%">
        <i style="width:${fill}%"></i>${over ? `<em class="meter__over">+${(m.pct - 100).toFixed(1)}% over target</em>` : ""}
      </div>
      <div class="card__foot">${esc(m.note || "")}</div>
    </div>`;
  }
  function barsHTML(b) {
    const max = Math.max(...b.data.map((d) => d[1]));
    const cols = b.data.map(([label, v]) => {
      const h = Math.max(2, (v / max) * 100);
      const val = (b.unit ? b.unit + " " : "") + nf(v);
      return `<div class="bar" data-tip="${esc(label)}: ${esc(val)}" tabindex="0" aria-label="${esc(label)}: ${esc(val)}">
        <span class="bar__val">${v === max ? esc(val) : ""}</span>
        <i style="height:${h}%"></i>
        <span class="bar__label">${esc(label)}</span>
      </div>`;
    }).join("");
    const table = `<table class="sr-only"><caption>${esc(b.title)}</caption>${b.data.map(([l, v]) => `<tr><th>${esc(l)}</th><td>${nf(v)}</td></tr>`).join("")}</table>`;
    return `<div class="card bars-card">
      <div class="card__head"><span>${esc(b.title)}</span>${b.unit ? `<small>${esc(b.unit)}</small>` : ""}</div>
      <div class="bars" style="--n:${b.data.length}">${cols}</div>${table}
    </div>`;
  }
  function dashHTML(code) {
    const d = D[code]; if (!d) return "";
    const kpis = (d.kpis || []).map(([v, l]) => `<div class="kpi"><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join("");
    return `<div class="dashboard">
      <div class="kpis" style="--k:${(d.kpis || []).length}">${kpis}</div>
      ${(d.meter || d.bars) ? `<div class="viz-row${d.meter && d.bars ? " viz-row--2" : ""}">${d.meter ? meterHTML(d.meter) : ""}${d.bars ? barsHTML(d.bars) : ""}</div>` : ""}
    </div>`;
  }

  /* ----- case studies ledger ----- */
  html("#toolkit-list", (C.caseStudies || []).map((t, i) => `
    <div class="tk">
      <button class="tk__row" aria-expanded="false" aria-controls="tk-${i}">
        <span class="tk__code">${esc(t.code)}</span>
        <span><span class="tk__name">${esc(t.name)}</span><span class="tk__area">${esc(t.area)}</span></span>
        <span class="tk__result">${esc(t.result)}</span>
        <span class="tk__chev" aria-hidden="true">+</span>
      </button>
      <div class="tk__body" id="tk-${i}" hidden>
        ${dashHTML(t.code)}
        <div class="cs">
          <div class="cs__col">
            <h4>The problem</h4><p>${esc(t.problem)}</p>
            <h4>What it does</h4><ul class="tk__reports">${(t.does || []).map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
          </div>
          <div class="cs__col">
            <h4>Result</h4><p class="cs__result">${esc(t.outcome)}</p>
            <h4>My role</h4><p>${esc(t.role)}</p>
          </div>
        </div>
        ${t.exhibit ? `<figure class="exhibit"><a href="${esc(t.exhibit)}" target="_blank" rel="noopener"><img src="${esc(t.exhibit)}" alt="${esc(t.exhibitCaption)}" loading="lazy"></a><figcaption><b>Exhibit</b> · ${esc(t.exhibitCaption)}</figcaption></figure>` : ""}
      </div>
    </div>`).join(""));
  /* hover / focus tooltip for the bar charts */
  const tip = $("#viz-tip");
  function showTip(el) {
    if (!tip || !el?.dataset.tip) return;
    tip.textContent = el.dataset.tip; tip.hidden = false;
    const r = el.querySelector("i").getBoundingClientRect(), host = $("#toolkits").getBoundingClientRect();
    tip.style.left = (r.left + r.width / 2 - host.left) + "px";
    tip.style.top = (r.top - host.top - 10) + "px";
  }
  const hideTip = () => { if (tip) tip.hidden = true; };
  $("#toolkit-list").addEventListener("pointerover", (e) => showTip(e.target.closest(".bar")));
  $("#toolkit-list").addEventListener("pointerout", (e) => { if (e.target.closest(".bar")) hideTip(); });
  $("#toolkit-list").addEventListener("focusin", (e) => showTip(e.target.closest(".bar")));
  $("#toolkit-list").addEventListener("focusout", hideTip);

  /* ----- films (Google Drive, loaded only when played) ----- */
  const films = C.films || [];
  if (!films.length) { $("#films")?.remove(); $('a[href="#films"]')?.remove(); }
  html("#film-list", films.map((f) => `
    <article class="film">
      <button class="film__frame" data-id="${esc(f.id)}" aria-label="Play ${esc(f.title)}">
        <img src="https://drive.google.com/thumbnail?id=${encodeURIComponent(f.id)}&sz=w1000" alt="" loading="lazy" onerror="this.remove()">
        <span class="film__play" aria-hidden="true">▶</span>
      </button>
      <div class="film__meta"><h3>${esc(f.title)}</h3><p>${esc(f.note || "")}</p>
        <a href="https://drive.google.com/file/d/${encodeURIComponent(f.id)}/view" target="_blank" rel="noopener">Open in Drive ↗</a></div>
    </article>`).join(""));
  $("#film-list")?.addEventListener("click", (e) => {
    const b = e.target.closest(".film__frame"); if (!b) return;
    b.outerHTML = `<div class="film__frame"><iframe src="https://drive.google.com/file/d/${encodeURIComponent(b.dataset.id)}/preview" allow="autoplay; fullscreen" allowfullscreen title="${esc(b.getAttribute("aria-label"))}"></iframe></div>`;
  });

  html("#further", (C.furtherWork || []).map((f) => `<div class="control"><b class="plain">${esc(f.title)}</b><span>${esc(f.text)}</span><em class="fig">${esc(f.figure)}</em></div>`).join(""));
  html("#workbooks-note", esc(C.workbooksNote));
  html("#languages", C.languages ? `<b>Languages:</b> ${esc(C.languages)}` : "");
  $("#toolkit-list").addEventListener("click", (e) => {
    const b = e.target.closest(".tk__row"); if (!b) return;
    const open = b.getAttribute("aria-expanded") !== "true";
    b.setAttribute("aria-expanded", open);
    b.parentElement.classList.toggle("is-open", open);
    b.nextElementSibling.hidden = !open;
  });
  // open the first one so visitors see there's more inside
  $("#toolkit-list .tk__row")?.click();

  html("#controls", (C.controls || []).map((c) => `<div class="control"><b>${esc(c.title)}</b><span>${esc(c.text)}</span></div>`).join(""));

  /* ----- administration ----- */
  html("#admin-list", (C.admin || []).map((a) => `<li class="reveal"><b>${esc(a.value)}</b><span>${esc(a.label)}</span></li>`).join(""));
  html("#admin-also", (C.adminAlso || []).length ? `<span class="also__label">Also:</span>` + C.adminAlso.map((t) => `<span class="tag">${esc(t)}</span>`).join("") : "");

  /* ----- media ----- */
  const M = C.media || {};
  const yt = (C.contact || {}).youtube;
  html("#media-blurb", esc(M.blurb) + (yt ? `<br><a class="btn btn--small" style="margin-top:1rem" href="${esc(yt)}" target="_blank" rel="noopener">Watch my videos on YouTube ↗</a>` : ""));
  html("#media-feature", M.feature
    ? `<figure class="media-feature"><img src="${esc(M.feature)}" alt="On set filming a liturgical celebration" loading="lazy"><figcaption><b>${esc(M.company)}</b>${M.featureNote ? ` · ${esc(M.featureNote)}` : ""}</figcaption></figure>` : "");
  const av = C.avPhotos || [];
  html("#av-title", av.length ? esc(C.avTitle || "") : "");
  if (!av.length) $("#av-title")?.remove();
  html("#projects", (C.projects || []).map((p) => `
    <article class="project">
      <div class="project__media">${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">` : ""}</div>
      <div class="project__body">
        <div class="project__cat">Web design · ${esc(p.category)}</div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.description)}</p>
        ${p.outcome ? `<p class="project__outcome">${esc(p.outcome)}</p>` : ""}
        ${p.link ? `<a class="project__link" href="${esc(p.link)}" target="_blank" rel="noopener">Visit the site ↗</a>` : ""}
      </div>
    </article>`).join(""));

  /* AV cards + gallery share one lightbox */
  const gallery = C.photos || [];
  const photos = av.concat(gallery);
  const pad = (n) => String(n).padStart(2, "0");
  html("#av-grid", av.map((p, i) => `
    <button class="av-card" data-i="${i}" aria-label="Open photo: ${esc(p.caption)}">
      <img src="${esc(p.src)}" alt="${esc(p.caption)}" loading="lazy"><span><em>${pad(i + 1)} / ${pad(av.length)}</em>${esc(p.caption)}</span>
    </button>`).join(""));
  const A = C.avArchive;
  html("#av-archive", A && A.photos?.length ? `
    <div class="archive__head"><h3>${esc(A.title)}</h3><span>${esc(A.date)}</span></div>
    <div class="archive__pair">${A.photos.map((src, i) => `<figure><img src="${esc(src)}" alt="${esc(A.caption)}" loading="lazy"></figure>`).join("")}</div>
    <p class="archive__caption">${esc(A.caption)}</p>` : "");
  html("#gallery", gallery.map((p, i) => `
    <button data-i="${av.length + i}" aria-label="Open photo: ${esc(p.caption)}">
      <img src="${esc(p.src)}" alt="${esc(p.caption)}" loading="lazy"><span>${esc(p.caption)}</span>
    </button>`).join(""));
  const lb = $("#lightbox"), lbImg = $("img", lb), lbCap = $("figcaption", lb);
  let cur = 0;
  const show = (i) => { cur = (i + photos.length) % photos.length; lbImg.src = photos[cur].src; lbImg.alt = photos[cur].caption; lbCap.textContent = photos[cur].caption; };
  ["#gallery", "#av-grid"].forEach((sel) => $(sel)?.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; show(+b.dataset.i); lb.showModal(); }));
  $(".lightbox__close", lb).onclick = () => lb.close();
  $(".lightbox__prev", lb).onclick = () => show(cur - 1);
  $(".lightbox__next", lb).onclick = () => show(cur + 1);
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1); });

  /* ----- audio (hidden when empty) ----- */
  const tracks = C.audio || [];
  if (!tracks.length) $("#audio").remove();
  else html("#tracks", tracks.map((t) => `
    <li class="track">
      <div class="track__info"><strong>${esc(t.title)}</strong><small>${esc(t.detail)}</small></div>
      ${t.src ? `<audio controls preload="none" src="${esc(t.src)}"></audio>`
        : t.link ? `<a class="btn btn--small" href="${esc(t.link)}" target="_blank" rel="noopener">Listen ↗</a>` : ""}
    </li>`).join(""));

  /* ----- experience ----- */
  html("#timeline", (C.experience || []).map((x) => `
    <li class="reveal">
      <div class="period">${esc(x.period)}</div>
      <div>
        <h3>${esc(x.role)}</h3>
        <div class="org">${esc(x.org)}</div>
        <ul>${(x.points || []).map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
      </div>
    </li>`).join(""));
  html("#education", (C.education || []).map((e) => `
    <li><span><strong>${esc(e.title)}</strong><br><small>${esc(e.org)}</small></span><span class="num">${esc(e.period)}</span></li>`).join(""));

  /* ----- contact ----- */
  const k = C.contact || {};
  const emailBtn = $("#email-btn");
  if (k.email) { emailBtn.href = `mailto:${k.email}`; emailBtn.textContent = k.email; }
  else emailBtn.remove();
  const links = [
    k.phone && [`tel:${k.phone.replace(/\s/g, "")}`, k.phone],
    k.linkedin && [k.linkedin, "LinkedIn"],
    k.youtube && [k.youtube, "YouTube"],
    k.github && [k.github, "GitHub"],
    k.whatsapp && [k.whatsapp, "WhatsApp"],
    C.cv && [C.cv, "CV (PDF)"],
    C.location && [null, C.location],
  ].filter(Boolean);
  html("#contact-links", links.map(([href, text]) =>
    href ? `<li><a href="${esc(href)}" ${href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${esc(text)}</a></li>` : `<li class="plain">${esc(text)}</li>`).join(""));

  /* ----- make the big hero name fill the width exactly ----- */
  const nameEl = $(".hero__name");
  function fitName() {
    if (!nameEl) return;
    const stacked = getComputedStyle(nameEl).flexDirection === "column";
    nameEl.style.fontSize = "100px";
    const words = [...nameEl.children];
    const widths = words.map((w) => w.getBoundingClientRect().width);
    const gap = parseFloat(getComputedStyle(nameEl).columnGap) || 0;
    const natural = stacked ? Math.max(...widths) : widths.reduce((a, b) => a + b, 0) + gap * (words.length - 1);
    const avail = nameEl.clientWidth;
    nameEl.style.fontSize = Math.min(100 * avail / natural * 0.995, 260) + "px";
  }
  fitName();
  const navEl = $(".nav");
  const onScroll = () => navEl?.classList.toggle("is-scrolled", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  addEventListener("resize", fitName);
  document.fonts?.ready.then(fitName);

  /* ----- mobile menu ----- */
  const toggle = $(".nav__toggle"), menu = $("#menu");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", open); menu.classList.toggle("is-open", open);
  });
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) { toggle.setAttribute("aria-expanded", "false"); menu.classList.remove("is-open"); } });

  /* ----- cinematic "focus pull": photos sharpen as they scroll into view ----- */
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const fo = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in-focus"); fo.unobserve(en.target); } }), { threshold: 0.35 });
    document.querySelectorAll(".natural .gallery button, .natural .project__media, .archive figure").forEach((el) => { el.classList.add("focus-pull"); fo.observe(el); });
  }

  /* ----- reveal on scroll + active nav link ----- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } }), { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    const navLinks = [...menu.querySelectorAll('a[href^="#"]')];
    const spy = new IntersectionObserver((es) => es.forEach((en) => {
      if (en.isIntersecting) navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${en.target.id}`));
    }), { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }
})();
