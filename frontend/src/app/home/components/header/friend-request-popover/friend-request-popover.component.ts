import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { take, tap } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.model';
import { FriendRequest } from 'src/app/home/models/friendRequest';
import { ConnectionProfileService } from 'src/app/home/services/connection-profile.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-friend-request-popover',
  templateUrl: './friend-request-popover.component.html',
  styleUrls: ['./friend-request-popover.component.scss'],
})
export class FriendRequestPopoverComponent implements OnInit {
  constructor(
    private popoverController: PopoverController,
    public connectionProfileService: ConnectionProfileService
  ) {}

  ngOnInit() {
    this.connectionProfileService.friendRequests.map(
      (friendRequest: FriendRequest) => {
        const creatorId = (friendRequest as any)?.creator?.id;
        if (friendRequest && creatorId) {
          this.connectionProfileService
            .getConnectionUser(creatorId)
            .pipe(
              take(1),
              tap((user: User) => {
                friendRequest.fullImagePath = `${
                  environment.baseApiUrl
                }/feed/image/${user?.imagePath || 'blank-profile-picture.png'}`;
              })
            )
            .subscribe();
        }
      }
    );
  }

  async respondToFriendRequest(
    id: number,
    statusResponse: 'accepted' | 'declined'
  ) {
    const handledFriendRequest: FriendRequest =
      this.connectionProfileService.friendRequests.find(
        (friendRequest) => friendRequest.id === id
      );

    const unHandledFriendRequest: FriendRequest[] =
      this.connectionProfileService.friendRequests.filter(
        (friendRequest) => friendRequest.id !== handledFriendRequest.id
      );

    this.connectionProfileService.friendRequests = unHandledFriendRequest;

    if (this.connectionProfileService?.friendRequests) {
      await this.popoverController.dismiss();
    }

    return this.connectionProfileService
      .respondToFriendRequest(id, statusResponse)
      .pipe(take(1))
      .subscribe();
  }
}