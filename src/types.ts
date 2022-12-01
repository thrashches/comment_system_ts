import { User } from "./users.js";

type CommentType = {
  id: number;
  user: User;
  text: string;
  published: number;
  rating: number;
  favorited: boolean;
  replyTo: number | null;
};

export { CommentType };
