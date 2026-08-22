export type AuthorRecord = {
  id: number;
  slug: string;
  name: string;
  title: string;
  bio: string;
  boards: string[];
  noteCount: number;
};

let authorIdCounter = 3;

const authors: AuthorRecord[] = [
  {
    id: 1,
    slug: "ahmed-khan",
    name: "Ahmed Khan",
    title: "Mathematics Teacher",
    bio: "FBISE Class 9 Mathematics — step-by-step solutions aligned with board marking schemes.",
    boards: ["FBISE"],
    noteCount: 12,
  },
  {
    id: 2,
    slug: "sara-malik",
    name: "Sara Malik",
    title: "Senior Editor",
    bio: "Reviews and publishes contributor notes. Focus on clarity and exam-ready working.",
    boards: ["FBISE", "Punjab"],
    noteCount: 8,
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const authorsStore = {
  list: () => [...authors],

  getBySlug: (slug: string) => authors.find((a) => a.slug === slug) ?? null,

  create: (input: Omit<AuthorRecord, "id" | "slug" | "noteCount"> & { slug?: string }) => {
    const slug = input.slug?.trim() || slugify(input.name);
    if (authors.some((a) => a.slug === slug)) return null;
    const entry: AuthorRecord = {
      id: authorIdCounter++,
      slug,
      name: input.name.trim(),
      title: input.title.trim(),
      bio: input.bio.trim(),
      boards: input.boards,
      noteCount: 0,
    };
    authors.push(entry);
    return entry;
  },

  update: (slug: string, input: Partial<Omit<AuthorRecord, "id" | "slug">>) => {
    const index = authors.findIndex((a) => a.slug === slug);
    if (index < 0) return null;
    authors[index] = { ...authors[index], ...input };
    return authors[index];
  },

  delete: (slug: string) => {
    const index = authors.findIndex((a) => a.slug === slug);
    if (index < 0) return false;
    authors.splice(index, 1);
    return true;
  },
};
