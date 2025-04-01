//// User-services Category
// User
export interface User {
  id: string;
  name: string;
  username: string;
  description?: string;
}

export interface UserFullAccess {
  id: string;
  name: string;
  username: string;
  banned?: boolean;
  role?: "User" | "Admin" | "Super Admin";
  reason?: string;
  timestamp?: number;
  description?: string;
}

//Friends
export interface Friend {
  userid: string;
  name: string;
  username: string;
}

//// Community-services Category
// Community
export interface Community {
  uuid: string;
  name: string;
  description: string;
  category: string;
  image: string;
  member_count: number;
}

// CommunityMember
export interface CommunityMember {
  UserID: string;
  CommunityID: string;
  CreatedAt: Date;
  Community: Community;
}
// ReqCommunityForm
export interface ReqCommunityForm {
  uuid?: string;
  name: string;
  description: string;
  category: string;
  image?: File;
  imageUrl?: string;
}

//// Post-services Category
// Post
export interface Post {
  uuid: string;
  community_id: string;
  user_id: string;
  content: string;
  visibility: string;
  image?: string;
  score: number;
  liked: boolean;
  likes?: number;
  comments?: number;
  timestamp: number;
}

export interface StatPost {
  community_id: string;
  post_amount: number;
  community_name?: string;
}

// EditPostRequest
export interface EditPostRequest {
  ID: string;
  Content: string;
}

export interface EditPostResponse {
  postID: string;
  Content: string;
  Image: string;
}

// Comment
export interface Comment {
  ID: string;
  PostID: string;
  UserID: string;
  Content: string;
  Timestamp: number;
  LikeCount?: number;
  Post?: Post;
  Likes?: Like[];
  User?: User;
  Liked: boolean;
}

export interface CommentFormReq {
  Content: string;
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

export interface StatRegister {
  month: string;
  count: number;
}

//Can't use yet
export interface BannedUser {
  userid: string;
  reason: string;
  timestamp: number;
}

export interface PartyResponse {
  party_id: string;
  current_members: number;
  max_slots: number;
  community_id: string;
}

// chatMessage

export interface ChatMessage {
  id: number;
  room_id: string;
  sender_id: string;
  content: string;
  timestamp: number;
}

export interface Message {
  type: string;
  senderID: string;
  senderName: string;
  content: string;
}

export interface Room {
  room_id: string;
  is_group: boolean;
  room_name: string;
  image_room: string;
  last_message: string;
  timestamp: number;
  user?: User;
}

export interface ChatRoomFocus {
  room_id: string;
  is_group: boolean;
  room_name: string;
}
export interface RecentRoom {
  room_id: string;
  is_group: boolean;
  room_name: string;
  image_room: string;
  last_message: string;
  timestamp: number;
}
export interface UserProfile {
  id: string | null;
  name: string;
  bio: string; // เปลี่ยนจาก bio เป็น description ตาม Backend
  image_name?: string; // เพิ่มฟิลด์สำหรับชื่อไฟล์รูปภาพ
}
