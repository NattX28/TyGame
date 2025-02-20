import ProfileFeed from "./components/ProfileFeed";
import ProfileHeader from "./components/ProfileHeader";

// Mock Data
const profileData = {
  username: "johndoe",
  fullName: "John Doe",
  avatar: "/api/placeholder/150/150",
  posts: 248,
  friends: 2342,
  bio: "Digital creator 📸\nExploring the world 🌎\nContact: john@example.com",
};
const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto pt-16 px-12 space-y-16">
      <ProfileHeader profile={profileData} />
      <div className="w-full bg-second h-[1px]"></div>
      <ProfileFeed />
    </div>
  );
};
export default Profile;
