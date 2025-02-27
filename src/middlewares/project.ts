import type { Request, Response, NextFunction } from 'express';

import Project, { IProject } from '@/models/Project';

declare global {
  namespace Express {
    interface Request {
      project: IProject;
    }
  }
} // Las intefaces anides sus props si tiene el mismo nombre cosa que no pasa en types.

export const projectExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      const error = new Error('Proyecto no encontrado.');
      res.status(404).json({ error: error.message });
      return;
    }

    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error, revise los logs.' });
  }
};
