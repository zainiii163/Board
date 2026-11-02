import { writeFileSync } from "node:fs";

const classes = [
  ["9", "https://fbisepastpapers.com/class-9-fbise-past-papers/"],
  ["10", "https://fbisepastpapers.com/class-10-fbise-past-papers/"],
  ["11", "https://fbisepastpapers.com/class-11-fbise-past-papers/"],
  ["12", "https://fbisepastpapers.com/class-12-fbise-past-papers/"],
];

const SUBJECT_ALIASES = [
  ["computer-science", "Computer Science"],
  ["computer", "Computer Science"],
  ["pakistan-studies", "Pakistan Studies"],
  ["pak-studies", "Pakistan Studies"],
  ["tarjuma-tul-quran", "Tarjuma-tul-Quran"],
  ["tarjuma-quran", "Tarjuma-tul-Quran"],
  ["tarjuma", "Tarjuma-tul-Quran"],
  ["islamic-education", "Islamiat"],
  ["islamiat", "Islamiat"],
  ["islamiyat", "Islamiat"],
  ["biology", "Biology"],
  ["chemistry", "Chemistry"],
  ["physics", "Physics"],
  ["mathematics", "Mathematics"],
  ["english", "English"],
  ["urdu", "Urdu"],
];

function parsePaperUrl(classSlug, url) {
  const path = url.replace(/^https?:\/\/fbisepastpapers\.com\//i, "").replace(/\/$/, "");
  if (!path || /fbise-past-papers$/i.test(path) || /notes$/i.test(path) || /model-papers$/i.test(path)) {
    return null;
  }
  if (!/past-paper|paper-20|model/i.test(path)) return null;

  let subjectTitle = null;
  let rest = path;
  for (const [alias, title] of SUBJECT_ALIASES) {
    const re = new RegExp(`^class-${classSlug}-${alias}-(.+)$`, "i");
    const m = path.match(re);
    if (m) {
      subjectTitle = title;
      rest = m[1];
      break;
    }
  }
  if (!subjectTitle) return null;

  const yearMatch = rest.match(/(20\d{2})/);
  if (!yearMatch) return null;
  const year = yearMatch[1];

  let paperType = "first-annual";
  if (/2nd-annual|second-annual/i.test(rest)) paperType = "second-annual";
  else if (/model/i.test(rest)) paperType = "model";
  else if (/paper-pattern|pattern/i.test(rest)) paperType = "paper-pattern";
  else if (/\bpba\b/i.test(rest)) paperType = "pba";

  const syllabus = /old-syllabus/i.test(rest) ? "old" : "new";

  return {
    classSlug,
    subjectTitle,
    year,
    paperType,
    syllabus,
    driveUrl: url.endsWith("/") ? url : `${url}/`,
  };
}

const all = [];
for (const [classSlug, pageUrl] of classes) {
  try {
    const res = await fetch(pageUrl);
    const html = await res.text();
    const hrefs = [...html.matchAll(/href=["'](https?:\/\/fbisepastpapers\.com\/[^"']+)["']/g)].map((m) => m[1]);
    const unique = [...new Set(hrefs)];
    let parsed = 0;
    for (const href of unique) {
      const row = parsePaperUrl(classSlug, href);
      if (row) {
        all.push(row);
        parsed += 1;
      }
    }
    console.log(`class ${classSlug}: hrefs=${unique.length} parsed=${parsed}`);
  } catch (error) {
    console.log(`class ${classSlug}: ERR ${error.message}`);
  }
}

// Deduplicate by catalog key — prefer longer/more specific URLs.
const byKey = new Map();
for (const row of all) {
  const key = [row.classSlug, row.subjectTitle, row.year, row.paperType, row.syllabus].join("|");
  const prev = byKey.get(key);
  if (!prev || row.driveUrl.length >= prev.driveUrl.length) byKey.set(key, row);
}

const rows = [...byKey.values()].sort((a, b) =>
  `${a.classSlug}${a.subjectTitle}${a.year}${a.paperType}`.localeCompare(
    `${b.classSlug}${b.subjectTitle}${b.year}${b.paperType}`,
  ),
);

writeFileSync("backend/src/db/fbise-paper-deep-links.json", JSON.stringify(rows, null, 2));
console.log(`wrote ${rows.length} deep links`);
