import type { Request, Response } from 'express';

import Project from '../models/Project';

export class ProjectController {
  //* Create
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);

    // Assign a manager
    project.manager = req.user.id;

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
      const projects = await Project.find({
        $or: [
          { manager: { $in: req.user.id } }, // or you are the team manager
          { team: { $in: req.user.id } }, // or do you belong to the team
        ],
      }).populate('tasks');
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

      if (
        project.manager.toString() !== req.user.id.toString() &&
        !project.team.includes(req.user.id)
      ) {
        const error = new Error('Acción no valida.');
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

      if (project.manager.toString() !== req.user.id.toString()) {
        const error = new Error(
          'Solo el manager puede actualizar un proyecto.'
        );
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

      if (project.manager.toString() !== req.user.id.toString()) {
        const error = new Error('Solo el manager puede eliminar un proyecto.');
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
