// User
export interface User {
  username?: string;
  email?: string;
  fullName?: string;
  avatar?: string;
  posts?: number;
  friends?: number;
  bio?: string;
}

// community
export interface Community {
  commuID: number;
  name: string;
  description: string;
  members?: number;
  categoryID: number;
  category: string;
  image: string;
  created_at: Date;
}

// Type definition for auth response
export interface AuthResponse {
  authenticated: boolean;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}
