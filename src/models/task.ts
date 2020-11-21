import Mongoose from 'mongoose';

const taskSchema = new Mongoose.Schema({
  description: {
    type: String,
    required: [true, 'You must provide a task description'],
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});
const Task = Mongoose.model('Task', taskSchema);
