import { FeedPostEntity } from "../../feed/models/post.entity";
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { FriendRequestEntity } from "./friend-request.entity";
import { Role } from "./role.entity";
import { ConversationEntity } from "../../chat/models/conversation.entity";
import { MessageEntity } from "../../chat/models/message.entity";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  imagePath: string;

  @Column({ type: "enum", enum: Role, default: Role.USER })
  role: Role;

  @OneToMany(() => FeedPostEntity, feedPostEntity => feedPostEntity.author)
  feedPosts: FeedPostEntity[];

  @OneToMany(
    () => FriendRequestEntity,
    friendRequestEntity => friendRequestEntity.creator
  )
  sentFriendRequests: FriendRequestEntity[];

  @OneToMany(
    () => FriendRequestEntity,
    friendRequestEntity => friendRequestEntity.receiver
  )
  receivedFriendRequests: FriendRequestEntity[];

  @ManyToMany(
    () => ConversationEntity,
    conversationEntity => conversationEntity.users
  )
  conversations: ConversationEntity[];

  @OneToMany(() => MessageEntity, messageEntity => messageEntity.user)
  messages: MessageEntity[];
}
