import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { map, Observable, switchMap } from "rxjs";
import { User } from "../../auth/models/user.class";
import { UserService } from "../../auth/services/user.service";
import { FeedPost } from "../models/post.interface";
import { FeedService } from "../services/feed.service";

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private feedService: FeedService
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params }: { user: User; params: { id: string } } = request;

    if (!user || !params) {
      return false;
    }

    if (user.role === "admin") {
      return true;
    } // allow to make get requests

    const userId = user.id;

    const feedId = parseInt(params.id);

    // Determine if the logged in user is same as the user that created the feed post
    return this.userService.findUserById(userId).pipe(
      switchMap((user: User) =>
        this.feedService.findPostById(feedId).pipe(
          map((feedPost: FeedPost[]) => {
            let isAuthor = user.id === feedPost[0].author.id;
            return isAuthor;
          })
        )
      )
    );
  }
}
