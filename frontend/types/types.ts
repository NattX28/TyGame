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

export interface Post {
  ID: string;
  CommunityID: string;
  UserID: string;
  Content: string;
  Visibility: string;
  Image: string;
  CreatedAt: string;

  Comments: string;
  Likes: string;
}
