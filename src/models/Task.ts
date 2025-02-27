import mongoose, { Schema, Document, Types } from 'mongoose';

import Note from '@/models/Note';

const taskStatus = {
  PENDING: 'pending',
  ON_HOLS: 'onHold',
  IN_PROGRESS: 'inProgress',
  UNDER_REVIEW: 'underReview',
  COMPLETED: 'completed',
} as const;

export type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus];

export interface ITask extends Document {
  name: string;
  description: string;
  project: Types.ObjectId;
  status: TaskStatus;
  completedBy: {
    user: Types.ObjectId;
    status: TaskStatus;
  }[];
  notes: Types.ObjectId[];
}

const TaskSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    project: {
      type: Types.ObjectId, // almacena la referencia (objectId) del proyecto
      ref: 'Project', // su referencia es el modelo de project
    },
    status: {
      type: String,
      enum: Object.values(taskStatus),
      default: taskStatus.PENDING,
    },
    completedBy: [
      {
        user: {
          type: Types.ObjectId,
          ref: 'User',
          default: null,
        },
        status: {
          type: String,
          enum: Object.values(taskStatus),
          default: taskStatus.PENDING,
        },
      },
    ],
    notes: [
      {
        type: Types.ObjectId,
        ref: 'Note',
      },
    ],
  },
  { timestamps: true }
);

//* Middleware
TaskSchema.pre(
  'deleteOne',
  {
    document: true,
  },
  async function () {
    const taskId = this._id;
    if (!taskId) return;

    await Note.deleteMany({ task: taskId });
  }
); // Before execute deleteOne (delete notes related to task)

const Task = mongoose.model<ITask>('Task', TaskSchema);
export default Task;
