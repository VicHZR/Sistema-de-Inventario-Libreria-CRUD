export type UserRole = 'ADMIN' | 'VISITOR';

export interface User {
  username: string;
  role: UserRole;
}