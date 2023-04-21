import { User } from "src/auth/models/user.class";

export interface ActiveConversation {
  id?: number;
  socketId?: string;
  userId?: number;
  conversationId?: number;
}
