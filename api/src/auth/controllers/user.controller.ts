import { Controller } from "@nestjs/common";
import {
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  Get,
  Res
} from "@nestjs/common/decorators";
import { FileInterceptor } from "@nestjs/platform-express";
import { join } from "path";
import { Observable, of, switchMap } from "rxjs";
import { UpdateResult } from "typeorm";
import { JwtGuard } from "../guards/jwt.guard";
import {
  isFileExtensionSafe,
  removeFile,
  saveImageToStorage
} from "../helpers/image-storage";
import { UserService } from "../services/user.service";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Post("upload")
  @UseInterceptors(FileInterceptor("file", saveImageToStorage))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ): Observable<UpdateResult | { error: string }> {
    const fileName = file?.filename;

    if (!fileName) {
      return of({
        error: "File must be an image with png/jpg/jpeg extension."
      });
    }

    const imageFolderPath = join(process.cwd(), "images");
    const fullImagePath = join(imageFolderPath, "/" + file.filename);

    return isFileExtensionSafe(fullImagePath).pipe(
      switchMap((isFileLegit: boolean) => {
        if (isFileLegit) {
          const userId = req.user.id;
          return this.userService.updateUserImageById(userId, fileName);
        }
        removeFile(fullImagePath);
        return of({ error: "File content does not match extension!" });
      })
    );
  }

  @UseGuards(JwtGuard)
  @Get("image")
  findImage(@Request() req, @Res() res): Observable<Object> {
    const userId = req.user.id;
    return this.userService.findImageNameByUserId(userId).pipe(
      switchMap((imageName: string) => {
        return of(res.sendFile(imageName, { root: "./images" }));
      })
    );
  }
}