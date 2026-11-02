const urls = [
  "https://board-3nll.vercel.app/",
  "https://board-3nll.vercel.app/past-papers",
  "https://board-3nll.vercel.app/books",
  "https://board-3nll.vercel.app/fbise/9",
  "https://board-3nll.vercel.app/punjab/10",
];

for (const u of urls) {
  const r = await fetch(u, { redirect: "follow" });
  const t = await r.text();
  console.log(
    JSON.stringify({
      url: u,
      status: r.status,
      browseFederal: /Browse Federal/i.test(t),
      downloadFederal: /Download Federal/i.test(t),
      boardNotes: /BoardNotes/i.test(t),
      oxfordPath: /href=["']\/oxford["']/i.test(t),
      apsacsPath: /href=["']\/apsacs["']/i.test(t),
      sindhBoardNav: /Sindh Board/i.test(t) && u.includes("/books"),
    }),
  );
}

const api = await fetch("https://board-gccf.vercel.app/api/past-papers?board=fbise&limit=200");
const papers = await api.json();
const arr = Array.isArray(papers) ? papers : papers.data || [];
const c9 = arr.filter((p) => p.classSlug === "9");
const c10 = arr.filter((p) => p.classSlug === "10");
const c11 = arr.filter((p) => p.classSlug === "11");
const c12 = arr.filter((p) => p.classSlug === "12");
console.log(
  JSON.stringify({
    pastPapersApi: api.status,
    total: arr.length,
    c9Subjects: [...new Set(c9.map((p) => p.subjectTitle))].sort(),
    c10Subjects: [...new Set(c10.map((p) => p.subjectTitle))].sort(),
    c11Subjects: [...new Set(c11.map((p) => p.subjectTitle))].sort(),
    c12Subjects: [...new Set(c12.map((p) => p.subjectTitle))].sort(),
    c9Pak: c9.filter((p) => /pakistan/i.test(p.subjectTitle || "")).length,
    c10Islam: c10.filter((p) => /islam/i.test(p.subjectTitle || "")).length,
    c11: c11.length,
    c12: c12.length,
    withPdf: arr.filter((p) => p.pdfUrl).length,
    old: arr.filter((p) => p.syllabus === "old").length,
    deepLinked: arr.filter(
      (p) =>
        p.driveUrl &&
        /fbisepastpapers\.com\/class-\d+-/.test(p.driveUrl) &&
        !/class-\d+-fbise-past-papers\/?$/.test(p.driveUrl),
    ).length,
  }),
);

const books = await fetch("https://board-gccf.vercel.app/api/resources?limit=200&scope=books-notes");
const bj = await books.json();
const boards = [...new Set((bj.resources || []).map((r) => r.board))];
const bad = (bj.resources || []).filter((r) =>
  /oxford|sindh|cambridge|aqa|past\s*paper/i.test(`${r.board || ""} ${r.title || ""}`),
);
console.log(
  JSON.stringify({
    booksNotesApi: books.status,
    total: bj.total,
    boards,
    bad: bad.length,
  }),
);
