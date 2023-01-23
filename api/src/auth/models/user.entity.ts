import { FeedPostEntity } from "src/feed/models/post.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";

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
}
