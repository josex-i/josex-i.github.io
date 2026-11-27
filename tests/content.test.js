// Checks content.js so a typo in a version or a `for` tag is caught before publishing.
// Run with:  node --test tests/
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const CONTENT = require("../content.js");
const { filterContent, FILTERED_KEYS } = require("../versions.js");

const root = path.join(__dirname, "..");
const SECTIONS = ["profile", "toolkits", "administration", "media", "photography", "films", "experience"];
const versions = CONTENT.versions || [];
const ids = versions.map((v) => v.id);

test("the five starting versions exist with clean, unique ids", () => {
  for (const id of ["finance", "admin", "guest", "it", "stage"]) assert.ok(ids.includes(id), `missing version "${id}"`);
  assert.equal(new Set(ids).size, ids.length, "two versions share an id");
  for (const id of ids) assert.match(id, /^[a-z0-9-]+$/, `id "${id}" may only use a-z, 0-9 and -`);
});

test("each version lists only real sections", () => {
  for (const v of versions) for (const s of v.sections || [])
    assert.ok(SECTIONS.includes(s), `version "${v.id}" lists unknown section "${s}". Use one of: ${SECTIONS.join(", ")}`);
});

test("every `for` tag names an existing version", () => {
  for (const key of FILTERED_KEYS) (CONTENT[key] || []).forEach((item, i) => {
    for (const t of item.for || [])
      assert.ok(ids.includes(t), `${key}[${i}] "${item.role || item.title || item.caption || item.label}" has unknown tag "${t}"`);
  });
});

test("no version ends up without roles or skills", () => {
  for (const v of versions) {
    const out = filterContent(CONTENT, v);
    assert.ok(out.experience.length >= 1, `version "${v.id}" shows no experience`);
    assert.ok(out.expertise.length >= 1, `version "${v.id}" shows no skills`);
  }
});

test("each version's CV file exists (or the full CV is offered)", () => {
  for (const v of versions) {
    if (v.cv && fs.existsSync(path.join(root, v.cv))) continue;
    console.warn(`version "${v.id}" has no CV yet, the full CV will be offered`);
  }
});
