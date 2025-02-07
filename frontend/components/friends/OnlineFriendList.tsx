import OnlineFriend from "./OnlineFriend";

const friends = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "/avatars/alice.jpg",
    isOnline: true,
  },
  {
    id: 2,
    name: "Bob Smith",
    avatar: "/avatars/bob.jpg",
    isOnline: true,
  },
  {
    id: 3,
    name: "Charlie Brown",
    avatar: "/avatars/charlie.jpg",
    isOnline: true,
  },
  {
    id: 4,
    name: "David White",
    avatar: "/avatars/david.jpg",
    isOnline: true,
  },
  {
    id: 5,
    name: "Emma Wilson",
    avatar: "/avatars/emma.jpg",
    isOnline: true,
  },
  {
    id: 6,
    name: "Frank Harris",
    avatar: "/avatars/frank.jpg",
    isOnline: true,
  },
  {
    id: 7,
    name: "Grace Martin",
    avatar: "/avatars/grace.jpg",
    isOnline: true,
  },
  {
    id: 8,
    name: "Henry Clark",
    avatar: "/avatars/henry.jpg",
    isOnline: true,
  },
  {
    id: 9,
    name: "Isabella Young",
    avatar: "/avatars/isabella.jpg",
    isOnline: true,
  },
  {
    id: 10,
    name: "Jack Walker",
    avatar: "/avatars/jack.jpg",
    isOnline: true,
  },
  {
    id: 11,
    name: "Karen Hall",
    avatar: "/avatars/karen.jpg",
    isOnline: true,
  },
  {
    id: 12,
    name: "Leo Allen",
    avatar: "/avatars/leo.jpg",
    isOnline: true,
  },
  {
    id: 13,
    name: "Mia Scott",
    avatar: "/avatars/mia.jpg",
    isOnline: true,
  },
  {
    id: 14,
    name: "Nathan King",
    avatar: "/avatars/nathan.jpg",
    isOnline: true,
  },
  {
    id: 15,
    name: "Olivia Green",
    avatar: "/avatars/olivia.jpg",
    isOnline: true,
  },
  {
    id: 16,
    name: "Paul Adams",
    avatar: "/avatars/paul.jpg",
    isOnline: true,
  },
  {
    id: 17,
    name: "Quinn Baker",
    avatar: "/avatars/quinn.jpg",
    isOnline: true,
  },
  {
    id: 18,
    name: "Rachel Gonzalez",
    avatar: "/avatars/rachel.jpg",
    isOnline: true,
  },
  {
    id: 19,
    name: "Sam Carter",
    avatar: "/avatars/sam.jpg",
    isOnline: true,
  },
  {
    id: 20,
    name: "Tina Turner",
    avatar: "/avatars/tina.jpg",
    isOnline: true,
  },
];

const OnlineFriendList = () => {
  return (
    <div>
      <ul className="space-y-2">
        {friends.map((friend) => (
          <li key={friend.id}>
            <OnlineFriend friend={friend} />
          </li>
        ))}
      </ul>
    </div>
  );
};
export default OnlineFriendList;
