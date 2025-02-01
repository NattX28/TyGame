import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PostCard from "@/components/post/PostCard";

const Feed = () => {
  return (
    <div className="flex flex-col h-full p-6">
      {/* <Card className="flex-grow">
        <CardHeader>
          <CardTitle>Welcome, Joji</CardTitle>
        </CardHeader>
        <CardDescription></CardDescription>
        <CardContent>
          <p>this is a Tygame, welcome to game world !!</p>
        </CardContent>
      </Card> */}
      <div className="bg-orange-400">
        <h2 className="text-lg font-bold">Hello Johny Doe</h2>
        <p>this is a Tygame, welcome to game world !!</p>
      </div>
      <PostCard />
    </div>
  );
};
export default Feed;
