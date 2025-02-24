import { User } from "@/types/types";
import ProfileFeed from "../components/ProfileFeed";
import ProfileHeader from "../components/ProfileHeader";

const profileData: User = {
  id: "67890",
  username: "deaththekid",
  email: "deaththekid@example.com",
  name: "Death the kid",
  role: "user",
  posts: 10,
  friends: 5,
  cookieVersion: 1,
  fullName: "Death the kid",
  bio: "บุคลิกลึกลับและมีเสน่ห์ในแบบของตัวเอง",
  imageName: "deaththekid.jpg",
  description: "เป็นตัวละครที่มีความลึกลับและเสน่ห์เฉพาะตัว.",
};

// wait to call api
const isFollowing = false;

const OtherUserProfile = () => {
  return (
    <div className="max-w-4xl mx-auto pt-16 pb-4 px-12 space-y-16">
      <ProfileHeader
        profile={profileData}
        isOwnProfile={false}
        isFollowing={isFollowing}
      />
      <div className="w-full bg-second h-[1px]"></div>
      <ProfileFeed profile={profileData} />
    </div>
  );
};
export default OtherUserProfile;
