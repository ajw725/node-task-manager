import { IUserDocument } from '../../src/models/user.model';

declare global {
  namespace Express {
    interface Request {
      user: IUserDocument;
      token: string;
    }
  }
}
