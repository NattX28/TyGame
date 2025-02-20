import ProfileFeed from "../components/ProfileFeed";
import ProfileHeader from "../components/ProfileHeader";

const profileData = {
  username: "deathThe_Kid11",
  fullName: "Death the kid",
  avatar: "/api/placeholder/150/150",
  posts: 24,
  friends: 242,
  bio: "Soul Eater Effect 📸\nSymmetric 🌎\nContact: dthekid@example.com",
};

const OtherUserProfile = () => {
  return (
    <div className="max-w-4xl mx-auto pt-16 pb-4 px-12 space-y-16">
      <ProfileHeader
        profile={profileData}
        btnText={"Add Friend"}
        btnIcon={"user-round-plus"}
      />
      <div className="w-full bg-second h-[1px]"></div>
      <ProfileFeed profile={profileData} />
    </div>
  );
};
export default OtherUserProfile;
