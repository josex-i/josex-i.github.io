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
