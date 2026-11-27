// Checks the CV page and PDFs for every version. Needs the local preview server on :5500.
// Run with:  node tools/check-cvs.cjs
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const CONTENT = require("../content.js");
const { filterContent } = require("../versions.js");

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const root = path.join(__dirname, "..");
const dom = (q) => execFileSync(EDGE, ["--headless=new", "--disable-gpu", "--virtual-time-budget=3000", "--dump-dom", `http://localhost:5500/cv.html${q}`], { encoding: "utf8" });
const roleIn = (html, role) => html.includes(`<h3>${role.replace(/&/g, "&amp;")}</h3>`);
const problems = [];

const targets = [{ id: null, cv: CONTENT.cv }, ...CONTENT.versions];
for (const v of targets) {
  const name = v.id || "full";
  const html = dom(v.id ? `?for=${v.id}` : "");
  if (html.includes("Case studies &amp; work samples")) problems.push(`${name}: old footer line still there`);
  if (/referee/i.test(html)) problems.push(`${name}: referee wording on a public CV`);
  const shown = filterContent(CONTENT, v.id ? v : null).experience.map((x) => x.role);
  for (const x of CONTENT.experience) {
    const want = shown.includes(x.role);
    if (roleIn(html, x.role) !== want) problems.push(`${name}: role "${x.role}" should be ${want ? "shown" : "hidden"}`);
  }
  if (v.id && !html.includes(`>${v.heroTitle.replace(/&/g, "&amp;")}<`)) problems.push(`${name}: headline "${v.heroTitle}" missing`);
  const pdf = path.join(root, v.cv || "");
  if (!v.cv || !fs.existsSync(pdf)) { problems.push(`${name}: PDF missing (${v.cv})`); continue; }
  const buf = fs.readFileSync(pdf);
  if (buf.length < 20 * 1024) problems.push(`${name}: PDF suspiciously small`);
  const pages = (buf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
  if (pages < 1 || pages > 2) problems.push(`${name}: PDF has ${pages} pages (want 1–2)`);
}
console.log(problems.length ? problems.join("\n") : "all CV checks passed");
process.exit(problems.length ? 1 : 0);
