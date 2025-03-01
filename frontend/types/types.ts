//// User-services Category
// User
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  posts: number;
  friends: number;
  fullName?: string;
  bio?: string;
  imageName?: string;
  cookieVersion?: number;
  description?: string;
}
//Friends
export interface Friend {
  id: string;
  userid: string;
  friendid: string;
}

//// Community-services Category
// Community
export interface Community {
  uuid: string;
  name: string;
  description: string;
  category: string;
  image?: string;
  members?: number;
}
// CommunityMember
export interface CommunityMember {
  UserID: string;
  CommunityID: string;
  CreatedAt: Date;
  Community: Community;
}
// CreateCommunityForm
export interface CreateCommunityForm {
  name: string;
  description: string;
  category: string;
  image: string;
}

//// Post-services Category
// Post
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

// EditPostRequest
export interface EditPostRequest {
  ID: string;
  Content: string;
}

// Comment
export interface Comment {
  ID: string;
  PostID: string;
  UserID: string;
  Content: string;
  CreatedAt: Date;
  post: Post;
  Likes: Like[];
}

export interface CommentFormReq {
  Content: string;
}

export interface CommentFormRes {
  ID: string;
  UserID: string;
  Content: string;
  CreatedAt: Date;
  Likecount: number;
}

//Like
export interface Like {
  ID: string;
  UserID: string;
  PostID: string;
  CommentID: string;
  CreatedAt: Date;

  Post: Post;
  Comment: Comment;
}

//FeedPost
export interface FeedPost {
  CommunityID: string;
  UserID: string;
  Content: string;
  Visibility: string;
  Image: string;
  Score?: number;
  CreatedAt: string;
}

////Party-services Category
// PartyStatus
export type PartyStatus = "OPEN" | "FULL" | "CLOSED";

// Party
export interface Party {
  id: number;
  status: PartyStatus;
  maxSlots: number;
  createdAt: string;
  members: PartyMember[];
}

// PartyMember
export interface PartyMember {
  partyId: number;
  userId: string;
  joinedAt: Date;
}

//Can't use yet
export interface BannedUser {
  userid: string;
  time: Date;
}

export interface PartyResponse {
  party_id: string;
  current_members: number;
  max_slots: number;
}

// chatMessage

export interface ChatMessage {
  username: string;
  content: string;
}
