// Generates minimal but valid sample PDFs for the portal demo catalog.
// Run: node scripts/generate-demo-pdfs.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "demo-pdfs");

const FILES = [
  {
    file: "9th-physics-notes.pdf",
    title: "9th Class Physics Notes - Chapter 1",
    body: [
      "Physics notes for 9th class students. This sample PDF demonstrates the",
      "portal reader and download functionality. It contains key concepts,",
      "definitions, solved numericals and short questions aligned with the",
      "board syllabus. This is a placeholder document used for the demo.",
      "",
      "Key Topics:",
      "- Physical Quantities and Measurement",
      "- Scalars and Vectors",
      "- Accuracy and Precision",
      "- SI Units and Prefixes",
    ],
  },
  {
    file: "9th-chemistry-notes.pdf",
    title: "9th Class Chemistry Notes - Chapter 1",
    body: [
      "Chemistry notes for 9th class covering fundamentals of chemistry.",
      "Includes states of matter, elements, compounds and mixtures with",
      "definitions, reactions and solved short questions. Sample demo PDF.",
    ],
  },
  {
    file: "9th-maths-notes.pdf",
    title: "9th Class Mathematics Notes - Chapter 1",
    body: [
      "Mathematics notes for 9th class. Real numbers, sets and operations",
      "with step-by-step solved examples. This is a sample PDF generated for",
      "the portal prototype to demonstrate reading and downloading resources.",
    ],
  },
  {
    file: "9th-biology-notes.pdf",
    title: "9th Class Biology Notes - Chapter 1",
    body: [
      "Biology notes for 9th class covering introduction to biology, branches",
      "of biology, and levels of biological organization. Sample demo PDF with",
      "diagram descriptions and important board questions.",
    ],
  },
  {
    file: "9th-english-notes.pdf",
    title: "9th Class English Notes",
    body: [
      "English notes for 9th class - grammar, comprehension and textbook",
      "exercises. Includes solved questions and essays for board preparation.",
      "Sample PDF used for the demo portal.",
    ],
  },
  {
    file: "9th-urdu-notes.pdf",
    title: "9ty Class Urdu Notes | 9ویں جماعت اردو نوٹس",
    body: [
      "امتحان کے مطابق اردو نوٹس جن میں تمام ابواب کے خلاصے اور حل شدہ",
      "سوالات شامل ہیں۔ یہ ایک نمونہ پی ڈی ایف ہے جو پورٹل کی آزمائش کے",
      "لیے بنائی گئی ہے۔",
    ],
  },
  {
    file: "10th-physics-notes.pdf",
    title: "10th Class Physics Notes - Chapter 1",
    body: [
      "Physics notes for 10th class - Simple Harmonic Motion, waves and",
      "sound. Solved numericals and exam-focused short questions. Sample PDF",
      "for the demo portal.",
    ],
  },
  {
    file: "10th-chemistry-notes.pdf",
    title: "10th Class Chemistry Notes - Chapter 1",
    body: [
      "Chemistry notes for 10th class - chemical equilibrium, acids bases and",
      "salts. Solved long and short questions with definitions. Sample demo.",
    ],
  },
  {
    file: "10th-maths-notes.pdf",
    title: "10th Class Mathematics Notes - Chapter 1",
    body: [
      "Mathematics notes for 10th class - quadratic equations, matrices and",
      "determinants with worked examples. Sample PDF for the portal demo.",
    ],
  },
  {
    file: "10th-biology-notes.pdf",
    title: "10th Class Biology Notes - Chapter 1",
    body: [
      "Biology notes for 10th class - gaseous exchange, homeostasis and",
      "coordination. Includes diagrams and board questions. Sample demo PDF.",
    ],
  },
  {
    file: "10th-english-notes.pdf",
    title: "10th Class English Notes",
    body: [
      "English notes for 10th class - prose, poetry, and grammar practice",
      "with solved exercises for board exams. Sample demo resource.",
    ],
  },
  {
    file: "11th-physics-notes.pdf",
    title: "11th Class Physics Notes",
    body: [
      "Physics notes for 1st year - measurements, vectors and equilibrium.",
      "Detailed derivations and numerical problems. Sample demo PDF.",
    ],
  },
  {
    file: "11th-chemistry-notes.pdf",
    title: "11th Class Chemistry Notes",
    body: [
      "Chemistry notes for 1st year - basic concepts, stoichiometry, and",
      "atomic structure with solved examples. Sample demo resource.",
    ],
  },
  {
    file: "11th-maths-notes.pdf",
    title: "11th Class Mathematics Notes",
    body: [
      "Mathematics notes for FSC part 1 - number systems, sets and functions",
      "with solved exercise questions. Sample demo PDF.",
    ],
  },
  {
    file: "12th-physics-notes.pdf",
    title: "12th Class Physics Notes",
    body: [
      "Physics notes for 2nd year - electrostatics, current electricity and",
      "electromagnetism with derivations. Sample demo PDF.",
    ],
  },
  {
    file: "textbook-math-9.pdf",
    title: "Textbook Mathematics Class 9",
    body: [
      "Official style mathematics textbook for class 9. Full chapter content",
      "with examples and exercise sets. This is a sample PDF used to demo",
      "the textbook category in the portal.",
    ],
  },
  {
    file: "textbook-physics-9.pdf",
    title: "Textbook Physics Class 9",
    body: [
      "Class 9 physics textbook sample. Chapters with explanations, figures",
      "and numerical problems. Sample PDF for the textbook category.",
    ],
  },
  {
    file: "textbook-chemistry-9.pdf",
    title: "Textbook Chemistry Class 9",
    body: [
      "Class 9 chemistry textbook sample covering fundamentals of chemistry",
      "with exercises and activities. Sample demo PDF.",
    ],
  },
  {
    file: "past-paper-math-9-2025.pdf",
    title: "9th Class Mathematics Past Paper 2025 (Annual)",
    body: [
      "Annual examination 2025 mathematics paper for 9th class. Contains",
      "objective and subjective sections with mark allocation. Sample PDF.",
    ],
  },
  {
    file: "past-paper-english-10-2024.pdf",
    title: "10th Class English Past Paper 2024 (Annual)",
    body: [
      "Annual examination 2024 English paper for 10th class. Includes",
      "comprehension, grammar and essay sections. Sample demo PDF.",
    ],
  },
  {
    file: "past-paper-biology-9-2026.pdf",
    title: "9th Class Biology Past Paper 2026 (Supply)",
    body: [
      "Supply examination 2026 biology paper for 9th class with both",
      "sections and solved marking scheme. Sample demo resource.",
    ],
  },
  {
    file: "guess-paper-9-science.pdf",
    title: "9th Class Guess Paper 2026 - Science Group",
    body: [
      "Most important questions for 9th class 2026 board exams organized by",
      "subject with probable short and long questions. Sample demo PDF.",
    ],
  },
  {
    file: "pairing-scheme-9.pdf",
    title: "9th Class Pairing Scheme 2026",
    body: [
      "Official style pairing scheme for 9th class annual exams 2026 with",
      "section-wise distribution of marks. Sample demo PDF.",
    ],
  },
  {
    file: "mdcat-biology-practice.pdf",
    title: "MDCAT Biology Practice Tests (Solved)",
    body: [
      "Topical practice tests for MDCAT biology with answer explanations.",
      "Covers all major topics for entrance exam preparation. Sample PDF.",
    ],
  },
  {
    file: "ecat-maths-practice.pdf",
    title: "ECAT Mathematics Practice Book",
    body: [
      "Entry test mathematics practice questions with full solutions for",
      "engineering universities. Sample demo PDF.",
    ],
  },
];

