import { User } from './user';

export interface LoggedInUser extends User {
  fullName?: string | null;
  activeRole?: string | null;
}
