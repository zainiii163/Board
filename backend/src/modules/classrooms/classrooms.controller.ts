import type { Response, NextFunction } from "express";

import * as classroomsService from "./classrooms.service.js";
import type { AuthedRequest } from "../../middleware/auth.middleware.js";
import { ApiError } from "../../utils/api-error.js";

export const listMine = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const classrooms = await classroomsService.listClassroomsForUser(req.user.userId, req.user.role);
    res.json(classrooms);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const classroom = await classroomsService.createClassroom(req.user.userId, req.body ?? {});
    res.status(201).json(classroom);
  } catch (error) {
    next(error);
  }
};

export const join = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const classroom = await classroomsService.joinClassroom(req.user.userId, req.body?.joinCode ?? "");
    res.json(classroom);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const detail = await classroomsService.getClassroomDetail(
      Number(req.params.id),
      req.user.userId,
      req.user.role,
    );
    res.json(detail);
  } catch (error) {
    next(error);
  }
};

export const addAssignment = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const assignment = await classroomsService.createAssignment(
      Number(req.params.id),
      req.user.userId,
      req.user.role,
      req.body ?? {},
    );
    res.status(201).json(assignment);
  } catch (error) {
    next(error);
  }
};

export const removeAssignment = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const result = await classroomsService.deleteAssignment(
      Number(req.params.id),
      Number(req.params.assignmentId),
      req.user.userId,
      req.user.role,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const scores = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw ApiError.unauthorized();
    const rows = await classroomsService.getClassroomScores(
      Number(req.params.id),
      req.user.userId,
      req.user.role,
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
};