function escapePdfText(text) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrap(text, width) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > width) {
      lines.push(current.trim());
      current = word;
    } else {
      current = (current + " " + word).trim();
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines;
}

function buildContent(title, bodyLines) {
  let stream = "";
  let y = 730;
  stream += `BT /F2 26 Tf 72 ${y} Td (${escapePdfText(title)}) Tj ET\n`;
  y -= 48;
  stream += `BT /F2 12 Tf 72 ${y} Td (BoardNotes Demo Portal - Sample Resource) Tj ET\n`;
  y -= 34;
  const reflowed = [];
  for (const line of bodyLines) {
    if (line.trim() === "") {
      reflowed.push("");
      continue;
    }
    const wrapped = wrap(line, 88);
    for (const wl of wrapped) reflowed.push(wl);
    if (wrapped.length > 1) reflowed.push("");
    y -= 0;
    void y;
  }
  const wrappedLines = [];
  const maxY = 90;
  y = 650;
  for (const line of reflowed) {
    if (line === "") {
      y -= 16;
      continue;
    }
    if (y < maxY) {
      wrappedLines.push(["..continued..", 820]);
      break;
    }
    const wrappedTotal = wrap(line, 88);
    for (const wl of wrappedTotal) {
      if (y < maxY) {
        wrappedLines.push(["..continued..", 820]);
        break;
      }
      wrappedLines.push([wl, y]);
      y -= 18;
    }
  }
  for (const [text, yy] of wrappedLines) {
    stream += `BT /F1 12 Tf 72 ${yy} Td (${escapePdfText(text)}) Tj ET\n`;
  }
  stream += `BT /F1 10 Tf 72 48 Td (Page 1 of 1 - Generated for demo purposes.) Tj ET\n`;
  return stream;
}

function buildPdf(title, bodyLines) {
  const content = buildContent(title, bodyLines);
  const objects = [];
  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[2] = "<< /Type /Pages /Kids [3 0 R] /Count 1 >>";
  objects[3] =
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>";
  objects[4] = `<< /Length ${Buffer.byteLength(content, "utf8")} >>\nstream\n${content}endstream`;
  objects[5] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  objects[6] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  const count = objects.length;
  for (let i = 1; i < count; i++) {
    offsets[i] = Buffer.byteLength(pdf, "utf8");
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xrefStart = Buffer.byteLength(pdf, "utf8");
  let xref = `xref\n0 ${count}\n0000000000 65535 f \n`;
  for (let i = 1; i < count; i++) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += xref;
  pdf += `trailer\n<< /Size ${count} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  return pdf;
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

for (const item of FILES) {
  const pdf = buildPdf(item.title, item.body);
  fs.writeFileSync(path.join(outDir, item.file), pdf, "utf8");
  console.log(`Wrote ${item.file} (${Buffer.byteLength(pdf, "utf8")} bytes)`);
}
console.log("Done.");