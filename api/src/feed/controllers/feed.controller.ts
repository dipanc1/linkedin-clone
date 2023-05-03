import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
  Request
} from "@nestjs/common";
import { Res, UseGuards } from "@nestjs/common/decorators";
import { Observable, take } from "rxjs";
import { Roles } from "../../auth/decorators/roles.decorator";
import { JwtGuard } from "../../auth/guards/jwt.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Role } from "../../auth/models/role.entity";
import { DeleteResult, UpdateResult } from "typeorm";
import { IsCreatorGuard } from "../guards/is-creator.guard";
import { FeedPost } from "../models/post.interface";
import { FeedService } from "../services/feed.service";

@Controller("feed")
export class FeedController {
  constructor(private feedService: FeedService) {}

  @Roles(Role.ADMIN, Role.PREMIUM)
  // @UseGuards(JwtGuard, RolesGuard)
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() feedPost: FeedPost, @Request() req): Observable<FeedPost> {
    return this.feedService.createPost(req.user, feedPost);
  }

  // @Get()
  // findAll(): Observable<FeedPost[]> {
  //     return this.feedService.findAllPosts();
  // }

  @UseGuards(JwtGuard)
  @Get()
  findSelected(
    @Query("take") take: number = 1,
    @Query("skip") skip: number = 1
  ): Observable<FeedPost[]> {
    take = take > 20 ? 20 : take;
    return this.feedService.findPosts(take, skip);
  }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Put(":id")
  update(
    @Param("id") id: number,
    @Body() feedPost: FeedPost
  ): Observable<UpdateResult> {
    return this.feedService.updatePost(id, feedPost);
  }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Delete(":id")
  delete(@Param("id") id: number): Observable<DeleteResult> {
    return this.feedService.deletePost(id);
  }

  @Get("image/:fileName")
  findImageByName(@Param("fileName") fileName: string, @Res() res) {
    if (!fileName || ["null", "[null]"].includes(fileName)) return;

    return res.sendFile(fileName, { root: "./images" });
  }
}
