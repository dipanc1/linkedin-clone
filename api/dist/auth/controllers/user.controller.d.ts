/// <reference types="multer" />
import { Observable } from "rxjs";
import { UpdateResult } from "typeorm";
import { UserService } from "../services/user.service";
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    uploadImage(file: Express.Multer.File, req: any): Observable<UpdateResult | {
        error: string;
    }>;
    findImage(req: any, res: any): Observable<Object>;
}
