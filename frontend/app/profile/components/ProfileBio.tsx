interface ProfileBioProps {
  fullName?: string;
  bio?: string;
}

const ProfileBio = ({ fullName, bio }: ProfileBioProps) => {
  return (
    <div>
      <h2 className="font-semibold">{fullName}</h2>
      <p className="whitespace-pre-line text-sm">{bio}</p>
    </div>
  );
};
export default ProfileBio;
