import { User } from "./user.interface";

export type FriendRequest_Status =
  | "not-sent"
  | "waiting-for-current-user-response"
  | "pending"
  | "accepted"
  | "declined";

export interface FriendRequestStatus {
  status?: FriendRequest_Status;
}

export interface FriendRequest {
  id: number;
  creator?: User;
  receiver?: User;
  status?: FriendRequest_Status;
}
