import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Feed = () => {
  return (
    <div className="flex flex-col h-full p-6">
      <Card className="flex-grow">
        <CardHeader>
          <CardTitle>Welcome, Joji</CardTitle>
        </CardHeader>
        <CardDescription></CardDescription>
        <CardContent>
          <p>this is a Tygame, welcome to game world !!</p>
        </CardContent>
      </Card>
    </div>
  );
};
export default Feed;
