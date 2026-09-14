import { isChapterPublished } from "./store/chapter-publish.js";

export type BoardSummary = {
    slug: string;
    title: string;
};

export type SolutionStep = {
    title: string;
    content: string;
};

export type ChapterDefinition = {
    term: string;
    definition: string;
    termUr?: string;
    definitionUr?: string;
};

export type Question = {
    num: number;
    question: string;
    questionUr?: string;
    marks: number;
    difficulty: string;
    pdfName?: string | null;
    steps: SolutionStep[];
    stepsUr?: SolutionStep[];
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
                summaryUr?: string;
                formulas: string[];
                formulasUr?: string[];
                definitions?: ChapterDefinition[];
                videoUrl?: string;
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
                                summaryUr:
                                    "حقیقی اعداد میں قدرتی اعداد، صحیح اعداد، ناطق اور غیر ناطق اعداد شامل ہیں۔ اس باب میں اعشاریہ کی توسیع، ختم ہونے والے اور دہرائے جانے والے اعشاریہ، اور اعشاریہ کو ناطق عدد میں تبدیل کرنا سکھایا جاتا ہے۔",
                                videoUrl: "https://www.youtube.com/watch?v=11q8Yj__ORo",
                                formulas: [
                                    "A rational number can be written as a/b where b ≠ 0.",
                                    "Terminating decimals can be converted by placing the digits over 10^n.",
                                    "A repeating decimal can be rewritten using a rational-form equation.",
                                ],
                                formulasUr: [
                                    "ناطق عدد a/b کی صورت میں لکھا جا سکتا ہے جہاں b ≠ 0۔",
                                    "ختم ہونے والے اعشاریہ کو ہندسوں کو 10^n پر رکھ کر تبدیل کیا جا سکتا ہے۔",
                                    "دہرائے جانے والے اعشاریہ کو ناطق مساوات سے دوبارہ لکھا جا سکتا ہے۔",
                                ],
                                definitions: [
                                    {
                                        term: "Rational number",
                                        definition: "A number that can be written as a fraction $\\frac{a}{b}$ where $a$ and $b$ are integers and $b \\neq 0$.",
                                        termUr: "ناطق عدد",
                                        definitionUr: "وہ عدد جو $\\frac{a}{b}$ کی صورت میں لکھا جا سکے جہاں $a$ اور $b$ صحیح ہوں اور $b \\neq 0$۔",
                                    },
                                    {
                                        term: "Irrational number",
                                        definition: "A real number that cannot be expressed as a simple fraction; its decimal form is non-terminating and non-repeating.",
                                        termUr: "غیر ناطق عدد",
                                        definitionUr: "حقیقی عدد جو سادہ کسر کی صورت میں نہ لکھا جا سکے؛ اس کا اعشاریہ نہ ختم ہوتا ہے نہ دہراتا ہے۔",
                                    },
                                    {
                                        term: "Terminating decimal",
                                        definition: "A decimal that ends after a finite number of digits, e.g. $0.75 = \\frac{3}{4}$.",
                                        termUr: "ختم ہونے والا اعشاریہ",
                                        definitionUr: "وہ اعشاریہ جو مخصوص ہندسوں کے بعد رک جائے، مثلاً $0.75 = \\frac{3}{4}$۔",
                                    },
                                ],
                                exercises: [
                                    {
                                        slug: "exercise-1-1",
                                        title: "Exercise 1.1",
                                        questions: [
                                            {
                                                num: 3,
                                                question: "Express $0.75$ as a rational number in the form $\\frac{a}{b}$.",
                                                questionUr: "$0.75$ کو $\\frac{a}{b}$ کی صورت میں ناطق عدد کے طور پر ظاہر کریں۔",
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
                                                stepsUr: [
                                                    {
                                                        title: "دی گئی قیمت",
                                                        content: "ہمیں $0.75$ کو $\\frac{a}{b}$ کی صورت میں ناطق عدد کے طور پر لکھنا ہے۔",
                                                    },
                                                    {
                                                        title: "حل",
                                                        content: "$0.75 = \\frac{75}{100} = \\frac{3}{4}$ — بالا و زیریں دونوں کو $25$ سے تقسیم کرنے پر۔",
                                                    },
                                                    {
                                                        title: "جواب",
                                                        content: "$\\frac{3}{4}$",
                                                    },
                                                ],
                                            },
                                            {
                                                num: 4,
                                                question: "Simplify $\\sqrt{12} + \\sqrt{27}$.",
                                                questionUr: "$\\sqrt{12} + \\sqrt{27}$ کو سادہ کریں۔",
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
                                                stepsUr: [
                                                    {
                                                        title: "حل",
                                                        content: "$\\sqrt{12} = 2\\sqrt{3}$ اور $\\sqrt{27} = 3\\sqrt{3}$۔\n$2\\sqrt{3} + 3\\sqrt{3} = 5\\sqrt{3}$۔",
                                                    },
                                                    {
                                                        title: "جواب",
                                                        content: "$5\\sqrt{3}$",
                                                    },
                                                ],
                                            },
                                            {
                                                num: 5,
                                                question: "Evaluate $\\frac{1}{\\sqrt{2} - 1}$.",
                                                questionUr: "$\\frac{1}{\\sqrt{2} - 1}$ کی قیمت معلوم کریں۔",
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
                                                stepsUr: [
                                                    {
                                                        title: "مقام کا اصلاح",
                                                        content: "بالا و زیریں کو $\\sqrt{2} + 1$ سے ضرب دیں۔",
                                                    },
                                                    {
                                                        title: "سادہ کریں",
                                                        content: "$\\frac{\\sqrt{2} + 1}{2 - 1} = \\sqrt{2} + 1$",
                                                    },
                                                    {
                                                        title: "جواب",
                                                        content: "$\\sqrt{2} + 1$",
                                                    },
                                                ],
                                            },
                                            {
                                                num: 6,
                                                question: "Simplify $\\sqrt{18} - \\sqrt{8}$.",
                                                questionUr: "$\\sqrt{18} - \\sqrt{8}$ کو سادہ کریں۔",
                                                marks: 3,
                                                difficulty: "Medium",
                                                pdfName: "fbise-9-math-ch1-ex1-1-q6.pdf",
                                                steps: [
                                                    {
                                                        title: "Break into factors",
                                                        content: "$\\sqrt{18} = 3\\sqrt{2}$ and $\\sqrt{8} = 2\\sqrt{2}$.",
                                                    },
                                                    {
                                                        title: "Answer",
                                                        content: "$3\\sqrt{2} - 2\\sqrt{2} = \\sqrt{2}$",
                                                    },
                                                ],
                                                stepsUr: [
                                                    {
                                                        title: "عوامل",
                                                        content: "$\\sqrt{18} = 3\\sqrt{2}$ اور $\\sqrt{8} = 2\\sqrt{2}$۔",
                                                    },
                                                    {
                                                        title: "جواب",
                                                        content: "$3\\sqrt{2} - 2\\sqrt{2} = \\sqrt{2}$",
                                                    },
                                                ],
                                            },
                                            {
                                                num: 7,
                                                question: "Rationalize $\\frac{1}{\\sqrt{5} + 2}$.",
                                                questionUr: "$\\frac{1}{\\sqrt{5} + 2}$ کا مقام اصلاح کریں۔",
                                                marks: 4,
                                                difficulty: "Hard",
                                                pdfName: "fbise-9-math-ch1-ex1-1-q7.pdf",
                                                steps: [
                                                    {
                                                        title: "Multiply by conjugate",
                                                        content: "Multiply numerator and denominator by $\\sqrt{5} - 2$.\n$\\frac{1}{\\sqrt{5} + 2} \\times \\frac{\\sqrt{5} - 2}{\\sqrt{5} - 2}$",
                                                    },
                                                    {
                                                        title: "Simplify",
                                                        content: "$\\frac{\\sqrt{5} - 2}{5 - 4} = \\sqrt{5} - 2$",
                                                    },
                                                    {
                                                        title: "Answer",
                                                        content: "$\\sqrt{5} - 2$",
                                                    },
                                                ],
                                                stepsUr: [
                                                    {
                                                        title: "مزدوج سے ضرب",
                                                        content: "بالا و زیریں کو $\\sqrt{5} - 2$ سے ضرب دیں۔",
                                                    },
                                                    {
                                                        title: "سادہ کریں",
                                                        content: "$\\frac{\\sqrt{5} - 2}{5 - 4} = \\sqrt{5} - 2$",
                                                    },
                                                    {
                                                        title: "جواب",
                                                        content: "$\\sqrt{5} - 2$",
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
                                summaryUr:
                                    "لوگارتھم کیفیت کی معکوس عمل ہیں۔ اس باب میں لوگارتھم کے قوانین اور مشکل حساب میں ان کے استعمال پر بحث ہے۔",
                                formulas: [
                                    "$\\log_a(xy) = \\log_a x + \\log_a y$",
                                    "$\\log_a(\\frac{x}{y}) = \\log_a x - \\log_a y$",
                                    "$\\log_a(x^n) = n \\log_a x$",
                                ],
                                formulasUr: [
                                    "$\\log_a(xy) = \\log_a x + \\log_a y$",
                                    "$\\log_a(\\frac{x}{y}) = \\log_a x - \\log_a y$",
                                    "$\\log_a(x^n) = n \\log_a x$",
                                ],
                                definitions: [
                                    {
                                        term: "Logarithm",
                                        definition: "The logarithm of a number $x$ to base $a$ is the exponent to which $a$ must be raised to get $x$.",
                                        termUr: "لوگارتھم",
                                        definitionUr: "عدد $x$ کا بنیاد $a$ پر لوگارتھم وہ exponent ہے جس پر $a$ کو اٹھانے سے $x$ ملے۔",
                                    },
                                    {
                                        term: "Common logarithm",
                                        definition: "A logarithm with base $10$, written $\\log_{10} x$ or simply $\\log x$.",
                                        termUr: "عام لوگارتھم",
                                        definitionUr: "بنیاد $10$ والا لوگارتھم، $\\log_{10} x$ یا $\\log x$ لکھا جاتا ہے۔",
                                    },
                                    {
                                        term: "Characteristic",
                                        definition: "The integer part of the logarithm of a number in standard form.",
                                        termUr: "خصوصیت",
                                        definitionUr: "معیاری صورت میں عدد کے لوگارتھم کا صحیح حصہ۔",
                                    },
                                ],
                                exercises: [
                                    {
                                        slug: "exercise-3-1",
                                        title: "Exercise 3.1",
                                        questions: [
                                            {
                                                num: 1,
                                                question: "Express the following in scientific notation: $5700$",
                                                questionUr: "درج ذیل کو سائنٹیفک نوٹیشن میں لکھیں: $5700$",
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
                                                stepsUr: [
                                                    {
                                                        title: "حل",
                                                        content: "اعشاریہ کو بائیں تین جگہ منتقل کریں تاکہ عدد $1$ اور $10$ کے درمیان ہو: $5.700$۔ اس لیے $10^3$ سے ضرب دیں۔",
                                                    },
                                                    {
                                                        title: "جواب",
                                                        content: "$5.7 \\times 10^3$",
                                                    },
                                                ],
                                            },
                                            {
                                                num: 2,
                                                question: "Write $\\log_2 8$ as a simple number.",
                                                questionUr: "$\\log_2 8$ کو سادہ عدد کی صورت میں لکھیں۔",
                                                marks: 2,
                                                difficulty: "Easy",
                                                steps: [
                                                    {
                                                        title: "Meaning",
                                                        content: "$\\log_2 8 = x$ means $2^x = 8$.",
                                                    },
                                                    {
                                                        title: "Working",
                                                        content: "$2^3 = 8$, so $x = 3$.",
                                                    },
                                                    {
                                                        title: "Answer",
                                                        content: "$3$",
                                                    },
                                                ],
                                                stepsUr: [
                                                    {
                                                        title: "معنی",
                                                        content: "$\\log_2 8 = x$ کا مطلب $2^x = 8$ ہے۔",
                                                    },
                                                    {
                                                        title: "حل",
                                                        content: "$2^3 = 8$، لہٰذا $x = 3$۔",
                                                    },
                                                    {
                                                        title: "جواب",
                                                        content: "$3$",
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
                                                num: 1,
                                                question: "Simplify $\\log_{10} 100 + \\log_{10} 10$.",
                                                questionUr: "$\\log_{10} 100 + \\log_{10} 10$ سادہ کریں۔",
                                                marks: 2,
                                                difficulty: "Easy",
                                                steps: [
                                                    {
                                                        title: "Evaluate",
                                                        content: "$\\log_{10} 100 = 2$ and $\\log_{10} 10 = 1$.",
                                                    },
                                                    {
                                                        title: "Add",
                                                        content: "$2 + 1 = 3$",
                                                    },
                                                    {
                                                        title: "Answer",
                                                        content: "$3$",
                                                    },
                                                ],
                                                stepsUr: [
                                                    {
                                                        title: "قیمت",
                                                        content: "$\\log_{10} 100 = 2$ اور $\\log_{10} 10 = 1$۔",
                                                    },
                                                    {
                                                        title: "جمع",
                                                        content: "$2 + 1 = 3$",
                                                    },
                                                    {
                                                        title: "جواب",
                                                        content: "$3$",
                                                    },
                                                ],
                                            },
                                            {
                                                num: 2,
                                                question: "Find the value of $x$ if $\\log_{10} x = 2.4543$",
                                                questionUr: "اگر $\\log_{10} x = 2.4543$ ہو تو $x$ معلوم کریں۔",
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
                                                stepsUr: [
                                                    {
                                                        title: "حل",
                                                        content: "$x = \\text{antilog}(2.4543)$۔ خصوصیت $2$ اور mantissa $.4543$ ہے۔ $.4543$ کا antilog $2846$ دیتا ہے۔",
                                                    },
                                                    {
                                                        title: "جواب",
                                                        content: "$x = 284.6$",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
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
                                slug: "sets",
                                title: "Sets",
                                summary:
                                    "Sets are collections of well-defined objects. This Punjab Board Class 9 chapter covers roster and set-builder forms, types of sets, subsets, and the basic operations union, intersection, and difference.",
                                summaryUr:
                                    "سیٹ واضح اشیاء کا مجموعہ ہیں۔ پنجاب بورڈ کلاس ۹ کے اس باب میں روسٹر اور سیٹ بلڈر شکل، اقسامِ سیٹ، سب سیٹ، اور اتحاد، اشتراک و فرق کی بنیادی اعمال شامل ہیں۔",
                                formulas: [
                                    "A ∪ B = {x | x ∈ A or x ∈ B}",
                                    "A ∩ B = {x | x ∈ A and x ∈ B}",
                                    "A − B = {x | x ∈ A and x ∉ B}",
                                    "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)",
                                ],
                                formulasUr: [
                                    "A ∪ B = {x | x ∈ A یا x ∈ B}",
                                    "A ∩ B = {x | x ∈ A اور x ∈ B}",
                                    "A − B = {x | x ∈ A اور x ∉ B}",
                                    "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)",
                                ],
                                definitions: [
                                    {
                                        term: "Set",
                                        definition: "A well-defined collection of distinct objects, written with braces, e.g. $A = \\{1, 2, 3\\}$.",
                                        termUr: "سیٹ",
                                        definitionUr: "واضح اور الگ اشیاء کا مجموعہ، مثلاً $A = \\{1, 2, 3\\}$۔",
                                    },
                                    {
                                        term: "Subset",
                                        definition: "$A \\subseteq B$ if every element of $A$ is also an element of $B$.",
                                        termUr: "سب سیٹ",
                                        definitionUr: "$A \\subseteq B$ جب $A$ کا ہر عنصر $B$ میں بھی ہو۔",
                                    },
                                    {
                                        term: "Universal set",
                                        definition: "The set $U$ that contains all objects under consideration for a particular discussion.",
                                        termUr: "عالمگیر سیٹ",
                                        definitionUr: "وہ سیٹ $U$ جو زیر بحث کے تمام عناصر پر مشتمل ہو۔",
                                    },
                                ],
                                videoUrl: "https://www.youtube.com/watch?v=B1vNr5FxH2E",
                                exercises: [
                                    {
                                        slug: "exercise-1-1",
                                        title: "Exercise 1.1",
                                        questions: [
                                            {
                                                num: 1,
                                                question: "Write the set of even natural numbers less than $10$ in roster form.",
                                                questionUr: "$10$ سے کم جفت قدرتی اعداد کا سیٹ روسٹر شکل میں لکھیں۔",
                                                marks: 2,
                                                difficulty: "Easy",
                                                steps: [
                                                    {
                                                        title: "Idea",
                                                        content: "Even natural numbers less than $10$ are $2, 4, 6, 8$.",
                                                    },
                                                    {
                                                        title: "Answer",
                                                        content: "$\\{2, 4, 6, 8\\}$",
                                                    },
                                                ],
                                                stepsUr: [
                                                    {
                                                        title: "خیال",
                                                        content: "$10$ سے کم جفت قدرتی اعداد $2, 4, 6, 8$ ہیں۔",
                                                    },
                                                    {
                                                        title: "جواب",
                                                        content: "$\\{2, 4, 6, 8\\}$",
                                                    },
                                                ],
                                            },
                                            {
                                                num: 2,
                                                question: "If $A = \\{1, 2, 3, 4\\}$ and $B = \\{3, 4, 5\\}$, find $A \\cup B$ and $A \\cap B$.",
                                                questionUr: "اگر $A = \\{1, 2, 3, 4\\}$ اور $B = \\{3, 4, 5\\}$ ہوں تو $A \\cup B$ اور $A \\cap B$ معلوم کریں۔",
                                                marks: 3,
                                                difficulty: "Easy",
                                                steps: [
                                                    {
                                                        title: "Union",
                                                        content: "$A \\cup B$ contains every element that is in $A$ or in $B$ (or both): $\\{1, 2, 3, 4, 5\\}$.",
                                                    },
                                                    {
                                                        title: "Intersection",
                                                        content: "$A \\cap B$ contains only common elements: $\\{3, 4\\}$.",
                                                    },
                                                    {
                                                        title: "Answer",
                                                        content: "$A \\cup B = \\{1, 2, 3, 4, 5\\}$, $A \\cap B = \\{3, 4\\}$",
                                                    },
                                                ],
                                                stepsUr: [
                                                    {
                                                        title: "اتحاد",
                                                        content: "$A \\cup B$ میں $A$ یا $B$ (یا دونوں) کے عناصر: $\\{1, 2, 3, 4, 5\\}$۔",
                                                    },
                                                    {
                                                        title: "اشتراک",
                                                        content: "$A \\cap B$ میں صرف مشترک عناصر: $\\{3, 4\\}$۔",
                                                    },
                                                    {
                                                        title: "جواب",
                                                        content: "$A \\cup B = \\{1, 2, 3, 4, 5\\}$, $A \\cap B = \\{3, 4\\}$",
                                                    },
                                                ],
                                            },
                                            {
                                                num: 3,
                                                question: "If $n(A) = 12$, $n(B) = 8$ and $n(A \\cap B) = 3$, find $n(A \\cup B)$.",
                                                questionUr: "اگر $n(A) = 12$، $n(B) = 8$ اور $n(A \\cap B) = 3$ ہوں تو $n(A \\cup B)$ معلوم کریں۔",
                                                marks: 2,
                                                difficulty: "Medium",
                                                steps: [
                                                    {
                                                        title: "Formula",
                                                        content: "Use $n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$.",
                                                    },
                                                    {
                                                        title: "Working",
                                                        content: "$n(A \\cup B) = 12 + 8 - 3 = 17$.",
                                                    },
                                                    {
                                                        title: "Answer",
                                                        content: "$17$",
                                                    },
                                                ],
                                                stepsUr: [
                                                    {
                                                        title: "فارمولا",
                                                        content: "$n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$ استعمال کریں۔",
                                                    },
                                                    {
                                                        title: "حل",
                                                        content: "$n(A \\cup B) = 12 + 8 - 3 = 17$۔",
                                                    },
                                                    {
                                                        title: "جواب",
                                                        content: "$17$",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    kpk: {
        slug: "kpk",
        title: "KPK Board",
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
                                slug: "linear-equations",
                                title: "Linear Equations",
                                summary:
                                    "A linear equation in one variable has the form $ax + b = 0$ where $a \\neq 0$. This KPK Board Class 9 chapter covers solving equations, checking solutions, and translating word problems into linear equations.",
                                summaryUr:
                                    "ایک متغیر میں خطی مساوات کی صورت $ax + b = 0$ ہے جہاں $a \\neq 0$۔ کے پی کے بورڈ کلاس ۹ میں مساوات حل کرنا، جواب کی تصدیق، اور لفظی مسائل کو خطی مساوات میں تبدیل کرنا سکھایا جاتا ہے۔",
                                formulas: [
                                    "Linear form: $ax + b = 0$, $a \\neq 0$",
                                    "Solution: $x = -\\frac{b}{a}$",
                                    "Check: substitute the value back into the original equation",
                                ],
                                formulasUr: [
                                    "خطی صورت: $ax + b = 0$, $a \\neq 0$",
                                    "حل: $x = -\\frac{b}{a}$",
                                    "تصدیق: حاصل شدہ قیمت اصل مساوات میں رکھیں",
                                ],
                                definitions: [
                                    {
                                        term: "Linear equation",
                                        definition: "An equation where the variable appears only to the first power, e.g. $3x - 7 = 2$.",
                                        termUr: "خطی مساوات",
                                        definitionUr: "وہ مساوات جس میں متغیر کی طاقت ایک ہو، مثلاً $3x - 7 = 2$۔",
                                    },
                                    {
                                        term: "Root / solution",
                                        definition: "The value of $x$ that makes the equation true.",
                                        termUr: "جڑ / حل",
                                        definitionUr: "وہ $x$ کی قیمت جو مساوات کو درست بنائے۔",
                                    },
                                ],
                                videoUrl: "https://www.youtube.com/watch?v=Z-ZkmpQBIFo",
                                exercises: [
                                    {
                                        slug: "exercise-2-1",
                                        title: "Exercise 2.1",
                                        questions: [
                                            {
                                                num: 1,
                                                question: "Solve $2x + 5 = 17$.",
                                                questionUr: "$2x + 5 = 17$ حل کریں۔",
                                                marks: 2,
                                                difficulty: "Easy",
                                                steps: [
                                                    { title: "Transpose", content: "$2x = 17 - 5 = 12$" },
                                                    { title: "Divide", content: "$x = \\frac{12}{2} = 6$" },
                                                    { title: "Answer", content: "$x = 6$" },
                                                ],
                                                stepsUr: [
                                                    { title: "منتقل", content: "$2x = 17 - 5 = 12$" },
                                                    { title: "تقسیم", content: "$x = \\frac{12}{2} = 6$" },
                                                    { title: "جواب", content: "$x = 6$" },
                                                ],
                                            },
                                            {
                                                num: 2,
                                                question: "Solve $\\frac{x}{3} - 4 = 2$.",
                                                questionUr: "$\\frac{x}{3} - 4 = 2$ حل کریں۔",
                                                marks: 3,
                                                difficulty: "Easy",
                                                steps: [
                                                    { title: "Add 4", content: "$\\frac{x}{3} = 6$" },
                                                    { title: "Multiply by 3", content: "$x = 18$" },
                                                    { title: "Answer", content: "$x = 18$" },
                                                ],
                                                stepsUr: [
                                                    { title: "4 شامل", content: "$\\frac{x}{3} = 6$" },
                                                    { title: "3 سے ضرب", content: "$x = 18$" },
                                                    { title: "جواب", content: "$x = 18$" },
                                                ],
                                            },
                                            {
                                                num: 3,
                                                question: "The sum of a number and $9$ is $24$. Find the number.",
                                                questionUr: "ایک عدد اور $9$ کا مجموعہ $24$ ہے۔ عدد معلوم کریں۔",
                                                marks: 3,
                                                difficulty: "Medium",
                                                steps: [
                                                    { title: "Let", content: "Let the number be $x$. Then $x + 9 = 24$." },
                                                    { title: "Solve", content: "$x = 24 - 9 = 15$." },
                                                    { title: "Answer", content: "The number is $15$." },
                                                ],
                                                stepsUr: [
                                                    { title: "فرض", content: "عدد $x$ ہو۔ پھر $x + 9 = 24$۔" },
                                                    { title: "حل", content: "$x = 24 - 9 = 15$۔" },
                                                    { title: "جواب", content: "عدد $15$ ہے۔" },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    sindh: {
        slug: "sindh",
        title: "Sindh Board",
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
                                slug: "algebraic-expressions",
                                title: "Algebraic Expressions",
                                summary:
                                    "Algebraic expressions combine variables, constants, and operations. This Sindh Board Class 9 chapter introduces terms, coefficients, like terms, and simplifying expressions by combining them.",
                                summaryUr:
                                    "الجبری اظہار متغیر، ثابت اور اعمال کو ملا کر بنتے ہیں۔ سندھ بورڈ کلاس ۹ میں اجزاء، ضریب، ہم جیسے اجزاء، اور انہیں ملا کر اظہار سادہ کرنا سکھایا جاتا ہے۔",
                                formulas: [
                                    "Like terms: same variable part, e.g. $3x$ and $5x$",
                                    "Combine: $3x + 5x = 8x$",
                                    "Distributive law: $a(b + c) = ab + ac$",
                                ],
                                formulasUr: [
                                    "ہم جیسے اجزاء: ایک جیسا متغیر حصہ، مثلاً $3x$ اور $5x$",
                                    "ملائیں: $3x + 5x = 8x$",
                                    "تقسیم قاعدہ: $a(b + c) = ab + ac$",
                                ],
                                definitions: [
                                    {
                                        term: "Term",
                                        definition: "A single part of an expression separated by $+$ or $-$ signs, e.g. $7$, $3x$, or $-2y^2$.",
                                        termUr: "جز",
                                        definitionUr: "اظہار کا ایک حصہ جو $+$ یا $-$ سے الگ ہو، مثلاً $7$, $3x$, یا $-2y^2$۔",
                                    },
                                    {
                                        term: "Coefficient",
                                        definition: "The numerical factor in a term, e.g. in $5x$ the coefficient is $5$.",
                                        termUr: "ضریب",
                                        definitionUr: "جز میں عددی عنصر، مثلاً $5x$ میں ضریب $5$ ہے۔",
                                    },
                                ],
                                videoUrl: "https://www.youtube.com/watch?v=3NHSwivZBZo",
                                exercises: [
                                    {
                                        slug: "exercise-1-1",
                                        title: "Exercise 1.1",
                                        questions: [
                                            {
                                                num: 1,
                                                question: "Simplify $4x + 7x - 2x$.",
                                                questionUr: "$4x + 7x - 2x$ سادہ کریں۔",
                                                marks: 2,
                                                difficulty: "Easy",
                                                steps: [
                                                    { title: "Combine", content: "$(4 + 7 - 2)x = 9x$" },
                                                    { title: "Answer", content: "$9x$" },
                                                ],
                                                stepsUr: [
                                                    { title: "ملائیں", content: "$(4 + 7 - 2)x = 9x$" },
                                                    { title: "جواب", content: "$9x$" },
                                                ],
                                            },
                                            {
                                                num: 2,
                                                question: "Expand $3(2x + 5)$.",
                                                questionUr: "$3(2x + 5)$ کھولیں۔",
                                                marks: 2,
                                                difficulty: "Easy",
                                                steps: [
                                                    { title: "Distribute", content: "$3 \\cdot 2x + 3 \\cdot 5$" },
                                                    { title: "Answer", content: "$6x + 15$" },
                                                ],
                                                stepsUr: [
                                                    { title: "تقسیم", content: "$3 \\cdot 2x + 3 \\cdot 5$" },
                                                    { title: "جواب", content: "$6x + 15$" },
                                                ],
                                            },
                                            {
                                                num: 3,
                                                question: "Simplify $2(x - 4) + 3x$.",
                                                questionUr: "$2(x - 4) + 3x$ سادہ کریں۔",
                                                marks: 3,
                                                difficulty: "Medium",
                                                steps: [
                                                    { title: "Expand", content: "$2x - 8 + 3x$" },
                                                    { title: "Combine", content: "$5x - 8$" },
                                                    { title: "Answer", content: "$5x - 8$" },
                                                ],
                                                stepsUr: [
                                                    { title: "کھولیں", content: "$2x - 8 + 3x$" },
                                                    { title: "ملائیں", content: "$5x - 8$" },
                                                    { title: "جواب", content: "$5x - 8$" },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    oxford: {
        slug: "oxford",
        title: "Oxford Board",
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
                                slug: "number-systems",
                                title: "Number Systems",
                                summary:
                                    "Oxford Board Class 9 Number Systems covers real numbers, their decimal expansions, rational and irrational numbers, and representing numbers on the number line.",
                                summaryUr:
                                    "آکسفورڈ بورڈ کلاس ۹ عددی نظام میں حقیقی اعداد، ان کی اعشاری توسیع، ناطق اور غیر ناطق اعداد، اور عددی خط پر اعداد کا مظاہرہ شامل ہے۔",
                                formulas: [
                                    "Irrational numbers lie between consecutive integers.",
                                    "A rational number is of the form $\\frac{p}{q}$, $q \\neq 0$.",
                                    "Every point on a number line corresponds to exactly one real number.",
                                ],
                                formulasUr: [
                                    "غیر ناطق اعداد متواتر صحیح اعداد کے درمیان ہوتے ہیں۔",
                                    "ناطق عدد $\\frac{p}{q}$ کی صورت ہے، $q \\neq 0$۔",
                                    "عدد خط پر ہر نقطہ بالکل ایک حقیقی عدد کا مظاہرہ کرتا ہے۔",
                                ],
                                definitions: [
                                    {
                                        term: "Real number",
                                        definition: "Any number that can be placed on a number line, including rational and irrational numbers.",
                                        termUr: "حقیقی عدد",
                                        definitionUr: "وہ عدد جو عددی خط پر رکھا جا سکے، ناطق اور غیر ناطق دونوں شامل ہیں۔",
                                    },
                                ],
                                exercises: [
                                    {
                                        slug: "exercise-1-1",
                                        title: "Exercise 1.1",
                                        questions: [
                                            {
                                                num: 1,
                                                question: "Classify $\\sqrt{2}$ and $\\frac{1}{3}$ as rational or irrational.",
                                                questionUr: "$\\sqrt{2}$ اور $\\frac{1}{3}$ کو ناطق یا غیر ناطق میں تقسیم کریں۔",
                                                marks: 2,
                                                difficulty: "Easy",
                                                steps: [
                                                    { title: "Identify", content: "$\\sqrt{2}$ cannot be written as a ratio of integers, so it is irrational." },
                                                    { title: "Identify", content: "$\\frac{1}{3}$ is a ratio of two integers, so it is rational." },
                                                    { title: "Answer", content: "$\\sqrt{2}$ is irrational and $\\frac{1}{3}$ is rational." },
                                                ],
                                                stepsUr: [
                                                    { title: "شناخت", content: "$\\sqrt{2}$ صحیح اعداد کے تناسب میں نہیں لکھا جا سکتا، لہٰذا یہ غیر ناطق ہے۔" },
                                                    { title: "شناخت", content: "$\\frac{1}{3}$ دو صحیح اعداد کا تناسب ہے، لہٰذا یہ ناطق ہے۔" },
                                                    { title: "جواب", content: "$\\sqrt{2}$ غیر ناطق ہے اور $\\frac{1}{3}$ ناطق ہے۔" },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    cambridge: {
        slug: "cambridge",
        title: "Cambridge Board",
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
                                slug: "algebra",
                                title: "Foundations of Algebra",
                                summary:
                                    "Cambridge Board Class 9 Foundations of Algebra introduces variables, algebraic expressions, like and unlike terms, and evaluating expressions by substitution.",
                                summaryUr:
                                    "کیمبرج بورڈ کلاس ۹ الجبرا کی بنیادیں، متغیرات، الجبری اظہارات، مماثل اور غیر مماثل اصطلاحات، اور متبادل سے اظہار کی قدر معلوم کرنا سکھاتی ہیں۔",
                                formulas: [
                                    "Value of an algebraic expression = substitute values, then simplify.",
                                    "Like terms share the same variable(s) and power(s).",
                                    "$a(a + b) = a^2 + ab$ (distributive law)",
                                ],
                                formulasUr: [
                                    "الجبری اظہار کی قدر = اقدار متبادل کریں، پھر سادہ کریں۔",
                                    "مماثل اصطلاحات میں متغیرات اور قوتیں یکساں ہوتی ہیں۔",
                                    "$a(a + b) = a^2 + ab$ (تقسیمی قانون)",
                                ],
                                definitions: [
                                    {
                                        term: "Variable",
                                        definition: "A symbol that represents an unknown or changeable value, usually a letter such as $x$;",
                                        termUr: "متغیر",
                                        definitionUr: "وہ علامت جو نامعلوم یا قابلِ تبدیل قیمت ظاہر کرے، عام طور پر ایک حرف جیسے $x$۔",
                                    },
                                ],
                                exercises: [
                                    {
                                        slug: "exercise-2-1",
                                        title: "Exercise 2.1",
                                        questions: [
                                            {
                                                num: 1,
                                                question: "Evaluate $3x + 5$ when $x = 4$.",
                                                questionUr: "$x = 4$ پر $3x + 5$ کی قدر معلوم کریں۔",
                                                marks: 2,
                                                difficulty: "Easy",
                                                steps: [
                                                    { title: "Substitute", content: "Replace $x$ with $4$: $3(4) + 5$." },
                                                    { title: "Simplify", content: "$12 + 5 = 17$." },
                                                    { title: "Answer", content: "$17$" },
                                                ],
                                                stepsUr: [
                                                    { title: "متبادل", content: "$x$ کی جگہ $4$ رکھیں: $3(4) + 5$۔" },
                                                    { title: "سادہ کریں", content: "$12 + 5 = 17$۔" },
                                                    { title: "جواب", content: "$17$" },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
};

const LEVEL_CLASS_SLUGS = ["5", "6", "7", "8", "10", "11", "12"] as const;

type LevelMathChapter = {
    slug: string;
    title: string;
    summary: string;
    summaryUr: string;
    formulas: string[];
    formulasUr: string[];
    definitions: ChapterDefinition[];
    exercise: Exercise;
};

const LEVEL_MATH_CONTENT: Record<string, LevelMathChapter> = {
    "5": {
        slug: "numbers-operations",
        title: "Numbers and Operations",
        summary:
            "This chapter covers place value, comparison and ordering of large numbers, prime and composite numbers, and the four basic operations on whole numbers.",
        summaryUr:
            "اس باب میں بڑی اعداد کی قیمتِ مکانی، موازنہ اور ترتیب، مفرد اور مرکب اعداد، اور پورے اعداد پر چار بنیادی عملیات کا مطالعہ کیا گیا ہے۔",
        formulas: [
            "Place value: each digit's value depends on its position (units, tens, hundreds, ...).",
            "For addition and subtraction, align numbers by their place value columns.",
            "Prime numbers have exactly two factors: 1 and the number itself.",
        ],
        formulasUr: [
            "قیمت مکانی: ہر ہندسے کی قیمت اس کی جگہ پر منحصر ہوتی ہے (اکائی، دہائی، سینکڑا، ...)۔",
            "جمع اور تفریق کے لیے اعداد کو ان کی جگہ کے ستونوں کے مطابق سیدھ میں رکھیں۔",
            "مفرد اعداد کے بالکل دو اجزائے ضربی ہوتے ہیں: 1 اور خود وہی عدد۔",
        ],
        definitions: [
            {
                term: "Prime number",
                definition: "A whole number greater than 1 that has exactly two factors: 1 and itself.",
                termUr: "مفرد عدد",
                definitionUr: "وہ پورا عدد جو 1 سے بڑا ہو اور جس کے بالکل دو اجزائے ضربی ہوں: 1 اور خود وہی عدد۔",
            },
            {
                term: "Composite number",
                definition: "A whole number greater than 1 that has more than two factors.",
                termUr: "مرکب عدد",
                definitionUr: "وہ پورا عدد جو 1 سے بڑا ہو اور جس کے دو سے زیادہ اجزائے ضربی ہوں۔",
            },
        ],
        exercise: {
            slug: "exercise-1-1",
            title: "Exercise 1.1",
            questions: [
                {
                    num: 1,
                    question: "Write the place value of the digit 7 in 47,305.",
                    questionUr: "عدد 47,305 میں ہندسہ 7 کی قیمتِ مکانی لکھیں۔",
                    marks: 2,
                    difficulty: "Easy",
                    steps: [
                        {
                            title: "Given",
                            content:
                                "The number 47,305 has digits 4 (ten-thousands), 7 (thousands), 3 (hundreds), 0 (tens), 5 (units).",
                        },
                        {
                            title: "Working",
                            content: "The digit 7 is in the thousands place.",
                        },
                        {
                            title: "Answer",
                            content: "So its place value is $7 \\times 1,000 = 7,000$.",
                        },
                    ],
                    stepsUr: [
                        {
                            title: "دی گئی قیمت",
                            content:
                                "عدد 47,305 میں ہندسے ہیں: 4 (دس ہزار)، 7 (ہزار)، 3 (سینکڑا)، 0 (دہائی)، 5 (اکائی)۔",
                        },
                        {
                            title: "حل",
                            content: "ہندسہ 7 ہزار کے مقام پر ہے۔",
                        },
                        {
                            title: "جواب",
                            content: "لہٰذا اس کی قیمتِ مکانی $7 \\times 1,000 = 7,000$ ہے۔",
                        },
                    ],
                },
                {
                    num: 2,
                    question: "Find the prime factors of 36.",
                    questionUr: "عدد 36 کے مفرد اجزائے ضربی معلوم کریں۔",
                    marks: 2,
                    difficulty: "Medium",
                    steps: [
                        {
                            title: "Working",
                            content: "Divide 36 by the smallest prime 2: $36 \\div 2 = 18$.",
                        },
                        {
                            title: "Working",
                            content: "Continue: $18 \\div 2 = 9$; then $9 \\div 3 = 3$ and $3 \\div 3 = 1$.",
                        },
                        {
                            title: "Answer",
                            content: "So $36 = 2 \\times 2 \\times 3 \\times 3 = 2^2 \\times 3^2$.",
                        },
                    ],
                    stepsUr: [
                        {
                            title: "حل",
                            content: "عدد 36 کو سب سے چھوٹے مفرد عدد 2 سے تقسیم کریں: $36 \\div 2 = 18$۔",
                        },
                        {
                            title: "حل",
                            content: "جاری رکھیں: $18 \\div 2 = 9$؛ پھر $9 \\div 3 = 3$ اور $3 \\div 3 = 1$۔",
                        },
                        {
                            title: "جواب",
                            content: "لہٰذا $36 = 2 \\times 2 \\times 3 \\times 3 = 2^2 \\times 3^2$۔",
                        },
                    ],
                },
            ],
        },
    },
    "6": {
        slug: "integers",
        title: "Integers",
        summary:
            "Integers include positive numbers, zero and negative numbers. This chapter covers ordering integers, absolute value and the rules of adding integers.",
        summaryUr:
            "صحیح اعداد میں مثبت اعداد، صفر اور منفی اعداد شامل ہیں۔ اس باب میں صحیح اعداد کی ترتیب، مطلق قیمت اور جمعِ صحیح اعداد کے قواعد بیان کیے گئے ہیں۔",
        formulas: [
            "Adding two integers with the same sign: add their absolute values and keep the sign.",
            "Adding integers with different signs: subtract the smaller absolute value from the larger and keep the sign of the larger.",
            "Subtracting an integer: add its opposite instead, e.g. $a - b = a + (-b)$.",
        ],
        formulasUr: [
            "دو ہم نشان صحیح اعداد کو جمع کریں: ان کی مطلق قمتیں جمع کریں اور نشان رکھیں۔",
            "مختلف نشان والے صحیح اعداد: چھوٹی مطلق قیمت بڑی میں سے تفریق کریں اور بڑی کا نشان رکھیں۔",
            "کسی صحیح عدد کی تفریق: اس کا مخالف عدد جمع کریں، مثلاً $a - b = a + (-b)$۔",
        ],
        definitions: [
            {
                term: "Absolute value",
                definition: "The distance of an integer from 0 on the number line, always written without a sign, e.g. $|-5| = 5$.",
                termUr: "مطلق قیمت",
                definitionUr: "عدد خط پر صحیح عدد کا صفر سے فاصلہ جو ہمیشہ بغیر نشان کے لکھا جاتا ہے، مثلاً $|-5| = 5$۔",
            },
            {
                term: "Negative integer",
                definition: "An integer less than zero, written with a minus sign, e.g. $-3$.",
                termUr: "منفی صحیح عدد",
                definitionUr: "ایک صحیح عدد جو صفر سے چھوٹا ہو اور منفی نشان کے ساتھ لکھا جائے، مثلاً $-3$۔",
            },
        ],
        exercise: {
            slug: "exercise-1-1",
            title: "Exercise 1.1",
            questions: [
                {
                    num: 1,
                    question: "Arrange $-7, 3, 0, -2, 6$ in ascending order.",
                    questionUr: "$-7, 3, 0, -2, 6$ کو صعودی ترتیب میں رکھیں۔",
                    marks: 2,
                    difficulty: "Easy",
                    steps: [
                        {
                            title: "Given",
                            content: "Negative numbers are smaller than zero; order them from smallest to largest.",
                        },
                        {
                            title: "Working",
                            content: "On the number line, $-7$ comes before $-2$, then $0$, then $3$, then $6$.",
                        },
                        {
                            title: "Answer",
                            content: "$-7, -2, 0, 3, 6$",
                        },
                    ],
                    stepsUr: [
                        {
                            title: "دی گئی قیمت",
                            content: "منفی اعداد صفر سے چھوٹے ہیں؛ انہیں چھوٹے سے بڑے کی ترتیب میں رکھیں۔",
                        },
                        {
                            title: "حل",
                            content: "عدد خط پر $-7$ سب سے پہلے، پھر $-2$، پھر $0$، پھر $3$، پھر $6$ آتا ہے۔",
                        },
                        {
                            title: "جواب",
                            content: "$-7, -2, 0, 3, 6$",
                        },
                    ],
                },
                {
                    num: 2,
                    question: "Evaluate $-8 + 5$.",
                    questionUr: "$-8 + 5$ کی قیمت معلوم کریں۔",
                    marks: 2,
                    difficulty: "Easy",
                    steps: [
                        {
                            title: "Working",
                            content: "The signs are different, so find the difference of the absolute values: $8 - 5 = 3$.",
                        },
                        {
                            title: "Working",
                            content: "The larger absolute value is 8, whose sign is negative.",
                        },
                        {
                            title: "Answer",
                            content: "So $-8 + 5 = -3$.",
                        },
                    ],
                    stepsUr: [
                        {
                            title: "حل",
                            content: "نشان مختلف ہیں، لہٰذا مطلق قمتیں گھٹائیں: $8 - 5 = 3$۔",
                        },
                        {
                            title: "حل",
                            content: "بڑی مطلق قیمت 8 ہے جس کا نشان منفی ہے۔",
                        },
                        {
                            title: "جواب",
                            content: "لہٰذا $-8 + 5 = -3$۔",
                        },
                    ],
                },
            ],
        },
    },
    "7": {
        slug: "rational-numbers",
        title: "Rational Numbers",
        summary:
            "A rational number can be written as a quotient of two integers. This chapter covers comparing rational numbers and the operations of addition and subtraction on them.",
        summaryUr:
            "ناطق عدد کو دو صحیح اعداد کے حاصلِ تقسیم کے طور پر لکھا جا سکتا ہے۔ اس باب میں ناطق اعداد کا موازنہ اور ان پر جمع و تفریق کے عملیات بیان کیے گئے ہیں۔",
        formulas: [
            "Rational numbers have the form $\\frac{p}{q}$ with $q \\neq 0$.",
            "To add fractions, rewrite them with a common denominator first.",
            "To compare fractions, cross-multiply: $\\frac{a}{b} > \\frac{c}{d}$ if $ad > bc$.",
        ],
        formulasUr: [
            "ناطق عدد $\\frac{p}{q}$ کی صورت میں ہوتے ہیں جہاں $q \\neq 0$۔",
            "کسراں کو جمع کرنے کے لیے پہلے مشترکہ مخرج میں تبدیل کریں۔",
            "کسراں کا موازنہ کرنے کے لیے ضربِ متقاطع: اگر $ad > bc$ تو $\\frac{a}{b} > \\frac{c}{d}$۔",
        ],
        definitions: [
            {
                term: "Rational number",
                definition: "A number expressible as $\\frac{p}{q}$ where $p$ and $q$ are integers and $q \\neq 0$.",
                termUr: "ناطق عدد",
                definitionUr: "وہ عدد جو $\\frac{p}{q}$ کی صورت میں لکھا جا سکے جہاں $p$ اور $q$ صحیح اعداد ہوں اور $q \\neq 0$۔",
            },
            {
                term: "Equivalent fractions",
                definition: "Fractions that represent the same value, such as $\\frac{1}{2}$, $\\frac{2}{4}$ and $\\frac{3}{6}$.",
                termUr: "متساوی کسر",
                definitionUr: "وہ کسراں جو ایک ہی قیمت ظاہر کریں، جیسے $\\frac{1}{2}$، $\\frac{2}{4}$ اور $\\frac{3}{6}$۔",
            },
        ],
        exercise: {
            slug: "exercise-1-1",
            title: "Exercise 1.1",
            questions: [
                {
                    num: 1,
                    question: "Add $\\frac{3}{5} + \\frac{1}{4}$.",
                    questionUr: "$\\frac{3}{5} + \\frac{1}{4}$ کو جمع کریں۔",
                    marks: 3,
                    difficulty: "Medium",
                    steps: [
                        {
                            title: "Working",
                            content: "Find the LCM of the denominators 5 and 4, which is 20.",
                        },
                        {
                            title: "Working",
                            content: "Rewrite: $\\frac{3}{5} = \\frac{12}{20}$ and $\\frac{1}{4} = \\frac{5}{20}$.",
                        },
                        {
                            title: "Answer",
                            content: "Add: $\\frac{12+5}{20} = \\frac{17}{20}$.",
                        },
                    ],
                    stepsUr: [
                        {
                            title: "حل",
                            content: "مخرجوں 5 اور 4 کا کم سے کم مشترک ضربی (LCM) معلوم کریں، جو 20 ہے۔",
                        },
                        {
                            title: "حل",
                            content: "تبدیل کریں: $\\frac{3}{5} = \\frac{12}{20}$ اور $\\frac{1}{4} = \\frac{5}{20}$۔",
                        },
                        {
                            title: "جواب",
                            content: "جمع کریں: $\\frac{12+5}{20} = \\frac{17}{20}$۔",
                        },
                    ],
                },
                {
                    num: 2,
                    question: "Which is greater, $\\frac{5}{8}$ or $\\frac{2}{3}$?",
                    questionUr: "بڑی کسر بتائیں، $\\frac{5}{8}$ یا $\\frac{2}{3}$؟",
                    marks: 2,
                    difficulty: "Easy",
                    steps: [
                        {
                            title: "Working",
                            content: "Cross-multiply: $5 \\times 3 = 15$ and $2 \\times 8 = 16$.",
                        },
                        {
                            title: "Answer",
                            content: "Since $16 > 15$, $\\frac{2}{3}$ is greater.",
                        },
                    ],
                    stepsUr: [
                        {
                            title: "حل",
                            content: "ضربِ متقاطع: $5 \\times 3 = 15$ اور $2 \\times 8 = 16$۔",
                        },
                        {
                            title: "جواب",
                            content: "چونکہ $16 > 15$، لہٰذا $\\frac{2}{3}$ بڑی ہے۔",
                        },
                    ],
                },
            ],
        },
    },
    "8": {
        slug: "factorization",
        title: "Factorization",
        summary:
            "This chapter explains how to factor algebraic expressions by taking out a common factor, grouping terms, and using the identities for squares.",
        summaryUr:
            "اس باب میں الجبری اظہارات کو مشترک عامل نکال کر، گروہ بندی کر کے اور مربعوں کی شناختوں کی مدد سے تجزیه کرنا سکھایا گیا ہے۔",
        formulas: [
            "Common factor: $ax + ay = a(x + y)$.",
            "Difference of squares: $a^2 - b^2 = (a - b)(a + b)$.",
            "Perfect square: $a^2 + 2ab + b^2 = (a + b)^2$.",
        ],
        formulasUr: [
            "مشترک عامل: $ax + ay = a(x + y)$۔",
            "مربعوں کا فرق: $a^2 - b^2 = (a - b)(a + b)$۔",
            "کامل مربع: $a^2 + 2ab + b^2 = (a + b)^2$۔",
        ],
        definitions: [
            {
                term: "Factorization",
                definition: "Writing an algebraic expression as a product of its factors.",
                termUr: "تجزیه",
                definitionUr: "الجبری اظہار کو اس کے عوامل کے حاصل ضرب کے طور پر لکھنا۔",
            },
            {
                term: "Factor",
                definition: "A number or expression that divides another expression exactly.",
                termUr: "عامل",
                definitionUr: "وہ عدد یا اظہار جو دوسرے اظہار کو ٹھیک ٹھیک تقسیم کرے۔",
            },
        ],
        exercise: {
            slug: "exercise-1-1",
            title: "Exercise 1.1",
            questions: [
                {
                    num: 1,
                    question: "Factorize $x^2 - 9$.",
                    questionUr: "تجزیه کریں: $x^2 - 9$۔",
                    marks: 2,
                    difficulty: "Easy",
                    steps: [
                        {
                            title: "Working",
                            content: "Write it as a difference of squares: $x^2 - 3^2$.",
                        },
                        {
                            title: "Working",
                            content: "Apply the identity $a^2 - b^2 = (a - b)(a + b)$.",
                        },
                        {
                            title: "Answer",
                            content: "$(x - 3)(x + 3)$",
                        },
                    ],
                    stepsUr: [
                        {
                            title: "حل",
                            content: "اسے مربعوں کے فرق کے طور پر لکھیں: $x^2 - 3^2$۔",
                        },
                        {
                            title: "حل",
                            content: "شناخت $a^2 - b^2 = (a - b)(a + b)$ استعمال کریں۔",
                        },
                        {
                            title: "جواب",
                            content: "$(x - 3)(x + 3)$",
                        },
                    ],
                },
                {
                    num: 2,
                    question: "Factorize $6x^2 + 9x$.",
                    questionUr: "تجزیه کریں: $6x^2 + 9x$۔",
                    marks: 2,
                    difficulty: "Easy",
                    steps: [
                        {
                            title: "Working",
                            content: "Find the common factor of $6x^2$ and $9x$, which is $3x$.",
                        },
                        {
                            title: "Working",
                            content: "Divide each term by $3x$: $2x + 3$.",
                        },
                        {
                            title: "Answer",
                            content: "$3x(2x + 3)$",
                        },
                    ],
                    stepsUr: [
                        {
                            title: "حل",
                            content: "$6x^2$ اور $9x$ کا مشترک عامل معلوم کریں، جو $3x$ ہے۔",
                        },
                        {
                            title: "حل",
                            content: "ہر جز کو $3x$ سے تقسیم کریں: $2x + 3$۔",
                        },
                        {
                            title: "جواب",
                            content: "$3x(2x + 3)$",
                        },
                    ],
                },
            ],
        },
    },
    "10": {
        slug: "quadratic-equations",
        title: "Quadratic Equations",
        summary:
            "A quadratic equation in $x$ has the form $ax^2 + bx + c = 0$. This chapter covers solving quadratic equations by factorization and by the quadratic formula.",
        summaryUr:
            "متغیر $x$ میں دو درجی مساوات $ax^2 + bx + c = 0$ کی صورت رکھتی ہے۔ اس باب میں دو درجی مساواتوں کو تجزیه اور دو درجی فارمولے سے حل کرنا سکھایا گیا ہے۔",
        formulas: [
            "Standard form: $ax^2 + bx + c = 0$, $a \\neq 0$.",
            "Quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.",
            "Discriminant $D = b^2 - 4ac$ decides the nature of the roots.",
        ],
        formulasUr: [
            "معیاری شکل: $ax^2 + bx + c = 0$، $a \\neq 0$۔",
            "دو درجی فارمولا: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$۔",
            "ممیز $D = b^2 - 4ac$ جڑوں کی نوعیت کا تعین کرتا ہے۔",
        ],
        definitions: [
            {
                term: "Quadratic equation",
                definition: "An equation of the form $ax^2 + bx + c = 0$, where $a \\neq 0$.",
                termUr: "دو درجی مساوات",
                definitionUr: "$ax^2 + bx + c = 0$ کی صورت کی مساوات، جہاں $a \\neq 0$۔",
            },
            {
                term: "Roots",
                definition: "The values of $x$ that satisfy a quadratic equation.",
                termUr: "جذریں",
                definitionUr: "متغیر $x$ کی وہ قمتیں جو دو درجی مساوات کو درست کریں۔",
            },
        ],
        exercise: {
            slug: "exercise-1-1",
            title: "Exercise 1.1",
            questions: [
                {
                    num: 1,
                    question: "Solve $x^2 - 5x + 6 = 0$ by factorization.",
                    questionUr: "تجزیه سے حل کریں: $x^2 - 5x + 6 = 0$۔",
                    marks: 3,
                    difficulty: "Medium",
                    steps: [
                        {
                            title: "Working",
                            content: "Find two numbers whose product is 6 and sum is $-5$: $-2$ and $-3$.",
                        },
                        {
                            title: "Working",
                            content: "Factorize: $(x - 2)(x - 3) = 0$.",
                        },
                        {
                            title: "Answer",
                            content: "So $x = 2$ or $x = 3$.",
                        },
                    ],
                    stepsUr: [
                        {
                            title: "حل",
                            content: "دو عدد تلاش کریں جن کا حاصل ضرب 6 اور مجموعہ $-5$ ہو: $-2$ اور $-3$۔",
                        },
                        {
                            title: "حل",
                            content: "تجزیه کریں: $(x - 2)(x - 3) = 0$۔",
                        },
                        {
                            title: "جواب",
                            content: "لہٰذا $x = 2$ یا $x = 3$۔",
                        },
                    ],
                },
                {
                    num: 2,
                    question: "Solve $2x^2 - 5x - 3 = 0$ using the quadratic formula.",
                    questionUr: "دو درجی فارمولے سے حل کریں: $2x^2 - 5x - 3 = 0$۔",
                    marks: 4,
                    difficulty: "Medium",
                    steps: [
                        {
                            title: "Working",
                            content: "Here $a = 2$, $b = -5$, $c = -3$, so $D = (-5)^2 - 4(2)(-3) = 25 + 24 = 49$.",
                        },
                        {
                            title: "Working",
                            content: "$x = \\frac{5 \\pm \\sqrt{49}}{4} = \\frac{5 \\pm 7}{4}$.",
                        },
                        {
                            title: "Answer",
                            content: "So $x = 3$ or $x = -\\frac{1}{2}$.",
                        },
                    ],
                    stepsUr: [
                        {
                            title: "حل",
                            content: "یہاں $a = 2$، $b = -5$، $c = -3$ ہیں، لہٰذا $D = (-5)^2 - 4(2)(-3) = 25 + 24 = 49$۔",
                        },
                        {
                            title: "حل",
                            content: "$x = \\frac{5 \\pm \\sqrt{49}}{4} = \\frac{5 \\pm 7}{4}$۔",
                        },
                        {
                            title: "جواب",
                            content: "لہٰذا $x = 3$ یا $x = -\\frac{1}{2}$۔",
                        },
                    ],
                },
            ],
        },
    },
    "11": {
        slug: "trigonometry",
        title: "Trigonometry",
        summary:
            "This chapter introduces trigonometric ratios for acute angles and the fundamental identities such as $\\sin^2\\theta + \\cos^2\\theta = 1$.",
        summaryUr:
            "اس باب میں حاد زاویوں کے لیے مثلثی نسبتیں اور بنیادی شناختیں جیسے $\\sin^2\\theta + \\cos^2\\theta = 1$ متعارف کرائی گئی ہیں۔",
        formulas: [
            "$\\sin\\theta = \\frac{\\text{opposite}}{\\text{hypotenuse}}$",
            "$\\cos\\theta = \\frac{\\text{adjacent}}{\\text{hypotenuse}}$",
            "$\\sin^2\\theta + \\cos^2\\theta = 1$ and $\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$.",
        ],
        formulasUr: [
            "$\\sin\\theta = \\frac{\\text{مقابل}}{\\text{وتر}}$",
            "$\\cos\\theta = \\frac{\\text{مجاور}}{\\text{وتر}}$",
            "$\\sin^2\\theta + \\cos^2\\theta = 1$ اور $\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$۔",
        ],
        definitions: [
            {
                term: "Trigonometry",
                definition: "The study of the relationships between the angles and the sides of a right triangle.",
                termUr: "مثلثیات",
                definitionUr: "قائم الزاویہ مثلث کے زاویوں اور اضلاع کے درمیان تعلقات کا مطالعہ۔",
            },
            {
                term: "Hypotenuse",
                definition: "The side opposite the right angle, the longest side of a right triangle.",
                termUr: "وتر",
                definitionUr: "قائم زاویے کے سامنے والا ضلع، قائم الزاویہ مثلث کا طویل ترین ضلع۔",
            },
        ],
        exercise: {
            slug: "exercise-1-1",
            title: "Exercise 1.1",
            questions: [
                {
                    num: 1,
                    question: "In a right triangle with $\\sin\\theta = \\frac{3}{5}$, find $\\cos\\theta$.",
                    questionUr: "قائم الزاویہ مثلث میں اگر $\\sin\\theta = \\frac{3}{5}$ ہو تو $\\cos\\theta$ معلوم کریں۔",
                    marks: 3,
                    difficulty: "Medium",
                    steps: [
                        {
                            title: "Working",
                            content: "Use $\\sin^2\\theta + \\cos^2\\theta = 1$: $\\cos^2\\theta = 1 - \\frac{9}{25}$.",
                        },
                        {
                            title: "Working",
                            content: "So $\\cos^2\\theta = \\frac{16}{25}$.",
                        },
                        {
                            title: "Answer",
                            content: "Hence $\\cos\\theta = \\frac{4}{5}$.",
                        },
                    ],
                    stepsUr: [
                        {
                            title: "حل",
                            content: "$\\sin^2\\theta + \\cos^2\\theta = 1$ استعمال کریں: $\\cos^2\\theta = 1 - \\frac{9}{25}$۔",
                        },
                        {
                            title: "حل",
                            content: "لہٰذا $\\cos^2\\theta = \\frac{16}{25}$۔",
                        },
                        {
                            title: "جواب",
                            content: "پس $\\cos\\theta = \\frac{4}{5}$۔",
                        },
                    ],
                },
                {
                    num: 2,
                    question: "Find $\\tan\\theta$ if $\\sin\\theta = \\frac{4}{5}$ and $\\cos\\theta = \\frac{3}{5}$.",
                    questionUr: "اگر $\\sin\\theta = \\frac{4}{5}$ اور $\\cos\\theta = \\frac{3}{5}$ ہوں تو $\\tan\\theta$ معلوم کریں۔",
                    marks: 2,
                    difficulty: "Easy",
                    steps: [
                        {
                            title: "Working",
                            content: "Use $\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$.",
                        },
                        {
                            title: "Answer",
                            content: "$\\tan\\theta = \\frac{4/5}{3/5} = \\frac{4}{3}$.",
                        },
                    ],
                    stepsUr: [
                        {
                            title: "حل",
                            content: "$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$ استعمال کریں۔",
                        },
                        {
                            title: "جواب",
                            content: "$\\tan\\theta = \\frac{4/5}{3/5} = \\frac{4}{3}$۔",
                        },
                    ],
                },
            ],
        },
    },
    "12": {
        slug: "functions-and-limits",
        title: "Functions and Limits",
        summary:
            "This chapter defines functions, their domain and range, and introduces the concept of limits, including evaluation by substitution and factorization.",
        summaryUr:
            "اس باب میں تابع، اس کا ڈومین اور رینج، اور حد کا تصور متعارف کرایا گیا ہے، جس میں براہِ راست بدلنے اور تجزیه کے ذریعے قیمت معلوم کرنا شامل ہے۔",
        formulas: [
            "Limit of a constant: $\\lim_{x \\to a} c = c$.",
            "$\\lim_{x \\to a} x = a$.",
            "If $\\lim_{x \\to a} f(x)$ and $\\lim_{x \\to a} g(x)$ exist, $\\lim (f \\pm g) = \\lim f \\pm \\lim g$.",
        ],
        formulasUr: [
            "مستقل کی حد: $\\lim_{x \\to a} c = c$۔",
            "$\\lim_{x \\to a} x = a$۔",
            "اگر $\\lim_{x \\to a} f(x)$ اور $\\lim_{x \\to a} g(x)$ موجود ہوں تو $\\lim (f \\pm g) = \\lim f \\pm \\lim g$۔",
        ],
        definitions: [
            {
                term: "Function",
                definition: "A rule that assigns to each input exactly one output.",
                termUr: "تابع",
                definitionUr: "ایک قاعدہ جو ہر جانے والی قدر کو بالکل ایک نتیجہ تفویض کرے۔",
            },
            {
                term: "Limit",
                definition: "The value a function approaches as the input approaches a given number.",
                termUr: "حد",
                definitionUr: "وہ قیمت جس کی طرف تابع اس وقت مرکز کرتی ہے جب جانے والی قدر کسی دیے گئے عدد کے قریب ہو۔",
            },
        ],
        exercise: {
            slug: "exercise-1-1",
            title: "Exercise 1.1",
            questions: [
                {
                    num: 1,
                    question: "Find $\\lim_{x \\to 2} (3x + 1)$.",
                    questionUr: "$\\lim_{x \\to 2} (3x + 1)$ معلوم کریں۔",
                    marks: 2,
                    difficulty: "Easy",
                    steps: [
                        {
                            title: "Working",
                            content: "Substitute $x = 2$ into the expression.",
                        },
                        {
                            title: "Working",
                            content: "$3(2) + 1 = 6 + 1 = 7$.",
                        },
                        {
                            title: "Answer",
                            content: "So the limit is 7.",
                        },
                    ],
                    stepsUr: [
                        {
                            title: "حل",
                            content: "اظہار میں $x = 2$ رکھیں۔",
                        },
                        {
                            title: "حل",
                            content: "$3(2) + 1 = 6 + 1 = 7$۔",
                        },
                        {
                            title: "جواب",
                            content: "لہٰذا حد 7 ہے۔",
                        },
                    ],
                },
                {
                    num: 2,
                    question: "Find $\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}$.",
                    questionUr: "$\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}$ معلوم کریں۔",
                    marks: 3,
                    difficulty: "Medium",
                    steps: [
                        {
                            title: "Working",
                            content: "Substitution gives $\\frac{0}{0}$, so factorize the numerator.",
                        },
                        {
                            title: "Working",
                            content: "$x^2 - 9 = (x-3)(x+3)$, and $x-3$ cancels.",
                        },
                        {
                            title: "Answer",
                            content: "$\\lim_{x \\to 3} (x+3) = 6$",
                        },
                    ],
                    stepsUr: [
                        {
                            title: "حل",
                            content: "براہِ راست عدد رکھنے سے $\\frac{0}{0}$ کی صورت ملتی ہے، لہٰذا شمار کنندہ کو تجزیه کریں۔",
                        },
                        {
                            title: "حل",
                            content: "$x^2 - 9 = (x-3)(x+3)$ اور $x-3$ حذف ہو جاتا ہے۔",
                        },
                        {
                            title: "جواب",
                            content: "$\\lim_{x \\to 3} (x+3) = 6$",
                        },
                    ],
                },
            ],
        },
    },
};

function buildLevelClass(levelSlug: string): Board["classes"][number] {
    const content = LEVEL_MATH_CONTENT[levelSlug];
    return {
        slug: levelSlug,
        title: `Class ${levelSlug}`,
        subjects: [
            {
                slug: "mathematics",
                title: "Mathematics",
                chapters: [
                    {
                        slug: content.slug,
                        title: content.title,
                        summary: content.summary,
                        summaryUr: content.summaryUr,
                        formulas: content.formulas,
                        formulasUr: content.formulasUr,
                        definitions: content.definitions,
                        exercises: [content.exercise],
                    },
                ],
            },
        ],
    };
}

for (const board of Object.values(BOARD_DATA)) {
    const classNine = board.classes.filter((klass) => klass.slug === "9");
    const levelClasses = LEVEL_CLASS_SLUGS.map((levelSlug) => buildLevelClass(levelSlug));
    board.classes = [...levelClasses.slice(0, 4), ...classNine, ...levelClasses.slice(4)];
}

let mutableBoardData: Record<string, Board> | null = null;

export function getMutableBoardData() {
  return mutableBoardData ?? BOARD_DATA;
}

export function setMutableBoardData(data: Record<string, Board>) {
  mutableBoardData = data;
}

export function getBoardBySlug(slug: string) {
    return getMutableBoardData()[slug] ?? null;
}

export function getBoardList(): BoardSummary[] {
  return Object.values(getMutableBoardData()).map(({ slug, title }) => ({ slug, title }));
}

export function getBoardCatalogSummaries() {
  return Object.values(getMutableBoardData()).map((board) => {
    let chapterCount = 0;
    for (const klass of board.classes) {
      for (const subject of klass.subjects) {
        chapterCount += subject.chapters.length;
      }
    }
    return {
      slug: board.slug,
      title: board.title,
      classCount: board.classes.length,
      chapterCount,
      ready: chapterCount > 0,
    };
  });
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
    const chapter = subject.chapters.find((ch) => ch.slug === chapterSlug);
    if (!chapter) return null;
    if (!isChapterPublished(boardSlug, classSlug, subjectSlug, chapterSlug)) {
        return null;
    }
    return chapter;
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
    {
        title: "Question 6",
        board: "FBISE",
        className: "Class 9",
        subject: "Mathematics",
        path: "/fbise/9/mathematics/real-numbers/exercise-1-1/q/6",
    },
    {
        title: "Question 7",
        board: "FBISE",
        className: "Class 9",
        subject: "Mathematics",
        path: "/fbise/9/mathematics/real-numbers/exercise-1-1/q/7",
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
