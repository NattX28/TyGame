import { Community } from "@/types/types";
import AdminCommunityCard from "./AdminCommunityCard";

const AdminCommunityList = ({ communities }: { communities: Community[] }) => {
  return (
    <div className="grid grid-cols-4 px-6 mt-8 bg-main">
      {communities.map((community, index) => (
        <AdminCommunityCard key={index} community={community} />
      ))}
    </div>
  );
};
export default AdminCommunityList;
