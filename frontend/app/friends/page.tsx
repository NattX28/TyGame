import FriendList from "./components/FriendList";

const FriendsPage = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">All my friends</h1>
      <FriendList />
    </div>
  );
};
export default FriendsPage;
