import { FeedPost } from "src/feed/models/post.interface";
import { Role } from "./role.entity";
export declare class User {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    imagePath?: string;
    role?: Role;
    posts?: FeedPost[];
}
