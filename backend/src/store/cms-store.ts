import type { ContentStatus } from "@boardnotes/shared";

import { BOARD_DATA, type Board, type Question, setMutableBoardData } from "../demo-data.js";
import {
  chapterPublishKey,
  deleteChapterPublishStatus,
  getChapterPublishStatus,
  initChapterPublishStatus,
  setChapterPublishStatus,
} from "./chapter-publish.js";

export type ChapterDefinition = {
  term: string;
  definition: string;
  termUr?: string;
  definitionUr?: string;
};

export type CmsChapterRecord = {
  id: number;
  boardSlug: string;
  boardTitle: string;
  classSlug: string;
  classTitle: string;
  subjectSlug: string;
  subjectTitle: string;
  slug: string;
  title: string;
  summary: string;
  summaryUr?: string;
  formulas: string[];
  formulasUr?: string[];
  definitions?: ChapterDefinition[];
  videoUrl?: string;
  status: ContentStatus;
  exerciseCount: number;
};

export type CmsExerciseRecord = {
  id: number;
  chapterId: number;
  slug: string;
  title: string;
  questionCount: number;
};

export type CmsQuestionRecord = {
  id: number;
  exerciseId: number;
  num: number;
  questionText: string;
  questionTextUr?: string;
  marks: number;
  difficulty: string;
  pdfName: string | null;
  steps: { title: string; content: string }[];
  stepsUr?: { title: string; content: string }[];
};

export type CmsBoardRecord = {
  id: number;
  slug: string;
  title: string;
  classCount: number;
};

export type CmsClassRecord = {
  id: number;
  boardSlug: string;
  boardTitle: string;
  slug: string;
  title: string;
  subjectCount: number;
};

export type CmsSubjectRecord = {
  id: number;
  boardSlug: string;
  boardTitle: string;
  classSlug: string;
  classTitle: string;
  slug: string;
  title: string;
  chapterCount: number;
};

export type CmsMcq = {
  id: number;
  chapterKey: string;
  question: string;
  options: { label: string; text: string }[];
  correctLabel: string;
  reason: string;
};

export type QuizScoreRecord = {
  id: number;
  userId: number;
  chapterKey: string;
  score: number;
  total: number;
  createdAt: string;
};

type ChapterRef = {
  boardSlug: string;
  classSlug: string;
  subjectSlug: string;
  chapterSlug: string;
};

let content: Record<string, Board> = structuredClone(BOARD_DATA);
const chapterIds = new Map<string, number>();
const boardIds = new Map<string, number>();
const classIds = new Map<string, number>();
const subjectIds = new Map<string, number>();
const exerciseIds = new Map<string, number>();
const questionIds = new Map<string, number>();

let chapterIdCounter = 1;
let boardIdCounter = 1;
let classIdCounter = 1;
let subjectIdCounter = 1;
let exerciseIdCounter = 1;
let questionIdCounter = 1;
let quizScoreIdCounter = 1;
let mcqIdCounter = 4;

const mcqs: CmsMcq[] = [
  {
    id: 1,
    chapterKey: "fbise/9/mathematics/real-numbers",
    question: "Which of the following is a rational number?",
    options: [
      { label: "A", text: "$0.75$" },
      { label: "B", text: "$\\sqrt{2}$" },
      { label: "C", text: "$\\pi$" },
      { label: "D", text: "$\\sqrt{5}$" },
    ],
    correctLabel: "A",
    reason: "$0.75 = \\frac{3}{4}$, which is rational.",
  },
  {
    id: 2,
    chapterKey: "fbise/9/mathematics/real-numbers",
    question: "$\\sqrt{12}$ simplifies to:",
    options: [
      { label: "A", text: "$2\\sqrt{3}$" },
      { label: "B", text: "$3\\sqrt{2}$" },
      { label: "C", text: "$6$" },
      { label: "D", text: "$4\\sqrt{3}$" },
    ],
    correctLabel: "A",
    reason: "$\\sqrt{12} = \\sqrt{4 \\times 3} = 2\\sqrt{3}$.",
  },
  {
    id: 3,
    chapterKey: "fbise/9/mathematics/real-numbers",
    question: "Every integer is also a:",
    options: [
      { label: "A", text: "Rational number" },
      { label: "B", text: "Irrational number" },
      { label: "C", text: "Complex number only" },
      { label: "D", text: "None of these" },
    ],
    correctLabel: "A",
    reason: "Integers can be written as $\\frac{n}{1}$, so they are rational.",
  },
];

