import { getApiBaseUrl } from "@/lib/api-client";
import { subjectKey } from "@/lib/constants";

// Real book cover mapping: board slug + class + subject → static cover file.
// Mirrors backend BOOK_COVERS (keyed by board slug to match frontend routes).
const BOOK_COVERS: Record<string, Record<number, Record<string, string>>> = {
  fbise: {
    5: {
      Mathematics: "/book-covers/fbise-5-5-mathematics.webp",
      English: "/book-covers/fbise-5-5-english.jpg",
      Urdu: "/book-covers/fbise-5-5-urdu.webp",
      "General Science": "/book-covers/fbise-5-5-general-science.webp",
      "Pakistan Studies": "/book-covers/fbise-5-5th-Class-Social-Studies.jpg",
      Islamiat: "/book-covers/fbise-5-Class-5-Islamiat-Federal-Board.webp",
    },
    6: {
      Mathematics: "/book-covers/fbise-6-MATH-6-NBF.webp",
      "Computer Science": "/book-covers/fbise-6-Class-6-Computer-Science-Book.webp",
      Arabic: "/book-covers/fbise-6-Arabic-Book--6th-class.jpg",
    },
    7: {
      English: "/book-covers/fbise-7-ENGLISH-7-NBF.webp",
      "Computer Science": "/book-covers/fbise-7-Computer-Science-7.jpg",
      Urdu: "/book-covers/fbise-7-URDU-7-NBF.webp",
      Islamiat: "/book-covers/fbise-7-Class-7-Islamiat-Federal-Board.jpg",
      "General Science": "/book-covers/fbise-7-Class-7-General-Science-Federal-Board.jpg",
      Geography: "/book-covers/fbise-7-GEOGRAPHY-7-NBF.webp",
      History: "/book-covers/fbise-7-Class-7-History-Federal-Board.jpg",
    },
    8: {
      Mathematics: "/book-covers/fbise-8-Math-8-NBF.webp",
      English: "/book-covers/fbise-8-English-8-NBF-FG-Saleemi-Book-Depot-in-39471868674351.webp",
      "Computer Science": "/book-covers/fbise-8-Computer-8-NBF.webp",
      Urdu: "/book-covers/fbise-8-Urdu-8-NBF.jpg",
      Islamiat: "/book-covers/fbise-8-ISLAMIYAT-Class-8.webp",
      "General Science": "/book-covers/fbise-8-General-Science-8.jpg",
      Geography: "/book-covers/fbise-8-Geography-8-NBF.webp",
      History: "/book-covers/fbise-8-nbf-history-8.jpg",
    },
    9: {
      Mathematics: "/book-covers/fbise-9-9th-Class-Mathematics-NBF.jpg",
      Physics: "/book-covers/fbise-9-Class-9-Physics-NBF.jpg",
      Chemistry: "/book-covers/fbise-9-Chemistry-9-With-Experimentation-Skills-NBF.webp",
      Biology: "/book-covers/fbise-9-9th-Class-Biology-NBF.jpg",
      English: "/book-covers/fbise-9-English-9-NBF.webp",
      Urdu: "/book-covers/fbise-9-NBF-URDU-9.webp",
      "Pakistan Studies": "/book-covers/fbise-9-Class-9-Pakistan-Studies--Urdu-.jpg",
      Islamiat: "/book-covers/fbise-9-Islamiat-Lazmi-Class-9-NBF.webp",
    },
    10: {
      Mathematics: "/book-covers/fbise-10---------------------.jpg",
      Physics: "/book-covers/fbise-10-10th-Class-Physics--NBF.jpg",
      Chemistry: "/book-covers/fbise-10-Chemistry-10-NBF.webp",
      Biology: "/book-covers/fbise-10-Biology-10-NBF.webp",
      English: "/book-covers/fbise-10-class-10-english-book-pdf-federal-board.webp",
      "Computer Science": "/book-covers/fbise-10-NBF-COMPUTER-SCIENCE-10.jpg",
      Urdu: "/book-covers/fbise-10-NBF-URDU-10.webp",
      "Pakistan Studies": "/book-covers/fbise-10-Pakistan-Studies-Grade-10-NBF.webp",
      Islamiat: "/book-covers/fbise-10-Islamiat-10-NBF.webp",
    },
    11: {
      Mathematics: "/book-covers/fbise-11-Math-11-NBF.webp",
      Physics: "/book-covers/fbise-11-Physics-Class-11-NBF.webp",
      Chemistry: "/book-covers/fbise-11-Textbook-of-Chemistry-Grade-11-Federal-board.webp",
      Biology: "/book-covers/fbise-11-Biology-11-NATIONAL-BOOK-FOUNDATION--Federal-Board.webp",
      English: "/book-covers/fbise-11-English-11-NBF-FG.webp",
      "Computer Science": "/book-covers/fbise-11-Computer-Science-11-NBF.webp",
      Urdu: "/book-covers/fbise-11-NBF-URDU-11.webp",
      Islamiat: "/book-covers/fbise-11-Islamiat-11-NBF.webp",
    },
    12: {
      Mathematics: "/book-covers/fbise-12-Mathematics-Book-For-Class-12.webp",
      Physics: "/book-covers/fbise-12-Physics-National-Book-Foundation-12--Federal-board.webp",
      Chemistry: "/book-covers/fbise-12-TextBook-Chemistry-Grade-12th-Federal-board.webp",
      Biology: "/book-covers/fbise-12-Biology-Grade-12-Edition-2025.webp",
      English: "/book-covers/fbise-12-English-For-Grade-12-NBF-FG-Saleemi-Book-Depot-in-42354394857775.webp",
      "Computer Science": "/book-covers/fbise-12-Computer-Science-For-Grade-12-NBF-FG-Saleemi-Book-Depot-in-42627272999215.webp",
      Urdu: "/book-covers/fbise-12-NBF-URDU-12.webp",
      "Pakistan Studies": "/book-covers/fbise-12-NBF-Pak-Studies-12.png",
    },
  },
  punjab: {
    9: {
      Mathematics: "/book-covers/punjab-9-Class-9-Mathematics.webp",
      Physics: "/book-covers/punjab-9-PTB-Physics-Class-9th-2025.webp",
      Chemistry: "/book-covers/punjab-9-PTB-Chemistry-Class-9th-2025.webp",
      Biology: "/book-covers/punjab-9-Class-9-Biology-PCTB.webp",
      English: "/book-covers/punjab-9-PCTB-English-9th-Class-2025-800x.webp",
      "Computer Science": "/book-covers/punjab-9-PTB-Computer-Science-Entrepreneurship-Class-9th-2025.webp",
      Urdu: "/book-covers/punjab-9-PCTB-Urdu-9th-Class-2025.webp",
      Islamiat: "/book-covers/punjab-9-Class-9-Islamiat.webp",
      "General Science": "/book-covers/punjab-9-Class-9-General-Science.webp",
    },
    10: {
      Biology: "/book-covers/punjab-10-10-biology.jpg",
      Chemistry: "/book-covers/punjab-10-10th-Class-Chemistry.jpg",
    },
  },
  oxford: {
    9: { Mathematics: "/book-covers/oxford-think--New-Syllabus-Mathematics-1-8th-edition.webp" },
    10: { Mathematics: "/book-covers/oxford-think--New-Syllabus-Mathematics-2-8th-edition.webp" },
    11: { Mathematics: "/book-covers/oxford-think--New-Syllabus-Mathematics-3-8th-edition.webp" },
    12: { Mathematics: "/book-covers/oxford-think--New-Syllabus-Mathematics-4-8th-edition.webp" },
  },
  apsacs: {
    8: { Islamiat: "/book-covers/apsacs-APSACS--Islamiat-Textbook-Class-8.webp" },
  },
};

