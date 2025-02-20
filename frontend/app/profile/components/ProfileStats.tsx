interface ProfileStatsProps {
  posts: number;
  friends: number;
}

export const ProfileStats = ({ posts, friends }: ProfileStatsProps) => {
  return (
    <div className="flex gap-8">
      <StatItem label="posts" value={posts} />
      <StatItem label="friends" value={friends} />
    </div>
  );
};

const StatItem = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="text-center">
      <span className="font-semibold">{value}</span>
      <p className="text-sm">{label}</p>
    </div>
  );
};
