import { Router } from "express";

export const catalogRouter = Router();

catalogRouter.get("/boards", (_request, response) => {
  response.json([
    {
      slug: "fbise",
      title: "Federal Board (FBISE)",
      classes: [{ slug: "9", title: "Class 9" }],
    },
  ]);
});
