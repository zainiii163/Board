export type PortalCategory = {
  id: number;
  slug: string;
  name: string;
  nameUr: string;
  parentId: number | null;
  icon: string;
  gradient: string;
  imageUrl?: string | null;
  children?: PortalCategory[];
};

export type PortalResource = {
  id: number;
  slug: string;
  title: string;
  categoryId: number;
  board: string | null;
  classLabel: string | null;
  subject: string;
  author: string;
  description: string;
  fileUrl: string | null;
  coverUrl: string | null;
  sizeLabel: string;
  pages: number;
  downloads: number;
  addedAt: string;
  status?: string;
};

export type PortalTrailNode = {
  slug: string;
  name: string;
  nameUr: string;
};

export type PortalStats = {
  books: number;
  categories: number;
  users: number;
};

export type NavCategory = PortalCategory & { children: PortalCategory[] };