const quizScores: QuizScoreRecord[] = [];

function chapterKey(ref: ChapterRef) {
  return `${ref.boardSlug}/${ref.classSlug}/${ref.subjectSlug}/${ref.chapterSlug}`;
}

function classKey(boardSlug: string, classSlug: string) {
  return `${boardSlug}/${classSlug}`;
}

function subjectKey(boardSlug: string, classSlug: string, subjectSlug: string) {
  return `${boardSlug}/${classSlug}/${subjectSlug}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function exerciseKey(chapterId: number, exerciseSlug: string) {
  return `${chapterId}:${exerciseSlug}`;
}

function questionKey(exerciseId: number, num: number) {
  return `${exerciseId}:${num}`;
}

function initIds() {
  for (const board of Object.values(content)) {
    const bKey = board.slug;
    if (!boardIds.has(bKey)) boardIds.set(bKey, boardIdCounter++);

    for (const klass of board.classes) {
      const cKey = classKey(board.slug, klass.slug);
      if (!classIds.has(cKey)) classIds.set(cKey, classIdCounter++);

      for (const subject of klass.subjects) {
        const sKey = subjectKey(board.slug, klass.slug, subject.slug);
        if (!subjectIds.has(sKey)) subjectIds.set(sKey, subjectIdCounter++);

        for (const chapter of subject.chapters) {
          const key = chapterKey({
            boardSlug: board.slug,
            classSlug: klass.slug,
            subjectSlug: subject.slug,
            chapterSlug: chapter.slug,
          });
          if (!chapterIds.has(key)) chapterIds.set(key, chapterIdCounter++);
          initChapterPublishStatus(board.slug, klass.slug, subject.slug, chapter.slug, "published");

          const cid = chapterIds.get(key)!;
          for (const exercise of chapter.exercises) {
            const eKey = exerciseKey(cid, exercise.slug);
            if (!exerciseIds.has(eKey)) exerciseIds.set(eKey, exerciseIdCounter++);
            const eid = exerciseIds.get(eKey)!;
            for (const question of exercise.questions) {
              const qKey = questionKey(eid, question.num);
              if (!questionIds.has(qKey)) questionIds.set(qKey, questionIdCounter++);
            }
          }
        }
      }
    }
  }
}

initIds();
setMutableBoardData(content);

function findChapter(ref: ChapterRef) {
  const board = content[ref.boardSlug];
  const klass = board?.classes.find((c) => c.slug === ref.classSlug);
  const subject = klass?.subjects.find((s) => s.slug === ref.subjectSlug);
  const chapter = subject?.chapters.find((c) => c.slug === ref.chapterSlug);
  if (!board || !klass || !subject || !chapter) return null;
  return { board, klass, subject, chapter };
}

export const cmsStore = {
  getBoardData: () => content,
  getChapterStatus: (ref: ChapterRef) =>
    getChapterPublishStatus(chapterKey(ref)),
  isChapterPublished: (ref: ChapterRef) =>
    getChapterPublishStatus(chapterKey(ref)) === "published",

  listBoardsAdmin: (): CmsBoardRecord[] =>
    Object.values(content).map((board) => ({
      id: boardIds.get(board.slug) ?? 0,
      slug: board.slug,
      title: board.title,
      classCount: board.classes.length,
    })),

  createBoard: (input: { slug: string; title: string }) => {
    const slug = input.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    if (!slug || content[slug]) return null;
    content[slug] = { slug, title: input.title.trim(), classes: [] };
    boardIds.set(slug, boardIdCounter++);
    setMutableBoardData(content);
    return cmsStore.listBoardsAdmin().find((b) => b.slug === slug) ?? null;
  },

  updateBoard: (slug: string, input: Partial<{ title: string }>) => {
    const board = content[slug];
    if (!board) return null;
    if (input.title) board.title = input.title.trim();
    setMutableBoardData(content);
    return cmsStore.listBoardsAdmin().find((b) => b.slug === slug) ?? null;
  },

  deleteBoard: (slug: string) => {
    const board = content[slug];
    if (!board) return false;
    if (board.classes.length > 0) return false;
    delete content[slug];
    boardIds.delete(slug);
    setMutableBoardData(content);
    return true;
  },

  listClassesAdmin: (): CmsClassRecord[] => {
    const rows: CmsClassRecord[] = [];
    for (const board of Object.values(content)) {
      for (const klass of board.classes) {
        const key = classKey(board.slug, klass.slug);
        rows.push({
          id: classIds.get(key) ?? 0,
          boardSlug: board.slug,
          boardTitle: board.title,
          slug: klass.slug,
          title: klass.title,
          subjectCount: klass.subjects.length,
        });
      }
    }
    return rows;
  },

  createClass: (input: { boardSlug: string; title: string; slug?: string }) => {
    const board = content[input.boardSlug];
    if (!board) return null;

    const slug = input.slug?.trim() || slugify(input.title);
    if (board.classes.some((c) => c.slug === slug)) return null;

    board.classes.push({ slug, title: input.title, subjects: [] });
    const key = classKey(board.slug, slug);
    const id = classIdCounter++;
    classIds.set(key, id);
    setMutableBoardData(content);
    return cmsStore.listClassesAdmin().find((c) => c.id === id) ?? null;
  },

  updateClass: (id: number, input: Partial<{ title: string }>) => {
    for (const record of cmsStore.listClassesAdmin()) {
      if (record.id !== id) continue;
      const board = content[record.boardSlug];
      const klass = board?.classes.find((c) => c.slug === record.slug);
      if (!klass) return null;
      if (input.title) klass.title = input.title;
      setMutableBoardData(content);
      return cmsStore.listClassesAdmin().find((c) => c.id === id) ?? null;
    }
    return null;
  },

  deleteClass: (id: number) => {
    for (const board of Object.values(content)) {
      const index = board.classes.findIndex((klass) => {
        const key = classKey(board.slug, klass.slug);
        return classIds.get(key) === id;
      });
      if (index >= 0) {
        const klass = board.classes[index];
        if (klass.subjects.length > 0) return false;
        const key = classKey(board.slug, klass.slug);
        board.classes.splice(index, 1);
        classIds.delete(key);
        setMutableBoardData(content);
        return true;
      }
    }
    return false;
  },

  listSubjectsAdmin: (classId?: number): CmsSubjectRecord[] => {
    const rows: CmsSubjectRecord[] = [];
    for (const board of Object.values(content)) {
      for (const klass of board.classes) {
        const cKey = classKey(board.slug, klass.slug);
        const cid = classIds.get(cKey);
        if (classId && cid !== classId) continue;

        for (const subject of klass.subjects) {
          const sKey = subjectKey(board.slug, klass.slug, subject.slug);
          rows.push({
            id: subjectIds.get(sKey) ?? 0,
            boardSlug: board.slug,
            boardTitle: board.title,
            classSlug: klass.slug,
            classTitle: klass.title,
            slug: subject.slug,
            title: subject.title,
            chapterCount: subject.chapters.length,
          });
        }
      }
    }
    return rows;
  },

  createSubject: (input: { boardSlug: string; classSlug: string; title: string; slug?: string }) => {
    const board = content[input.boardSlug];
    const klass = board?.classes.find((c) => c.slug === input.classSlug);
    if (!board || !klass) return null;

    const slug = input.slug?.trim() || slugify(input.title);
    if (klass.subjects.some((s) => s.slug === slug)) return null;

    klass.subjects.push({ slug, title: input.title, chapters: [] });
    const key = subjectKey(board.slug, klass.slug, slug);
    const id = subjectIdCounter++;
    subjectIds.set(key, id);
    setMutableBoardData(content);
    return cmsStore.listSubjectsAdmin().find((s) => s.id === id) ?? null;
  },

  updateSubject: (id: number, input: Partial<{ title: string }>) => {
    for (const record of cmsStore.listSubjectsAdmin()) {
      if (record.id !== id) continue;
      const board = content[record.boardSlug];
      const klass = board?.classes.find((c) => c.slug === record.classSlug);
      const subject = klass?.subjects.find((s) => s.slug === record.slug);
      if (!subject) return null;
      if (input.title) subject.title = input.title;
      setMutableBoardData(content);
      return cmsStore.listSubjectsAdmin().find((s) => s.id === id) ?? null;
    }
    return null;
  },

  deleteSubject: (id: number) => {
    for (const board of Object.values(content)) {
      for (const klass of board.classes) {
        const index = klass.subjects.findIndex((subject) => {
          const key = subjectKey(board.slug, klass.slug, subject.slug);
          return subjectIds.get(key) === id;
        });
        if (index >= 0) {
          const subject = klass.subjects[index];
          if (subject.chapters.length > 0) return false;
          const key = subjectKey(board.slug, klass.slug, subject.slug);
          klass.subjects.splice(index, 1);
          subjectIds.delete(key);
          setMutableBoardData(content);
          return true;
        }
      }
    }
    return false;
  },

  listChaptersAdmin: (statusFilter?: ContentStatus): CmsChapterRecord[] => {
    const rows: CmsChapterRecord[] = [];
    for (const board of Object.values(content)) {
      for (const klass of board.classes) {
        for (const subject of klass.subjects) {
          for (const chapter of subject.chapters) {
            const ref = {
              boardSlug: board.slug,
              classSlug: klass.slug,
              subjectSlug: subject.slug,
              chapterSlug: chapter.slug,
            };
            const status = cmsStore.getChapterStatus(ref);
            if (statusFilter && status !== statusFilter) continue;
            const key = chapterKey(ref);
            rows.push({
              id: chapterIds.get(key) ?? 0,
              boardSlug: board.slug,
              boardTitle: board.title,
              classSlug: klass.slug,
              classTitle: klass.title,
              subjectSlug: subject.slug,
              subjectTitle: subject.title,
              slug: chapter.slug,
              title: chapter.title,
              summary: chapter.summary,
              summaryUr: chapter.summaryUr,
              formulas: chapter.formulas,
              formulasUr: chapter.formulasUr,
              definitions: chapter.definitions ?? [],
              videoUrl: chapter.videoUrl,
              status,
              exerciseCount: chapter.exercises.length,
            });
          }
        }
      }
    }
    return rows;
  },

  createChapter: (input: {
    boardSlug: string;
    classSlug: string;
    subjectSlug: string;
    title: string;
    summary: string;
    summaryUr?: string;
    formulas?: string[];
    formulasUr?: string[];
    definitions?: ChapterDefinition[];
    videoUrl?: string;
    status?: ContentStatus;
  }) => {
    const board = content[input.boardSlug];
    const klass = board?.classes.find((c) => c.slug === input.classSlug);
    const subject = klass?.subjects.find((s) => s.slug === input.subjectSlug);
    if (!board || !klass || !subject) return null;

    const slug = input.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    if (subject.chapters.some((c) => c.slug === slug)) return null;

    subject.chapters.push({
      slug,
      title: input.title,
      summary: input.summary,
      summaryUr: input.summaryUr,
      formulas: input.formulas ?? [],
      formulasUr: input.formulasUr,
      definitions: input.definitions ?? [],
      videoUrl: input.videoUrl,
      exercises: [],
    });

    const ref = {
      boardSlug: input.boardSlug,
      classSlug: input.classSlug,
      subjectSlug: input.subjectSlug,
      chapterSlug: slug,
    };
    const key = chapterKey(ref);
    const id = chapterIdCounter++;
    chapterIds.set(key, id);
    setChapterPublishStatus(key, input.status ?? "draft");
    setMutableBoardData(content);

    return cmsStore.listChaptersAdmin().find((c) => c.id === id) ?? null;
  },

  updateChapter: (
    id: number,
    input: Partial<{
      title: string;
      summary: string;
      summaryUr: string;
      formulas: string[];
      formulasUr: string[];
      definitions: ChapterDefinition[];
      videoUrl: string;
      status: ContentStatus;
    }>,
  ) => {
    for (const record of cmsStore.listChaptersAdmin()) {
      if (record.id !== id) continue;
      const found = findChapter({
        boardSlug: record.boardSlug,
        classSlug: record.classSlug,
        subjectSlug: record.subjectSlug,
        chapterSlug: record.slug,
      });
      if (!found) return null;

      if (input.title) found.chapter.title = input.title;
      if (input.summary !== undefined) found.chapter.summary = input.summary;
      if (input.summaryUr !== undefined) found.chapter.summaryUr = input.summaryUr;
      if (input.formulas) found.chapter.formulas = input.formulas;
      if (input.formulasUr !== undefined) found.chapter.formulasUr = input.formulasUr;
      if (input.definitions !== undefined) found.chapter.definitions = input.definitions;
      if (input.videoUrl !== undefined) found.chapter.videoUrl = input.videoUrl || undefined;
      if (input.status) {
        setChapterPublishStatus(
          chapterKey({
            boardSlug: record.boardSlug,
            classSlug: record.classSlug,
            subjectSlug: record.subjectSlug,
            chapterSlug: record.slug,
          }),
          input.status,
        );
      }
      setMutableBoardData(content);
      return cmsStore.listChaptersAdmin().find((c) => c.id === id) ?? null;
    }
    return null;
  },

  deleteChapter: (id: number) => {
    for (const board of Object.values(content)) {
      for (const klass of board.classes) {
        for (const subject of klass.subjects) {
          const index = subject.chapters.findIndex((c) => {
            const key = chapterKey({
              boardSlug: board.slug,
              classSlug: klass.slug,
              subjectSlug: subject.slug,
              chapterSlug: c.slug,
            });
            return chapterIds.get(key) === id;
          });
          if (index >= 0) {
            const chapter = subject.chapters[index];
            const key = chapterKey({
              boardSlug: board.slug,
              classSlug: klass.slug,
              subjectSlug: subject.slug,
              chapterSlug: chapter.slug,
            });
            subject.chapters.splice(index, 1);
            chapterIds.delete(key);
            deleteChapterPublishStatus(key);
            setMutableBoardData(content);
            return true;
          }
        }
      }
    }
    return false;
  },

  listExercises: (chapterId: number): CmsExerciseRecord[] => {
    for (const record of cmsStore.listChaptersAdmin()) {
      if (record.id !== chapterId) continue;
      const found = findChapter({
        boardSlug: record.boardSlug,
        classSlug: record.classSlug,
        subjectSlug: record.subjectSlug,
        chapterSlug: record.slug,
      });
      if (!found) return [];
      return found.chapter.exercises.map((exercise) => ({
        id: exerciseIds.get(exerciseKey(chapterId, exercise.slug)) ?? 0,
        chapterId,
        slug: exercise.slug,
        title: exercise.title,
        questionCount: exercise.questions.length,
      }));
    }
    return [];
  },

  createExercise: (chapterId: number, title: string) => {
    for (const record of cmsStore.listChaptersAdmin()) {
      if (record.id !== chapterId) continue;
      const found = findChapter({
        boardSlug: record.boardSlug,
        classSlug: record.classSlug,
        subjectSlug: record.subjectSlug,
        chapterSlug: record.slug,
      });
      if (!found) return null;
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      if (found.chapter.exercises.some((e) => e.slug === slug)) return null;
      found.chapter.exercises.push({ slug, title, questions: [] });
      const id = exerciseIdCounter++;
      exerciseIds.set(exerciseKey(chapterId, slug), id);
      setMutableBoardData(content);
      return cmsStore.listExercises(chapterId).find((e) => e.id === id) ?? null;
    }
    return null;
  },

  deleteExercise: (exerciseId: number) => {
    for (const record of cmsStore.listChaptersAdmin()) {
      for (const exercise of cmsStore.listExercises(record.id)) {
        if (exercise.id !== exerciseId) continue;
        const found = findChapter({
          boardSlug: record.boardSlug,
          classSlug: record.classSlug,
          subjectSlug: record.subjectSlug,
          chapterSlug: record.slug,
        });
        if (!found) return false;
        const index = found.chapter.exercises.findIndex((e) => e.slug === exercise.slug);
        if (index >= 0) {
          found.chapter.exercises.splice(index, 1);
          exerciseIds.delete(exerciseKey(record.id, exercise.slug));
          setMutableBoardData(content);
          return true;
        }
      }
    }
    return false;
  },

  listQuestions: (exerciseId: number): CmsQuestionRecord[] => {
    for (const record of cmsStore.listChaptersAdmin()) {
      for (const exercise of cmsStore.listExercises(record.id)) {
        if (exercise.id !== exerciseId) continue;
        const found = findChapter({
          boardSlug: record.boardSlug,
          classSlug: record.classSlug,
          subjectSlug: record.subjectSlug,
          chapterSlug: record.slug,
        });
        const ex = found?.chapter.exercises.find((e) => e.slug === exercise.slug);
        if (!ex) return [];
        return ex.questions.map((q) => ({
          id: questionIds.get(questionKey(exerciseId, q.num)) ?? 0,
          exerciseId,
          num: q.num,
          questionText: q.question,
          questionTextUr: q.questionUr,
          marks: q.marks,
          difficulty: q.difficulty,
          pdfName: q.pdfName ?? null,
          steps: q.steps,
          stepsUr: q.stepsUr,
        }));
      }
    }
    return [];
  },

  createQuestion: (
    exerciseId: number,
    input: Omit<CmsQuestionRecord, "id" | "exerciseId">,
  ) => {
    for (const record of cmsStore.listChaptersAdmin()) {
      for (const exercise of cmsStore.listExercises(record.id)) {
        if (exercise.id !== exerciseId) continue;
        const found = findChapter({
          boardSlug: record.boardSlug,
          classSlug: record.classSlug,
          subjectSlug: record.subjectSlug,
          chapterSlug: record.slug,
        });
        const ex = found?.chapter.exercises.find((e) => e.slug === exercise.slug);
        if (!ex) return null;
        if (ex.questions.some((q) => q.num === input.num)) return null;
        const question: Question = {
          num: input.num,
          question: input.questionText,
          questionUr: input.questionTextUr,
          marks: input.marks,
          difficulty: input.difficulty,
          pdfName: input.pdfName ?? "",
          steps: input.steps,
          stepsUr: input.stepsUr,
        };
        ex.questions.push(question);
        ex.questions.sort((a, b) => a.num - b.num);
        const id = questionIdCounter++;
        questionIds.set(questionKey(exerciseId, input.num), id);
        setMutableBoardData(content);
        return cmsStore.listQuestions(exerciseId).find((q) => q.id === id) ?? null;
      }
    }
    return null;
  },

  updateQuestion: (questionId: number, input: Partial<Omit<CmsQuestionRecord, "id" | "exerciseId">>) => {
    for (const record of cmsStore.listChaptersAdmin()) {
      for (const exercise of cmsStore.listExercises(record.id)) {
        for (const question of cmsStore.listQuestions(exercise.id)) {
          if (question.id !== questionId) continue;
          const found = findChapter({
            boardSlug: record.boardSlug,
            classSlug: record.classSlug,
            subjectSlug: record.subjectSlug,
            chapterSlug: record.slug,
          });
          const ex = found?.chapter.exercises.find((e) => e.slug === exercise.slug);
          const q = ex?.questions.find((item) => item.num === question.num);
          if (!q) return null;
          if (input.questionText) q.question = input.questionText;
          if (input.questionTextUr !== undefined) q.questionUr = input.questionTextUr;
          if (input.marks !== undefined) q.marks = input.marks;
          if (input.difficulty) q.difficulty = input.difficulty;
          if (input.pdfName !== undefined) q.pdfName = input.pdfName ?? "";
          if (input.steps) q.steps = input.steps;
          if (input.stepsUr !== undefined) q.stepsUr = input.stepsUr;
          setMutableBoardData(content);
          return cmsStore.listQuestions(exercise.id).find((item) => item.id === questionId) ?? null;
        }
      }
    }
    return null;
  },

  deleteQuestion: (questionId: number) => {
    for (const record of cmsStore.listChaptersAdmin()) {
      for (const exercise of cmsStore.listExercises(record.id)) {
        for (const question of cmsStore.listQuestions(exercise.id)) {
          if (question.id !== questionId) continue;
          const found = findChapter({
            boardSlug: record.boardSlug,
            classSlug: record.classSlug,
            subjectSlug: record.subjectSlug,
            chapterSlug: record.slug,
          });
          const ex = found?.chapter.exercises.find((e) => e.slug === exercise.slug);
          if (!ex) return false;
          const index = ex.questions.findIndex((q) => q.num === question.num);
          if (index >= 0) {
            ex.questions.splice(index, 1);
            questionIds.delete(questionKey(exercise.id, question.num));
            setMutableBoardData(content);
            return true;
          }
        }
      }
    }
    return false;
  },

  getMcqsForChapter: (boardSlug: string, classSlug: string, subjectSlug: string, chapterSlug: string) => {
    const key = `${boardSlug}/${classSlug}/${subjectSlug}/${chapterSlug}`;
    return mcqs.filter((m) => m.chapterKey === key);
  },

  listMcqs: (chapterKey?: string) =>
    chapterKey ? mcqs.filter((m) => m.chapterKey === chapterKey) : [...mcqs],

  getMcq: (id: number) => mcqs.find((m) => m.id === id) ?? null,

  createMcq: (input: Omit<CmsMcq, "id">) => {
    const entry: CmsMcq = { ...input, id: mcqIdCounter++ };
    mcqs.push(entry);
    return entry;
  },

  updateMcq: (id: number, input: Partial<Omit<CmsMcq, "id">>) => {
    const index = mcqs.findIndex((m) => m.id === id);
    if (index < 0) return null;
    mcqs[index] = { ...mcqs[index], ...input };
    return mcqs[index];
  },

  deleteMcq: (id: number) => {
    const index = mcqs.findIndex((m) => m.id === id);
    if (index < 0) return false;
    mcqs.splice(index, 1);
    return true;
  },

  saveQuizScore: (userId: number, chapterKeyValue: string, score: number, total: number) => {
    const entry: QuizScoreRecord = {
      id: quizScoreIdCounter++,
      userId,
      chapterKey: chapterKeyValue,
      score,
      total,
      createdAt: new Date().toISOString(),
    };
    quizScores.unshift(entry);
    return entry;
  },

  getQuizScoresForUser: (userId: number) =>
    quizScores.filter((s) => s.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
};

export function getCmsBoardData() {
  return content;
}
