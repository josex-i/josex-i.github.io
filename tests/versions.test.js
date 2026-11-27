// Run with:  node --test tests/
const test = require("node:test");
const assert = require("node:assert/strict");
const { pickVersion, filterContent, FILTERED_KEYS } = require("../versions.js");

const fixture = () => ({
  heroTitle: "Full title", heroCreds: "Full creds", intro: "Full intro", about: ["full about"], cv: "full.pdf",
  versions: [
    { id: "a", label: "A", heroTitle: "A title", heroCreds: "A creds", intro: "A intro", about: ["a about"], sections: ["experience"], cv: "a.pdf" },
    { id: "b", label: "B", heroTitle: "B title", heroCreds: "B creds", intro: "B intro", sections: ["films"] },
  ],
  experience: [
    { role: "only a", for: ["a"] },
    { role: "only b", for: ["b"] },
    { role: "both", for: ["a", "b"] },
    { role: "untagged" },
  ],
  expertise: [{ title: "ea", for: ["a"] }, { title: "eb", for: ["b"] }],
  stats: [{ value: "1", for: ["b"] }],
  careerFrames: [{ caption: "f" }],
  // avPhotos deliberately missing
});

test("pickVersion finds the version named in ?for=", () => {
  assert.equal(pickVersion(fixture(), "?for=a").id, "a");
});

test("pickVersion ignores case, extra params and a trailing slash", () => {
  assert.equal(pickVersion(fixture(), "?for=A").id, "a");
  assert.equal(pickVersion(fixture(), "?fbclid=x&for=a/").id, "a");
});

test("pickVersion returns null for no, unknown or impossible versions", () => {
  assert.equal(pickVersion(fixture(), ""), null);
  assert.equal(pickVersion(fixture(), "?for=zzz"), null);
  assert.equal(pickVersion({}, "?for=a"), null);
});

test("filterContent keeps tagged-for-this and untagged items, in order", () => {
  const C = fixture();
  const out = filterContent(C, C.versions[0]);
  assert.deepEqual(out.experience.map((x) => x.role), ["only a", "both", "untagged"]);
  assert.deepEqual(out.expertise.map((x) => x.title), ["ea"]);
  assert.deepEqual(out.stats, []);
  assert.deepEqual(out.careerFrames.map((x) => x.caption), ["f"]);
  assert.equal("avPhotos" in out, false);
  assert.deepEqual(FILTERED_KEYS, ["experience", "expertise", "stats", "careerFrames", "avPhotos"]);
});

test("filterContent applies the version's words, keeping about/cv when it has none", () => {
  const C = fixture();
  const a = filterContent(C, C.versions[0]);
  assert.equal(a.heroTitle, "A title"); assert.equal(a.heroCreds, "A creds"); assert.equal(a.intro, "A intro");
  assert.deepEqual(a.about, ["a about"]); assert.equal(a.cv, "a.pdf");
  const b = filterContent(C, C.versions[1]);
  assert.deepEqual(b.about, ["full about"]); assert.equal(b.cv, "full.pdf");
});

test("filterContent(null) is an unchanged copy and never mutates the input", () => {
  const C = fixture();
  const before = structuredClone(C);
  assert.deepEqual(filterContent(C, null), C);
  filterContent(C, C.versions[0]); filterContent(C, C.versions[1]);
  assert.deepEqual(C, before);
});

test("filterContent works on older browsers without structuredClone", () => {
  const saved = globalThis.structuredClone;
  try {
    globalThis.structuredClone = undefined;
    const C = fixture();
    assert.deepEqual(filterContent(C, null), C);
    assert.deepEqual(filterContent(C, C.versions[0]).experience.map((x) => x.role), ["only a", "both", "untagged"]);
  } finally { globalThis.structuredClone = saved; }
});

test("a version's availability line replaces the default", () => {
  const C = { ...fixture(), availability: "Open to anything" };
  C.versions[0].availability = "Open to A roles";
  assert.equal(filterContent(C, C.versions[0]).availability, "Open to A roles");
  assert.equal(filterContent(C, C.versions[1]).availability, "Open to anything");
});
