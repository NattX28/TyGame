import { createClient } from "@supabase/supabase-js";

const communityUrl = process.env.SUPABASE_URL_COMMUNITY!;
const communityAnonKey = process.env.SUPABASE_ANON_KEY_COMMUNITY!;

// ✅ Supabase Client สำหรับ Frontend (ใช้เฉพาะ Anon Key)

export const supabaseCommunityFrontend = createClient(
  communityUrl,
  communityAnonKey
);
