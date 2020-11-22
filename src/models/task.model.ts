import { Schema, model, Document, Model } from 'mongoose';

const taskSchema = new Schema({
  description: {
    type: String,
    required: [true, 'You must provide a task description'],
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

export interface ITaskDocument extends Document {
  description: string;
  completed: boolean;
  user: string;
}

interface ITaskModel extends Model<ITaskDocument> {}

export const Task = model<ITaskDocument, ITaskModel>('Task', taskSchema);
