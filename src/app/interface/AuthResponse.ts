import { User } from "./user";

export interface AuthResponse {
   token: string;
  type: string;
  user: User;
}
