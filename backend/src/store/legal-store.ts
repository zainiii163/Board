export type LegalPageSlug = "about" | "privacy" | "terms" | "copyright" | "educational-notice";

export type LocalizedText = { en: string; ur: string };
export type LocalizedParagraphs = { en: string[]; ur: string[] };

export type LegalCard = {
  title: LocalizedText;
  body: LocalizedText;
};

export type LegalPageRecord = {
  slug: LegalPageSlug;
  title: LocalizedText;
  paragraphs: LocalizedParagraphs;
  cards?: LegalCard[];
};

const pages: LegalPageRecord[] = [
  {
    slug: "about",
    title: { en: "About BoardNotes", ur: "BoardNotes کے بارے میں" },
    paragraphs: {
      en: [
        "BoardNotes helps students prepare for board exams through clean chapter summaries, worked exercises, and downloadable PDFs. The platform is designed to keep learning straightforward, structured, and exam-focused.",
      ],
      ur: [
        "BoardNotes طلباء کو بورڈ امتحانات کی تیاری میں باب کے خلاصے، حل شدہ مشقیں اور PDF فراہم کرتا ہے۔ سیکھنا سادہ، منظم اور امتحان مرکوز رکھنے کے لیے۔",
      ],
    },
    cards: [
      {
        title: { en: "Clear steps", ur: "واضح مراحل" },
        body: { en: "Every exercise is broken into simple working steps.", ur: "ہر مشق کو آسان کام کے مراحل میں تقسیم کیا گیا ہے۔" },
      },
      {
        title: { en: "Board coverage", ur: "بورڈ کوریج" },
        body: { en: "FBISE, Punjab, KPK, and Sindh resources in one place.", ur: "FBISE، پنجاب، KPK اور سندھ کے وسائل ایک جگہ۔" },
      },
      {
        title: { en: "Exam ready", ur: "امتحان کے لیے تیار" },
        body: { en: "Support for revision, quick learning, and practice.", ur: "دہرائی، فوری سیکھنے اور مشق کے لیے مدد۔" },
      },
    ],
  },
  {
    slug: "privacy",
    title: { en: "Privacy Policy", ur: "رازداری کی پالیسی" },
    paragraphs: {
      en: [
        "BoardNotes respects student privacy and does not sell personal data.",
        "We collect only the minimum information needed to improve study resources and support a smoother browsing experience.",
        "Usage data may be analysed in aggregate form to understand which resources are most useful.",
      ],
      ur: [
        "BoardNotes طلباء کی رازداری کا احترام کرتا ہے اور ذاتی ڈیٹا فروخت نہیں کرتا۔",
        "ہم صرف وہ معلومات جمع کرتے ہیں جو مطالعے کے وسائل بہتر بنانے کے لیے ضروری ہوں۔",
        "استعمال کا ڈیٹا مجموعی شکل میں تجزیہ کیا جا سکتا ہے۔",
      ],
    },
  },
  {
    slug: "terms",
    title: { en: "Terms of Use", ur: "استعمال کی شرائط" },
    paragraphs: {
      en: [
        "Content on BoardNotes is intended for educational and informational use.",
        "Users should not copy, redistribute, or republish study material without permission, especially paid or copyrighted resources.",
        "We may update these terms as the product evolves.",
      ],
      ur: [
        "BoardNotes کا مواد تعلیمی اور معلوماتی استعمال کے لیے ہے۔",
        "مواد بغیر اجازت کاپی یا دوبارہ شائع نہ کریں، خاص طور پر حقوق یافتہ وسائل۔",
        "پروڈکٹ کے ساتھ ان شرائط کو اپ ڈیٹ کیا جا سکتا ہے۔",
      ],
    },
  },
  {
    slug: "copyright",
    title: { en: "Copyright & Takedown Notice", ur: "کاپی رائٹ اور ہٹانے کا نوٹس" },
    paragraphs: {
      en: [
        "BoardNotes respects copyright and only hosts content when appropriate rights are available.",
        "If you believe any resource infringes your copyright, please contact the site admin with the relevant details for review and takedown.",
      ],
      ur: [
        "BoardNotes کاپی رائٹ کا احترام کرتا ہے اور صرف مناسب حقوق والے مواد کو ہوسٹ کرتا ہے۔",
        "اگر کوئی وسیلہ آپ کے حقوق کی خلاف ورزی کرتا ہے تو ایڈمن سے رابطہ کریں۔",
      ],
    },
  },
  {
    slug: "educational-notice",
    title: { en: "Educational notice", ur: "تعلیمی نوٹس" },
    paragraphs: {
      en: ["For study support only — not for sale of official textbooks."],
      ur: ["صرف مطالعے کے لیے — سرکاری کتابوں کی فروخت نہیں۔"],
    },
  },
];

export const legalStore = {
  list: () => pages.map(({ slug, title }) => ({ slug, title })),

  get: (slug: LegalPageSlug) => pages.find((p) => p.slug === slug) ?? null,

  update: (slug: LegalPageSlug, input: Partial<Omit<LegalPageRecord, "slug">>) => {
    const index = pages.findIndex((p) => p.slug === slug);
    if (index < 0) return null;
    pages[index] = { ...pages[index], ...input, slug };
    return pages[index];
  },
};
