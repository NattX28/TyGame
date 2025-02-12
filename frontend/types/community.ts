export type CommunityCardProps = {
  commuID: number;
  name: string;
  description: string;
  members?: number;
  categoryID: number;
  category: string;
  image: string;
  created_at: Date;
};
