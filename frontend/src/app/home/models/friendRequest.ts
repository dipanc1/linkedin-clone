import { User } from 'src/app/auth/models/user.model';

export type FriendRequestStatusType =
  | 'not-sent'
  | 'waiting-for-current-user-response'
  | 'pending'
  | 'accepted'
  | 'declined';

export interface FriendRequestStatus {
  status?: FriendRequestStatusType;
}

export interface FriendRequest {
  id: number;
  creator: number;
  receiver: number;
  status?: FriendRequestStatusType;
}
