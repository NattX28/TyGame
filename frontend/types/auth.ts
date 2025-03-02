export interface AuthResponse {
  authenticated: boolean;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

// export interface LoginResponse {
//   success: boolean;
//   message?: string;
//   user?: {
//     id: string;
//     username: string;
//     email: string;
//   };
// }

export interface LoginResponse {
  message?: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
}

export interface DecodedToken {
  userid: string;
  role: string;
  name: string;
  username: string;
}
