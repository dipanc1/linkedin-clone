import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-start-post',
  templateUrl: './start-post.component.html',
  styleUrls: ['./start-post.component.scss'],
})
export class StartPostComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();

  userFullImagePath: string;
  private userImagePathSubscription: Subscription;

  constructor(
    public modalController: ModalController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userImagePathSubscription =
      this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
        this.userFullImagePath = fullImagePath;
      });
  }

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  }

  async presentModal() {
    console.log('CREATE POST');
    const modal = await this.modalController.create({
      component: ModalComponent,
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();

    if (!data) {
      return;
    }

    this.create.emit(data.post.body);
  }
}
