export type CommentStatus = "pending" | "approved" | "rejected";

export type CommentRecord = {
  id: number;
  userId: number;
  userName: string;
  pagePath: string;
  questionRef: string;
  body: string;
  status: CommentStatus;
  createdAt: string;
};

let commentIdCounter = 2;

const comments: CommentRecord[] = [
  {
    id: 1,
    userId: 3,
    userName: "Student Demo",
    pagePath: "/fbise/9/mathematics/real-numbers/exercise-1-1/q/3",
    questionRef: "Real Numbers / Exercise 1.1 / Q3",
    body: "Can we also write 0.75 as 3/4 without the intermediate step over 100?",
    status: "approved",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

export const commentsStore = {
  listByPath: (pagePath: string, status?: CommentStatus) =>
    comments
      .filter((c) => c.pagePath === pagePath && (!status || c.status === status))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),

  listModeration: (status?: CommentStatus) =>
    [...comments]
      .filter((c) => !status || c.status === status)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),

  create: (input: Omit<CommentRecord, "id" | "status" | "createdAt">) => {
    const entry: CommentRecord = {
      id: commentIdCounter++,
      ...input,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    comments.push(entry);
    return entry;
  },

  setStatus: (id: number, status: CommentStatus) => {
    const comment = comments.find((c) => c.id === id);
    if (!comment) return null;
    comment.status = status;
    return comment;
  },

  delete: (id: number) => {
    const index = comments.findIndex((c) => c.id === id);
    if (index < 0) return false;
    comments.splice(index, 1);
    return true;
  },
};
