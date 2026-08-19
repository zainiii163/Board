export type BoardSummary = {
    slug: string;
    title: string;
};

export type SolutionStep = {
    title: string;
    content: string;
};

export type Question = {
    num: number;
    question: string;
    marks: number;
    difficulty: string;
    pdfName: string;
    steps: SolutionStep[];
};

export type Exercise = {
    slug: string;
    title: string;
    questions: Question[];
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
                exercises: Exercise[];
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
                                    {
                                        slug: "exercise-1-1",
                                        title: "Exercise 1.1",
                                        questions: [
                                            {
                                                num: 3,
                                                question: "Express $0.75$ as a rational number in the form $\\frac{a}{b}$.",
                                                marks: 2,
                                                difficulty: "Easy",
                                                pdfName: "fbise-9-math-ch1-ex1-1.pdf",
                                                steps: [
                                                    {
                                                        title: "Given",
                                                        content: "We need to express $0.75$ as a rational number in the form $\\frac{a}{b}$.",
                                                    },
                                                    {
                                                        title: "Working",
                                                        content: "$0.75 = \\frac{75}{100} = \\frac{3}{4}$ after simplifying by dividing numerator and denominator by $25$.",
                                                    },
                                                    {
                                                        title: "Answer",
                                                        content: "$\\frac{3}{4}$",
                                                    },
                                                ],
                                            },
                                            {
                                                num: 4,
                                                question: "Simplify $\\sqrt{12} + \\sqrt{27}$.",
                                                marks: 3,
                                                difficulty: "Medium",
                                                pdfName: "fbise-9-math-ch1-ex1-1-q4.pdf",
                                                steps: [
                                                    {
                                                        title: "Working",
                                                        content: "$\\sqrt{12} = 2\\sqrt{3}$ and $\\sqrt{27} = 3\\sqrt{3}$.\n$2\\sqrt{3} + 3\\sqrt{3} = 5\\sqrt{3}$.",
                                                    },
                                                    {
                                                        title: "Answer",
                                                        content: "$5\\sqrt{3}$",
                                                    },
                                                ],
                                            },
                                            {
                                                num: 5,
                                                question: "Evaluate $\\frac{1}{\\sqrt{2} - 1}$.",
                                                marks: 4,
                                                difficulty: "Hard",
                                                pdfName: "fbise-9-math-ch1-ex1-1-q5.pdf",
                                                steps: [
                                                    {
                                                        title: "Rationalize Denominator",
                                                        content: "Multiply numerator and denominator by $\\sqrt{2} + 1$.\n$\\frac{1}{\\sqrt{2} - 1} \\times \\frac{\\sqrt{2} + 1}{\\sqrt{2} + 1}$",
                                                    },
                                                    {
                                                        title: "Simplify",
                                                        content: "$\\frac{\\sqrt{2} + 1}{2 - 1} = \\sqrt{2} + 1$",
                                                    },
                                                    {
                                                        title: "Answer",
                                                        content: "$\\sqrt{2} + 1$",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    { slug: "exercise-1-2", title: "Exercise 1.2", questions: [] },
                                ],
                            },
                            {
                                slug: "logarithms",
                                title: "Logarithms",
                                summary:
                                    "Logarithms are the inverse operations to exponentiation. This chapter covers the laws of logarithms and their applications in solving complex calculations.",
                                formulas: [
                                    "$\\log_a(xy) = \\log_a x + \\log_a y$",
                                    "$\\log_a(\\frac{x}{y}) = \\log_a x - \\log_a y$",
                                    "$\\log_a(x^n) = n \\log_a x$",
                                ],
                                exercises: [
                                    {
                                        slug: "exercise-3-1",
                                        title: "Exercise 3.1",
                                        questions: [
                                            {
                                                num: 1,
                                                question: "Express the following in scientific notation: $5700$",
                                                marks: 2,
                                                difficulty: "Easy",
                                                pdfName: "fbise-9-math-ch3-ex3-1.pdf",
                                                steps: [
                                                    {
                                                        title: "Working",
                                                        content: "Move the decimal point 3 places to the left to get a number between 1 and 10: $5.700$. So we multiply by $10^3$.",
                                                    },
                                                    {
                                                        title: "Answer",
                                                        content: "$5.7 \\times 10^3$",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        slug: "exercise-3-2",
                                        title: "Exercise 3.2",
                                        questions: [
                                            {
                                                num: 2,
                                                question: "Find the value of $x$ if $\\log_{10} x = 2.4543$",
                                                marks: 3,
                                                difficulty: "Medium",
                                                pdfName: "fbise-9-math-ch3-ex3-2.pdf",
                                                steps: [
                                                    {
                                                        title: "Working",
                                                        content: "$x = \\text{antilog}(2.4543)$. Characteristic is $2$ and mantissa is $.4543$. Finding antilog of $.4543$ gives $2846$.",
                                                    },
                                                    {
                                                        title: "Answer",
                                                        content: "$x = 284.6$",
                                                    },
                                                ],
                                            },
                                        ],
                                    }
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
    const question = exercise?.questions.find((item) => item.num === questionNumber);

    if (!exercise || !question) {
        return null;
    }

    return {
        board: getBoardBySlug(boardSlug),
        class: getClassBySlug(boardSlug, classSlug),
        subject: getSubjectBySlug(boardSlug, classSlug, subjectSlug),
        chapter: getChapterBySlug(boardSlug, classSlug, subjectSlug, chapterSlug),
        exercise,
        question,
    };
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
    {
        title: "Logarithms",
        board: "FBISE",
        className: "Class 9",
        subject: "Mathematics",
        path: "/fbise/9/mathematics/logarithms",
    },
    {
        title: "Exercise 3.2",
        board: "FBISE",
        className: "Class 9",
        subject: "Mathematics",
        path: "/fbise/9/mathematics/logarithms/exercise-3-2",
    },
    {
        title: "Question 4",
        board: "FBISE",
        className: "Class 9",
        subject: "Mathematics",
        path: "/fbise/9/mathematics/real-numbers/exercise-1-1/q/4",
    },
    {
        title: "Question 5",
        board: "FBISE",
        className: "Class 9",
        subject: "Mathematics",
        path: "/fbise/9/mathematics/real-numbers/exercise-1-1/q/5",
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
