import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/auth/models/user.model';
import { environment } from 'src/environments/environment';
import { ChatService } from '../../services/chat.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('form') form: NgForm;

  userFullImagePath: string;

  newMessage$: Observable<string>;
  messages: string[] = [];
  friends: User[] = [];
  url: string = environment.baseApiUrl;
  private userImagePathSubscription: Subscription;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userImagePathSubscription =
      this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
        this.userFullImagePath = fullImagePath;
      });

    this.chatService.getNewMessage().subscribe((message: string) => {
      this.messages.push(message);
    });

    this.chatService.getFriends().subscribe((friends: User[]) => {
      console.log(friends);
      this.friends = friends;
    });
  }

  onSubmit() {
    const { message } = this.form.value;
    if (!message) {
      return;
    }
    this.chatService.sendMessage(message);
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  }
}
