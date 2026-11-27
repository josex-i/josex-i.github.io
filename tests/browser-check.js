// Browser check for tailored versions. Paste into the console (or run via the preview tool)
// on any page of the site; it returns { ok, problems }.
async function checkVersionPage() {
  const C = window.CONTENT || CONTENT, problems = [];
  const id = (new URLSearchParams(location.search).get("for") || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
  const v = (C.versions || []).find((x) => x.id === id) || null;
  const ALL = ["profile", "toolkits", "administration", "media", "photography", "films", "experience"];
  const shown = [...document.querySelectorAll("main > section[id]")].map((s) => s.id).filter((s) => ALL.includes(s));
  const want = v ? v.sections : ALL;
  if (JSON.stringify(shown) !== JSON.stringify(want)) problems.push(`sections ${shown} != ${want}`);
  const nums = shown.map((s) => document.querySelector(`#${s} .eyebrow span`)?.textContent.trim());
  const expectNums = v ? shown.map((_, i) => String(i + 1).padStart(2, "0")) : null;
  if (expectNums && JSON.stringify(nums) !== JSON.stringify(expectNums)) problems.push(`eyebrow numbers ${nums}`);
  for (const a of document.querySelectorAll('a[href^="#"]')) {
    const h = a.getAttribute("href");
    if (h.length > 1 && !document.getElementById(h.slice(1))) problems.push(`dead link ${h} (${a.textContent.trim()})`);
  }
  for (const a of document.querySelectorAll('a[href*="?for="], a[href*="cv"]')) if (a.offsetParent === null && a.closest("main, footer, aside")) continue;
  const note = document.getElementById("version-note");
  if (v) {
    if (!note || note.hidden) problems.push("version note missing");
    else if (!note.textContent.includes(`This page is tailored for ${v.label} roles`)) problems.push("version note text");
    if (document.body.dataset.version !== v.id) problems.push("body data-version not set");
    await new Promise((r) => setTimeout(r, 800));
    const cv = document.getElementById("cv-link")?.getAttribute("href");
    const exists = v.cv ? (await fetch(v.cv, { method: "HEAD" })).ok : false;
    const wantCv = exists ? v.cv : C.cv;
    if (cv !== wantCv) problems.push(`cv link ${cv} != ${wantCv}`);
    if (document.querySelector(".hero__title")?.textContent !== v.heroTitle) problems.push("hero title");
  } else if (note && !note.hidden) problems.push("version note shown on full site");
  if (document.documentElement.scrollWidth > innerWidth + 1) problems.push("horizontal scroll");
  return { version: v ? v.id : "full", ok: problems.length === 0, problems };
}

// Statue panel: full site shows it with 5 hotspots + 5 buttons; versions hide it.
async function checkStatue() {
  const problems = [], v = document.body.dataset.version;
  const fig = document.getElementById("statue");
  if (v) { if (fig) problems.push("statue shown in a version"); return { ok: !problems.length, problems }; }
  if (!fig) return { ok: false, problems: ["statue missing"] };
  const img = fig.querySelector("img");
  img.loading = "eager";
  await Promise.race([new Promise((r) => (img.complete ? r() : (img.onload = r))), new Promise((r) => setTimeout(r, 4000))]);
  if (!(img.naturalWidth > 0)) problems.push("image not loaded");
  const want = ["?for=guest", "?for=admin", "?for=finance", "?for=stage", "#photography"];
  const hot = [...fig.querySelectorAll(".statue__hot")].map((a) => a.getAttribute("href"));
  const btn = [...fig.querySelectorAll(".statue__words a")].map((a) => a.getAttribute("href"));
  if (JSON.stringify(hot) !== JSON.stringify(want)) problems.push(`hotspots ${hot}`);
  if (JSON.stringify(btn) !== JSON.stringify(want)) problems.push(`buttons ${btn}`);
  const cap = "AI-generated artwork of my five fields: service, administration, finance, media and faith.";
  if (fig.querySelector("figcaption .statue__cap")?.textContent.trim() !== cap) problems.push("caption");
  return { ok: !problems.length, problems };
}
