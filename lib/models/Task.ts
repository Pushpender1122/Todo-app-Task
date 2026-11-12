import mongoose, { Schema, Document, Model } from 'mongoose';
import { TaskPriority, TaskStatus } from '../types';

export interface ITaskDocument extends Document {
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  priority: TaskPriority;
  status: TaskStatus;
  weekStart: string;
  weekEnd: string;
  weekNumber: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITaskDocument>(
  {
    title: {
      type: String,
      required: [true, 'Task title is mandatory'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    date: {
      type: String,
      required: [true, 'Task date is mandatory'],
    },
    startTime: {
      type: String,
      default: '',
    },
    endTime: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['In Progress', 'Completed'],
      default: 'In Progress',
    },
    weekStart: {
      type: String,
      required: true,
    },
    weekEnd: {
      type: String,
      required: true,
    },
    weekNumber: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose model overwrite error during hot reload in Next.js
export const TaskModel: Model<ITaskDocument> =
  mongoose.models.Task || mongoose.model<ITaskDocument>('Task', TaskSchema);

