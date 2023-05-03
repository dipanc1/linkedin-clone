import { FeedPostEntity } from "../../feed/models/post.entity";
import { FriendRequestEntity } from "./friend-request.entity";
import { Role } from "./role.entity";
import { ConversationEntity } from "../../chat/models/conversation.entity";
import { MessageEntity } from "../../chat/models/message.entity";
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
    messages: MessageEntity[];
}
