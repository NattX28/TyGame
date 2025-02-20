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
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <ProfileHeader profile={profileData} />
      <ProfileFeed />
    </div>
  );
};
export default Profile;
