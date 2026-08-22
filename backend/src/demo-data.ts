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
};

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
