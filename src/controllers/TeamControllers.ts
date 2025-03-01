import type { Request, Response } from 'express';

import User from '@/models/User';
import Project from '@/models/Project';

export class TeamMemberController {
  static findMemberByEmail = async (req: Request, res: Response) => {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('id email name');

    if (!user) {
      const error = new Error('Usuario no encontrado');
      res.status(404).json({ error: error.message });
      return;
    }

    res.json(user);
  };

  static getProjectTeam = async (req: Request, res: Response) => {
    const project = await Project.findById(req.project.id).populate({
      path: 'team',
      select: 'id email name',
    });

    res.json(project.team);
  };

  static addMemberById = async (req: Request, res: Response) => {
    const { id } = req.body;
    const { projectId } = req.params;

    // Find project and user
    const user = await User.findById({ _id: id }).select('id');
    const project = await Project.findById({ _id: projectId });

    if (project.manager.toString() === user.id.toString()) {
      const error = new Error(
        'El manager no puede ser agregado como colaborador'
      );
      res.status(404).json({ error: error.message });
      return;
    }

    if (!user) {
      const error = new Error('Usuario no encontrado');
      res.status(404).json({ error: error.message });
      return;
    }

    if (
      req.project.team.some((team) => team.toString() === user.id.toString())
    ) {
      const error = new Error('El usuario ya existe en el proyecto');
      res.status(409).json({ error: error.message });
      return;
    }

    req.project.team.push(user.id);
    await req.project.save();

    res.send('Usuario agregado correctamente.');
  };

  static removeMemberById = async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!req.project.team.some((team) => team.toString() === userId)) {
      const error = new Error('El usuario no existe en el proyecto');
      res.status(409).json({ error: error.message });
      return;
    }

    req.project.team = req.project.team.filter(
      (teamMember) => teamMember.toString() !== userId
    );

    await req.project.save();
    res.send('Usuario eliminado correctamente.');
  };
}
