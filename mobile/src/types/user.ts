export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
