export type BoardSummary = {
    slug: string;
    title: string;
};

export type Board = BoardSummary & {
    classes: {
        slug: string;
        title: string;
        subjects: {
            slug: string;
            title: string;
            chapters: {
                slug: string;
                title: string;
                summary: string;
                formulas: string[];
                exercises: { slug: string; title: string }[];
            }[];
        }[];
    }[];
};

export const BOARD_LIST: BoardSummary[] = [
    { slug: "fbise", title: "Federal Board (FBISE)" },
    { slug: "punjab", title: "Punjab Board" },
    { slug: "kpk", title: "KPK Board" },
    { slug: "sindh", title: "Sindh Board" },
];

export const BOARD_DATA: Record<string, Board> = {
    fbise: {
        slug: "fbise",
        title: "Federal Board (FBISE)",
        classes: [
            {
                slug: "9",
                title: "Class 9",
                subjects: [
                    {
                        slug: "mathematics",
                        title: "Mathematics",
                        chapters: [
                            {
                                slug: "real-numbers",
                                title: "Real Numbers",
                                summary:
                                    "Real numbers include natural numbers, whole numbers, integers, rational numbers, and irrational numbers. The chapter focuses on understanding decimal expansion, terminating and recurring decimals, and converting decimals into rational numbers.",
                                formulas: [
                                    "A rational number can be written as a/b where b ≠ 0.",
                                    "Terminating decimals can be converted by placing the digits over 10^n.",
                                    "A repeating decimal can be rewritten using a rational-form equation.",
                                ],
                                exercises: [
                                    { slug: "exercise-1-1", title: "Exercise 1.1" },
                                    { slug: "exercise-1-2", title: "Exercise 1.2" },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    punjab: {
        slug: "punjab",
        title: "Punjab Board",
        classes: [{ slug: "9", title: "Class 9", subjects: [] }],
    },
    kpk: {
        slug: "kpk",
        title: "KPK Board",
        classes: [{ slug: "9", title: "Class 9", subjects: [] }],
    },
    sindh: {
        slug: "sindh",
        title: "Sindh Board",
        classes: [{ slug: "9", title: "Class 9", subjects: [] }],
    },
};

export function getBoardBySlug(slug: string) {
    return BOARD_DATA[slug] ?? null;
}

export function getClassBySlug(boardSlug: string, classSlug: string) {
    const board = getBoardBySlug(boardSlug);
    if (!board) return null;
    return board.classes.find((klass) => klass.slug === classSlug) ?? null;
}

export function getSubjectBySlug(
    boardSlug: string,
    classSlug: string,
    subjectSlug: string,
) {
    const klass = getClassBySlug(boardSlug, classSlug);
    if (!klass) return null;
    return klass.subjects.find((subject) => subject.slug === subjectSlug) ?? null;
}

export function getChapterBySlug(
    boardSlug: string,
    classSlug: string,
    subjectSlug: string,
    chapterSlug: string,
) {
    const subject = getSubjectBySlug(boardSlug, classSlug, subjectSlug);
    if (!subject) return null;
    return subject.chapters.find((chapter) => chapter.slug === chapterSlug) ?? null;
}

export function getExerciseBySlug(
    boardSlug: string,
    classSlug: string,
    subjectSlug: string,
    chapterSlug: string,
    exerciseSlug: string,
) {
    const chapter = getChapterBySlug(boardSlug, classSlug, subjectSlug, chapterSlug);
    if (!chapter) return null;
    return chapter.exercises.find((exercise) => exercise.slug === exerciseSlug) ?? null;
}

export function getQuestionData(
    boardSlug: string,
    classSlug: string,
    subjectSlug: string,
    chapterSlug: string,
    exerciseSlug: string,
    questionNumber: number,
) {
    const exercise = getExerciseBySlug(boardSlug, classSlug, subjectSlug, chapterSlug, exerciseSlug);
    const question = {
        num: 3,
        question: "Express 0.75 as a rational number in the form a/b.",
        marks: 2,
        difficulty: "Easy",
        pdfName: "fbise-9-math-ch1-ex1-1.pdf",
        steps: [
            {
                title: "Given",
                content: "We need to express 0.75 as a rational number in the form a/b.",
            },
            {
                title: "Working",
                content: "0.75 = 75/100 = 3/4 after simplifying by dividing numerator and denominator by 25.",
            },
            {
                title: "Answer",
                content: "3/4",
            },
        ],
    };

    if (exercise && questionNumber === 3) {
        return {
            board: getBoardBySlug(boardSlug),
            class: getClassBySlug(boardSlug, classSlug),
            subject: getSubjectBySlug(boardSlug, classSlug, subjectSlug),
            chapter: getChapterBySlug(boardSlug, classSlug, subjectSlug, chapterSlug),
            exercise: exercise,
            question,
        };
    }

    return null;
}

export const SEARCH_RESULTS = [
    {
        title: "Real Numbers",
        board: "FBISE",
        className: "Class 9",
        subject: "Mathematics",
        path: "/fbise/9/mathematics/real-numbers",
    },
    {
        title: "Exercise 1.1",
        board: "FBISE",
        className: "Class 9",
        subject: "Mathematics",
        path: "/fbise/9/mathematics/real-numbers/exercise-1-1",
    },
    {
        title: "Question 3",
        board: "FBISE",
        className: "Class 9",
        subject: "Mathematics",
        path: "/fbise/9/mathematics/real-numbers/exercise-1-1/q/3",
    },
];

export const BOOKS = [
    {
        title: "FBISE Mathematics Class 9",
        board: "FBISE",
        className: "Class 9",
        price: "Free PDF",
    },
    {
        title: "Board Notes Companion",
        board: "Punjab",
        className: "Class 9",
        price: "Free PDF",
    },
];

export const PAST_PAPERS = [
    { year: "2026", subject: "Mathematics", board: "FBISE" },
    { year: "2025", subject: "Physics", board: "Punjab" },
    { year: "2024", subject: "Chemistry", board: "KPK" },
];
