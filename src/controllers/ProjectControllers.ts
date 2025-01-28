import type { Request, Response } from 'express';

import Project from '../models/Project';

export class ProjectController {
  //* Create
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);

    try {
      await project.save();
      res.send('Proyecto creado correctamente.');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error, revise los logs.' });
    }
  };

  //* Get all
  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({}).populate('tasks');
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error, revise los logs.' });
    }
  };

  //* Get by id
  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const project = await Project.findById(id).populate('tasks');

      if (!project) {
        const error = new Error('Proyecto no encontrado.');
        res.status(404).json({ error: error.message });
        return;
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error, revise los logs.' });
    }
  };

  //* Update
  static updateProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const project = await Project.findById(id);

      if (!project) {
        const error = new Error('Proyecto no encontrado.');
        res.status(404).json({ error: error.message });
        return;
      }

      project.projectName = req.body.projectName;
      project.clientName = req.body.clientName;
      project.description = req.body.description;

      await project.save();
      res.send('Proyecto Actualizado.');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error, revise los logs.' });
    }
  };

  //! Delete
  static deleteProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const project = await Project.findById(id);

      if (!project) {
        const error = new Error('Proyecto no encontrado.');
        res.status(404).json({ error: error.message });
        return;
      }

      await project.deleteOne();
      res.send('Proyecto Eliminado.');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error, revise los logs.' });
    }
  };
}
