// ปรับคำขอให้ตรงกับ UpdateRequest struct ใน Backend
export interface UpdateUserRequest {
  name?: string;
  password?: string; // เพิ่มฟิลด์ password ตามที่ Backend มี
  bio?: string;
}

export interface UserPublicData {
  name: string;
  username: string; // เพิ่มฟิลด์ password ตามที่ Backend มี
  description: string;
}

export interface UserRegisterStat {
  name: string;
  username: string; // เพิ่มฟิลด์ password ตามที่ Backend มี
  description: string;
}