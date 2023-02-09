"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const decorators_1 = require("@nestjs/common/decorators");
const platform_express_1 = require("@nestjs/platform-express");
const path_1 = require("path");
const rxjs_1 = require("rxjs");
const jwt_guard_1 = require("../guards/jwt.guard");
const image_storage_1 = require("../helpers/image-storage");
const user_service_1 = require("../services/user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    uploadImage(file, req) {
        const fileName = file === null || file === void 0 ? void 0 : file.filename;
        if (!fileName) {
            return (0, rxjs_1.of)({
                error: "File must be an image with png/jpg/jpeg extension."
            });
        }
        const imageFolderPath = (0, path_1.join)(process.cwd(), "images");
        const fullImagePath = (0, path_1.join)(imageFolderPath, "/" + file.filename);
        return (0, image_storage_1.isFileExtensionSafe)(fullImagePath).pipe((0, rxjs_1.switchMap)((isFileLegit) => {
            if (isFileLegit) {
                const userId = req.user.id;
                return this.userService.updateUserImageById(userId, fileName);
            }
            (0, image_storage_1.removeFile)(fullImagePath);
            return (0, rxjs_1.of)({ error: "File content does not match extension!" });
        }));
    }
    findImage(req, res) {
        const userId = req.user.id;
        return this.userService.findImageNameByUserId(userId).pipe((0, rxjs_1.switchMap)((imageName) => {
            return (0, rxjs_1.of)(res.sendFile(imageName, { root: "./images" }));
        }));
    }
    findUserImageName(req, res) {
        const userId = req.user.id;
        return this.userService.findImageNameByUserId(userId).pipe((0, rxjs_1.switchMap)((imageName) => {
            return (0, rxjs_1.of)({ imageName });
        }));
    }
    findUserById(userStringId) {
        const userId = parseInt(userStringId);
        return this.userService.findUserById(userId);
    }
    sendConnection(receiverStringId, req) {
        const receiverId = parseInt(receiverStringId);
        return this.userService.sendFriendRequest(receiverId, req.user);
    }
};
__decorate([
    (0, decorators_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, decorators_1.Post)("upload"),
    (0, decorators_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", image_storage_1.saveImageToStorage)),
    __param(0, (0, decorators_1.UploadedFile)()),
    __param(1, (0, decorators_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "uploadImage", null);
__decorate([
    (0, decorators_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, decorators_1.Get)("image"),
    __param(0, (0, decorators_1.Request)()),
    __param(1, (0, decorators_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "findImage", null);
__decorate([
    (0, decorators_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, decorators_1.Get)("image-name"),
    __param(0, (0, decorators_1.Request)()),
    __param(1, (0, decorators_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "findUserImageName", null);
__decorate([
    (0, decorators_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, decorators_1.Get)(":userId"),
    __param(0, (0, decorators_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "findUserById", null);
__decorate([
    (0, decorators_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, decorators_1.Post)("friend-request/send/:receiverId"),
    __param(0, (0, decorators_1.Param)("receiverId")),
    __param(1, (0, decorators_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], UserController.prototype, "sendConnection", null);
UserController = __decorate([
    (0, common_1.Controller)("user"),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map