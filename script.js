/* Builds the page from content.js. You normally don't need to edit this file. */
(function () {
  const RAW = window.CONTENT || CONTENT;
  // ?for=stage etc. shows a tailored version (see "versions" in content.js)
  const V = window.Versions ? Versions.pickVersion(RAW, location.search) : null;
  const C = window.Versions ? Versions.filterContent(RAW, V) : RAW;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (n) => (n == null ? "—" : Number(n).toLocaleString("en-US"));
  const html = (sel, s) => { const el = $(sel); if (el) el.innerHTML = s; };

  /* ----- simple text ----- */
  document.title = `${C.name} · ${V ? C.heroTitle : C.role}`;
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
  /* each figure gets a small picture that animates in ("results first") */
  function vizHTML(v) {
    if (!v) return "";
    if (v.type === "meter") {
      const base = Math.min(v.pct, 100) / Math.max(v.pct, 100) * 100;
      return `<div class="kv kv--meter" aria-hidden="true"><i style="--w:${base}%"></i>${v.pct > 100 ? `<b style="--w:${100 - base}%"></b>` : ""}<em style="left:${base}%">target</em></div>`;
    }
    if (v.type === "checks") return `<div class="kv kv--checks" aria-hidden="true">${Array.from({ length: v.total }, (_, i) => `<i class="${i < v.pass ? "ok" : ""}" style="--i:${i}"></i>`).join("")}</div>`;
    if (v.type === "compare") return `<div class="kv kv--compare" aria-hidden="true"><span><i style="--w:100%"></i><small>Before · ${v.before} ${esc(v.unit || "")}</small></span><span><i class="now" style="--w:${v.after / v.before * 100}%"></i><small>Now · ${v.after} ${esc(v.unit || "")}</small></span></div>`;
    return `<div class="kv kv--count" aria-hidden="true">${Array.from({ length: 24 }, (_, i) => `<i style="--h:${30 + Math.round(60 * Math.abs(Math.sin(i * 1.7)))}%;--i:${i}"></i>`).join("")}</div>`;
  }
  html("#stats", (C.stats || []).map((s, i) => `<div class="kf reveal" style="--d:${i * 90}ms"><dt data-countup="${esc(s.value)}">${esc(s.value)}</dt><dd>${esc(s.label)}</dd>${vizHTML(s.viz)}</div>`).join(""));

  /* ----- profile ----- */
  html("#about-text", (C.about || []).map((p) => `<p>${esc(p)}</p>`).join(""));
  html("#expertise-cards", (C.expertise || []).map((e, i) => `
    <article class="comp reveal">
      <h3>${esc(e.title)} <small>0${i + 1}</small></h3>
      <p>${esc(e.summary)}</p>
      <ul>${e.skills.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
      <div class="tags">${(e.tools || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
    </article>`).join(""));

  /* ----- marble statue (full site only); its plinth words open the versions ----- */
  const ST = C.statue, stEl = $("#statue");
  if (ST && stEl && !V) {
    const words = ST.words || [];
    stEl.innerHTML = `
      <div class="statue__frame">
        <img src="${esc(ST.src)}" alt="${esc(ST.caption)}" loading="lazy" width="880" height="1100">
        ${words.map((w) => `<a class="statue__hot" href="${esc(w.href)}" style="left:${w.x}%;top:${w.y}%;width:${w.w}%;height:${w.h}%" aria-label="${esc(w.label)}"></a>`).join("")}
      </div>
      <figcaption>
        <p class="eyebrow"><span>✦</span> In one picture</p>
        <h3>${esc(ST.title)}</h3>
        <p class="statue__cap">${esc(ST.caption)}</p>
        <p class="statue__hint">Choose a word on the plinth to see that side of my work:</p>
        <div class="statue__words">${words.map((w) => `<a href="${esc(w.href)}">${esc(w.label)}</a>`).join("")}</div>
      </figcaption>`;
    stEl.hidden = false;
  } else stEl?.remove();

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
  html("#films-pitch", esc(C.filmsPitch || ""));
  const ytCta = $("#yt-cta");
  if (ytCta) { if ((C.contact || {}).youtube) ytCta.href = C.contact.youtube; else ytCta.remove(); }
  html("#film-list", films.map((f, i) => `
    <article class="film reveal" style="--d:${i * 100}ms">
      <button class="film__frame" data-id="${esc(f.id)}" aria-label="Play ${esc(f.title)}">
        <img src="https://drive.google.com/thumbnail?id=${encodeURIComponent(f.id)}&sz=w1000" alt="" loading="lazy" onerror="this.remove()">
        <span class="film__play" aria-hidden="true">▶</span>
      </button>
      <div class="film__meta"><span class="film__no">${String(i + 1).padStart(2, "0")}${f.tag ? ` · ${esc(f.tag)}` : ""}</span><h3>${esc(f.title)}</h3><p>${esc(f.note || "")}</p>
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
  const frameStart = av.length + gallery.length;
  // a gallery photo's details: title, optional story, and camera settings when the file had them
  const camLine = (p) => [p.camera, p.lens, p.settings, p.taken].filter(Boolean).join(" · ");
  const photoCap = (p) => [p.caption, p.story, camLine(p)].filter(Boolean).join(" — ");
  html("#photo-intro", esc(C.photographyIntro || ""));
  if (!C.photographyIntro) $("#photo-intro")?.remove();
  const photos = av.concat(gallery.map((p) => ({ ...p, caption: photoCap(p) })), (C.careerFrames || []).map((f) => ({ src: f.src, caption: `${f.caption} · ${f.date}` })));
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
      <img src="${esc(p.src)}" alt="${esc(p.caption)}" loading="lazy">
      <span class="ph-info"><b>${esc(p.caption)}</b>${p.story ? `<i>${esc(p.story)}</i>` : ""}${camLine(p) ? `<small>${esc(camLine(p))}</small>` : ""}</span>
    </button>`).join(""));
  const lb = $("#lightbox"), lbImg = $("img", lb), lbCap = $("figcaption", lb);
  let cur = 0;
  const show = (i) => { cur = (i + photos.length) % photos.length; lbImg.src = photos[cur].src; lbImg.alt = photos[cur].caption; lbCap.textContent = photos[cur].caption; };
  ["#gallery", "#av-grid"].forEach((sel) => $(sel)?.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; show(+b.dataset.i); lb.showModal(); }));
  $("#frames")?.addEventListener("click", (e) => { const b = e.target.closest(".frame"); if (!b || window.__framesDragged) return; show(frameStart + +b.dataset.i); lb.showModal(); });
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
  const XP = C.experience || [];
  const years = XP.map((x) => +(String(x.period).match(/\d{4}/) || [0])[0]).filter(Boolean);
  const since = years.length ? Math.min(...years) : null;
  html("#record-meta", [
    [String(XP.length).padStart(2, "0"), "roles on record"],
    since ? [String(new Date().getFullYear() - since), `years working, since ${since}`] : null,
    [String(XP.filter((x) => /present/i.test(x.period)).length).padStart(2, "0"), "roles held today"],
  ].filter(Boolean).map(([v, l]) => `<div><dt>${esc(v)}</dt><dd>${esc(l)}</dd></div>`).join(""));
  const FR = C.careerFrames || [];
  html("#frames", FR.length ? `<div class="frames__track">${FR.map((f, i) => `
    <button class="frame" data-i="${i}" aria-label="Open photo: ${esc(f.caption)}, ${esc(f.date)}">
      <span class="frame__img"><img src="${esc(f.src)}" alt="${esc(f.caption)}" loading="lazy" draggable="false"></span>
      <span class="frame__meta"><b>${esc(f.date)}</b>${esc(f.caption)}</span>
    </button>`).join("")}</div>
    <div class="frames__bar"><span>Career in frames · ${FR.length} photos · drag or scroll</span><i><b id="frames-progress"></b></i></div>` : "");
  if (!FR.length) $("#frames")?.remove();
  /* ----- career record: numbered roles + a panel that swaps to the chosen role ----- */
  const live = (x) => /present/i.test(x.period);
  const roleBody = (x) => `
      ${x.photo ? `<figure class="role__photo"><img src="${esc(x.photo)}" alt="${esc(x.role)}" loading="lazy"></figure>`
        : `<div class="role__facts"><span>${esc(x.org)}</span><b>${esc(x.period)}</b></div>`}
      <div class="role__text">
        <p class="role__meta">${esc(x.period)}${live(x) ? ` <span class="live"><span class="dot"></span>Current</span>` : ""}</p>
        <h3>${esc(x.role)}</h3><p class="org">${esc(x.org)}</p>
        <ul>${(x.points || []).map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
      </div>`;
  function renderRoles(xp) {
    const box = $("#roles"); if (!box) return;
    if (!xp.length) { box.remove(); return; }
    // An accordion of buttons: on phones each role opens below itself; on wide screens the panel on the right shows the open role.
    box.innerHTML = `<div class="roles__list">${xp.map((x, i) => `
      <div class="role-item">
        <button class="role" id="role-btn-${i}" type="button" data-i="${i}" aria-expanded="false" aria-controls="role-drawer-${i} role-panel">
          <b>${String(i + 1).padStart(2, "0")}</b><span>${esc(x.role)}<small>${esc(x.period)}</small></span>
        </button>
        <div class="role__drawer" id="role-drawer-${i}" role="region" aria-labelledby="role-btn-${i}" hidden>${roleBody(x)}</div>
      </div>`).join("")}</div>
      <div class="roles__panel" id="role-panel" role="region"></div>`;
    const buttons = [...box.querySelectorAll(".role")];
    const panel = box.querySelector(".roles__panel");
    const phone = matchMedia("(max-width: 899px)");
    function open(i, user) {
      const b = buttons[i];
      if (user && phone.matches && b.classList.contains("is-open")) {   // phones: tap an open role again to close it
        b.classList.remove("is-open"); b.setAttribute("aria-expanded", "false"); b.nextElementSibling.hidden = true; return;
      }
      buttons.forEach((x, j) => {
        const on = i === j, dr = x.nextElementSibling;
        x.classList.toggle("is-open", on); x.setAttribute("aria-expanded", String(on)); dr.hidden = !on;
        if (on) { dr.classList.remove("swap"); void dr.offsetWidth; dr.classList.add("swap"); }
      });
      panel.setAttribute("aria-labelledby", b.id);
      if (user) panel.setAttribute("aria-live", "polite");   // announce changes only after a visitor acts, not on page load
      panel.innerHTML = `<div class="swap">${roleBody(xp[i])}</div>`;
      if (user && phone.matches) b.scrollIntoView({ block: "nearest", behavior: "instant" });   // keep the tapped role on screen
    }
    box.addEventListener("click", (e) => { const b = e.target.closest(".role"); if (b) open(+b.dataset.i, true); });
    box.addEventListener("keydown", (e) => {
      const b = e.target.closest(".role"); if (!b) return;
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]; if (!step) return;
      e.preventDefault();
      const n = (+b.dataset.i + step + buttons.length) % buttons.length;
      open(n, true); buttons[n].focus();
    });
    open(0, false);
  }
  renderRoles(XP);
  html("#education", (C.education || []).map((e) => `
    <li><span><strong>${esc(e.title)}</strong><br><small>${esc(e.org)}</small></span><span class="num">${esc(e.period)}</span></li>`).join(""));

  /* ----- contact ----- */
  const k = C.contact || {};
  const emailBtn = $("#email-btn");
  const copyBtn = $("#copy-email");
  if (k.email) {
    emailBtn.href = `mailto:${k.email}`; emailBtn.textContent = k.email;
    copyBtn?.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(k.email); copyBtn.textContent = "Copied ✓"; }
      catch { copyBtn.textContent = k.email; }
      setTimeout(() => (copyBtn.textContent = "Copy address"), 2200);
    });
  } else { emailBtn.remove(); copyBtn?.remove(); }
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
  $("#footer-reach")?.insertAdjacentHTML("beforeend", links.filter(([h]) => h).map(([href, text]) =>
    `<a href="${esc(href)}" ${href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${esc(text)}</a>`).join(""));
  const fclock = $("#footer-clock");
  const tick = () => { if (fclock) fclock.textContent = new Date().toLocaleTimeString("en-GB", { timeZone: "Africa/Nairobi", hour: "2-digit", minute: "2-digit" }); };
  tick(); setInterval(tick, 30000);

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

  /* ----- tailored version: keep only its sections, in its order ----- */
  if (V) {
    document.body.dataset.version = V.id;
    const main = $("#main"), contactSec = $("#contact");
    const ALL = ["profile", "toolkits", "administration", "media", "photography", "films", "experience"];
    const keep = Array.isArray(V.sections) && V.sections.length ? V.sections : ALL;  // a missing list shows everything, never a blank page
    main.querySelectorAll(":scope > section[id]").forEach((s) => { if (s.id !== "contact" && !keep.includes(s.id)) s.remove(); });
    keep.forEach((id) => { const s = document.getElementById(id); if (s) main.insertBefore(s, contactSec); });
    [...keep, "contact"].forEach((id, i) => { const sp = document.querySelector(`#${id} .eyebrow span`); if (sp) sp.textContent = String(i + 1).padStart(2, "0"); });
    if (!(C.stats || []).length) $(".figures")?.remove();
    const explore = $('.hero__cta a[href="#toolkits"]');
    if (explore && keep[0]) explore.setAttribute("href", `#${keep[0]}`);
    document.querySelectorAll('a[href^="#"]').forEach((a) => { const h = a.getAttribute("href"); if (h.length > 1 && !document.getElementById(h.slice(1))) a.remove(); });
    const note = $("#version-note");
    if (note) { note.innerHTML = `<div class="wrap"><span>This page is tailored for ${esc(V.label)} roles</span><a href="./">See my full portfolio →</a></div>`; note.hidden = false; }
    // a version whose CV hasn't been made yet offers the full CV instead
    if (V.cv && RAW.cv && V.cv !== RAW.cv) fetch(V.cv, { method: "HEAD" }).then((r) => r.ok, () => false).then((ok) => {
      if (!ok) document.querySelectorAll(`a[href="${V.cv}"]`).forEach((a) => a.setAttribute("href", RAW.cv));
    });
  }

  /* ----- motion design ----- */
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // back to top: the old link pointed at the fixed header, so it never moved. Scroll the window instead.
  document.querySelectorAll('a[href="#top"]').forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault(); scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); a.blur();
  }));

  // scroll progress (top bar + ring on the back-to-top button) and frame parallax
  const bar = $("#progress"), ring = $("#to-top-ring"), toTop = $("#to-top");
  const RING = 2 * Math.PI * 21;
  if (ring) ring.style.strokeDasharray = RING;
  const frTrack = $(".frames__track"), frProg = $("#frames-progress");
  const frImgs = [...document.querySelectorAll(".frame__img img")];
  let ticking = false;
  function onFrame() {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    if (bar) bar.style.transform = `scaleX(${p})`;
    if (ring) ring.style.strokeDashoffset = RING * (1 - p);
    toTop?.classList.toggle("is-shown", scrollY > innerHeight * 0.8);
    if (!reduce) frImgs.forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const c = (r.left + r.width / 2) / innerWidth - 0.5;
      img.style.transform = `scale(1.14) translateX(${(-c * 7).toFixed(2)}%)`;
    });
  }
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(onFrame); } };
  addEventListener("scroll", req, { passive: true }); addEventListener("resize", req); onFrame();

  // career frames: drag with the mouse, progress line underneath
  if (frTrack) {
    const upd = () => { const m = frTrack.scrollWidth - frTrack.clientWidth; if (frProg) frProg.style.transform = `scaleX(${m > 0 ? Math.max(0.08, frTrack.scrollLeft / m) : 1})`; req(); };
    frTrack.addEventListener("scroll", upd, { passive: true }); upd();
    let sx = 0, sl = 0, down = false;
    frTrack.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; down = true; window.__framesDragged = false; sx = e.clientX; sl = frTrack.scrollLeft; });
    addEventListener("pointermove", (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 5) { window.__framesDragged = true; frTrack.classList.add("is-dragging"); } frTrack.scrollLeft = sl - dx; });
    addEventListener("pointerup", () => { if (!down) return; down = false; frTrack.classList.remove("is-dragging"); setTimeout(() => (window.__framesDragged = false), 0); });
  }

  // 3D tilt + light on the contact card
  const card = $("#contact-card");
  if (card && !reduce && matchMedia("(pointer: fine)").matches) {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg)`;
      card.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`); card.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
    });
    card.addEventListener("pointerleave", () => (card.style.transform = ""));
  }

  // count-up for the figures ("116%", "10 / 10", "19,017", "10 min")
  function countUp(el) {
    const raw = el.dataset.countup, m = raw.match(/[\d,]+(\.\d+)?/);
    if (!m || reduce) return;
    const target = parseFloat(m[0].replace(/,/g, "")), comma = m[0].includes(",");
    const t0 = performance.now(), dur = 1600;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      const v = Math.round(target * e);
      el.textContent = raw.replace(m[0], comma ? v.toLocaleString("en-US") : String(v));
      if (k < 1) requestAnimationFrame(step); else el.textContent = raw;
    };
    requestAnimationFrame(step);
  }

  // headings rise; most blocks fade up with a short stagger
  if (!reduce) {
    document.querySelectorAll("main h2").forEach((h) => { h.classList.add("rise"); h.parentElement.classList.add("rise-host"); });
    const auto = [".sec-head .eyebrow", ".sec-lede", ".lead", ".prose p", ".about-photo", ".comp", ".flow__step", ".tk", ".control", ".office .admin li", ".av-card", ".media-feature", ".project", ".frames", ".edu li", ".contact__sub", ".contact__card", ".figures__head", ".record__meta div"];
    const sel = auto.join(",");
    document.querySelectorAll(sel).forEach((el) => {
      if (el.classList.contains("reveal")) return;
      el.classList.add("reveal");
      const sibs = [...el.parentElement.children].filter((c) => c.matches(sel));
      el.style.setProperty("--d", `${Math.min(sibs.indexOf(el), 8) * 70}ms`);
    });
  }

  /* ----- reveal on scroll + active nav link ----- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("is-visible"); io.unobserve(en.target);
      en.target.querySelectorAll("[data-countup]").forEach(countUp);
    }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll(".reveal, .rise-host").forEach((el) => io.observe(el));
    const navLinks = [...menu.querySelectorAll('a[href^="#"]')];
    const spy = new IntersectionObserver((es) => es.forEach((en) => {
      if (en.isIntersecting) navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${en.target.id}`));
    }), { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));
  } else {
    document.querySelectorAll(".reveal, .rise").forEach((el) => el.classList.add("is-visible"));
  }
})();
