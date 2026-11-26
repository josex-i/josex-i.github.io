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
  html("#av-grid", av.map((p, i) => `
    <button class="av-card" data-i="${i}" aria-label="Open photo: ${esc(p.caption)}">
      <img src="${esc(p.src)}" alt="${esc(p.caption)}" loading="lazy"><span>${esc(p.caption)}</span>
    </button>`).join(""));
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
  addEventListener("resize", fitName);
  document.fonts?.ready.then(fitName);

  /* ----- mobile menu ----- */
  const toggle = $(".nav__toggle"), menu = $("#menu");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", open); menu.classList.toggle("is-open", open);
  });
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) { toggle.setAttribute("aria-expanded", "false"); menu.classList.remove("is-open"); } });

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
