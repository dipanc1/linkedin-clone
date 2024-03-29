import { Component, OnDestroy, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit, OnDestroy {
  userFullImagePath: string;
  fullName$ = new BehaviorSubject<string>(null);
  fullName = '';

  private userImagePathSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {
    this.authService.userFullName
      .pipe(take(1))
      .subscribe((fullName: string) => {
        this.fullName = fullName;
        this.fullName$.next(fullName);
      });

    this.userImagePathSubscription =
      this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
        this.userFullImagePath = fullImagePath;
      });
  }

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  }

  async onSignOut() {
    await this.popoverController.dismiss();
    this.authService.logout();
    location.reload();
  }
}
