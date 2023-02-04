import { Observable } from "rxjs";
import { Repository, UpdateResult } from "typeorm";
import { UserEntity } from "../models/user.entity";
import { User } from "../models/user.interface";
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<UserEntity>);
    findUserById(id: number): Observable<User>;
    updateUserImageById(id: number, imagePath: string): Observable<UpdateResult>;
    findImageNameByUserId(id: number): Observable<string>;
}
