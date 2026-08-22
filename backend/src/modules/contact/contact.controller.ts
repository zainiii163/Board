import type { Response, NextFunction } from "express";

import * as contactService from "./contact.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";

export const list = async (_req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const messages = await contactService.listContactMessages();
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email, message } = req.body ?? {};
    const entry = await contactService.createContactMessage({ name, email, message });
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
};
