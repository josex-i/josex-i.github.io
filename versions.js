/* Picks a tailored version from the link (?for=stage) and filters the content for it.
   You don't need to edit this file: versions are defined in content.js. */
(function (root) {
  const FILTERED_KEYS = ["experience", "expertise", "stats", "careerFrames", "avPhotos"];
  const WORDS = ["heroTitle", "heroCreds", "intro", "about", "cv"];

  function pickVersion(content, search) {
    const list = (content && content.versions) || [];
    const raw = new URLSearchParams(search || "").get("for") || "";
    const id = raw.toLowerCase().replace(/[^a-z0-9-]/g, "");
    return (id && list.find((v) => v.id === id)) || null;
  }

  function filterContent(content, version) {
    const out = structuredClone(content);
    if (!version) return out;
    FILTERED_KEYS.forEach((k) => {
      if (Array.isArray(out[k])) out[k] = out[k].filter((item) => !item.for || item.for.includes(version.id));
    });
    WORDS.forEach((k) => { if (version[k] != null) out[k] = structuredClone(version[k]); });
    return out;
  }

  const api = { pickVersion, filterContent, FILTERED_KEYS };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Versions = api;
})(typeof window !== "undefined" ? window : globalThis);
