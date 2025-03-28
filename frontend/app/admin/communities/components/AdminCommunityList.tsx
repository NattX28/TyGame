import { Community } from "@/types/types";
import AdminCommunityCard from "./AdminCommunityCard";

const AdminCommunityList = ({ communities }: { communities: Community[] }) => {
  return (
    <div className="flex flex-wrap mt-8 bg-main mx-6 gap-2">
      {communities.map((community, index) => (
        <AdminCommunityCard key={index} community={community} />
      ))}
    </div>
  );
};
export default AdminCommunityList;
