interface ProfileBioProps {
  bio?: string;
}

const ProfileBio = ({ bio }: ProfileBioProps) => {
  return (
    <div>
      <p className="whitespace-pre-line text-sm">{bio}</p>
    </div>
  );
};
export default ProfileBio;
