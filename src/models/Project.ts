import mongoose, { Schema, Document, PopulatedDoc, Types } from 'mongoose';

import Note from '@/models/Note';
import { IUser } from '@/models/User';
import Task, { ITask } from '@/models/Task';

export interface IProject extends Document {
  projectName: string;
  clientName: string;
  description: string;
  tasks: PopulatedDoc<ITask & Document>[]; // le decimos que vamos almacenar aquí (referencia y la info de la task)
  manager: PopulatedDoc<IUser & Document>; // Only manager by project
  team: PopulatedDoc<IUser & Document>[];
}

const ProjectSchema = new Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    tasks: [
      {
        type: Types.ObjectId,
        ref: 'Task',
      },
    ],
    manager: {
      type: Types.ObjectId,
      ref: 'User',
    },
    team: [
      {
        type: Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

//* Middleware
ProjectSchema.pre(
  'deleteOne',
  {
    document: true,
  },
  async function () {
    const projectId = this._id;
    if (!projectId) return;

    const tasks = await Task.find({ project: projectId });

    for (const task of tasks) {
      await Note.deleteMany({ task: task.id });
    }

    await Task.deleteMany({ project: projectId });
  }
); // Before execute deleteOne (delete tasks related to project)

const Project = mongoose.model<IProject>('Project', ProjectSchema);
export default Project;
