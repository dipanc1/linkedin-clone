import { FeedPostEntity } from "../../feed/models/post.entity";
import { FriendRequestEntity } from "./friend-request.entity";
import { Role } from "./role.entity";
import { ConversationEntity } from "src/chat/models/conversation.entity";
export declare class UserEntity {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    imagePath: string;
    role: Role;
    feedPosts: FeedPostEntity[];
    sentFriendRequests: FriendRequestEntity[];
    receivedFriendRequests: FriendRequestEntity[];
    conversations: ConversationEntity[];
}
