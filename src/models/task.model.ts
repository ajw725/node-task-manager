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
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

export interface ITaskDocument extends Document {
  description: string;
  completed: boolean;
  userId: string;
}

interface ITaskModel extends Model<ITaskDocument> {}

export const Task = model<ITaskDocument, ITaskModel>('Task', taskSchema);
