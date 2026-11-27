// Rebuilds the full CV and every version's CV as PDFs. Needs the local preview server on :5500.
// Run with:  node tools/build-cvs.cjs        (then check with: node tools/check-cvs.cjs)
const { execFileSync } = require("node:child_process");
const path = require("node:path");
const CONTENT = require("../content.js");

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const root = path.join(__dirname, "..");
const jobs = [{ q: "", out: CONTENT.cv }, ...CONTENT.versions.filter((v) => v.cv).map((v) => ({ q: `?for=${v.id}`, out: v.cv }))];
const outs = jobs.map((j) => j.out);
const dup = outs.find((o, i) => outs.indexOf(o) !== i);
if (dup) { console.error(`Two versions would write the same CV file (${dup}). Fix the cv: lines in content.js first.`); process.exit(1); }
for (const { q, out } of jobs) {
  execFileSync(EDGE, ["--headless=new", "--disable-gpu", "--no-pdf-header-footer", `--print-to-pdf=${path.join(root, out)}`, `http://localhost:5500/cv.html${q}`], { stdio: "ignore" });
  console.log("built", out);
}