/**
 * Subject title variants that must resolve to the same canonical key. Boards and
 * seeds spell some subjects differently ("Islamiyat" vs "Islamiat", "Computer"
 * vs "Computer Science"), which previously left those cards without a cover or
 * pointed them at another subject's artwork.
 */
const SUBJECT_ALIASES: Record<string, string> = {
  math: "mathematics",
  maths: "mathematics",
  "general maths": "mathematics",
  computer: "computer science",
  computers: "computer science",
  computing: "computer science",
  "computer studies": "computer science",
  islamiyat: "islamiat",
  "islamic studies": "islamiat",
  "pak studies": "pakistan studies",
  "pak. studies": "pakistan studies",
  tarjama: "tarjuma tul quran",
  "tarjama tul quran": "tarjuma tul quran",
};

/**
 * Pre-computed `key -> path` index per board/class so lookups are a single map hit
 * and every spelling of a subject title resolves to the same artwork.
 */
const BOOK_COVERS_INDEX: Record<string, Record<number, Record<string, string>>> = {};
for (const [board, classes] of Object.entries(BOOK_COVERS)) {
  for (const [classNum, subjects] of Object.entries(classes)) {
    const byClass = (BOOK_COVERS_INDEX[board] ??= {});
    const bySubject = (byClass[Number(classNum)] ??= {});
    for (const [title, path] of Object.entries(subjects)) bySubject[subjectKey(title)] = path;
  }
}

/**
 * Lahore Board and D.G. Khan Board are Punjab Board authorities and use the same
 * textbooks, so they fall back to the Punjab artwork instead of showing blank
 * generated placeholders.
 */
const COVER_BOARD_ALIASES: Record<string, string> = {
  lahore: "punjab",
  "d-g-khan": "punjab",
};

/** Canonical lookup key for a subject title (lowercase, alias-resolved). */
function coverKey(title: string): string {
  const key = subjectKey(title);
  return SUBJECT_ALIASES[key] ?? key;
}

// Generate SVG placeholder for missing book covers
function generatePlaceholder(subjectTitle: string, classNum: number): string {
  const initials = subjectTitle
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const colors = [
    "#0f766e", // teal-700
    "#059669", // emerald-600
    "#0891b2", // cyan-600
    "#7c3aed", // violet-600
    "#db2777", // pink-600
    "#ea580c", // orange-600
  ];
  const colorIndex = classNum % colors.length;
  const bgColor = colors[colorIndex];

  const svg = `
    <svg width="200" height="260" viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="260" fill="${bgColor}"/>
      <rect x="10" y="10" width="180" height="240" fill="none" stroke="white" stroke-width="2" rx="4"/>
      <text x="100" y="110" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">${initials}</text>
      <text x="100" y="150" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">Class ${classNum}</text>
      <text x="100" y="170" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle">${subjectTitle.substring(0, 20)}${subjectTitle.length > 20 ? "..." : ""}</text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Full absolute URL to a real book cover, or an SVG placeholder when the board has
 * no artwork for that subject yet.
 */
export function getBookCover(boardSlug: string, classNum: number, subjectTitle: string): string {
  const alias = COVER_BOARD_ALIASES[boardSlug];
  const path =
    BOOK_COVERS_INDEX[boardSlug]?.[classNum]?.[coverKey(subjectTitle)] ??
    (alias ? BOOK_COVERS_INDEX[alias]?.[classNum]?.[coverKey(subjectTitle)] : undefined);
  if (path) return `${getApiBaseUrl()}${path}`;
  return generatePlaceholder(subjectTitle, classNum);
}
