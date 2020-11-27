import Mongoose from 'mongoose';

const dbUrl = process.env.MONGODB_URL!;

Mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
