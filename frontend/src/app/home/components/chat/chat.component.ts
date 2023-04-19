import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { User } from 'src/app/auth/models/user.model';
import { environment } from 'src/environments/environment';
import { ChatService } from '../../services/chat.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  @ViewChild('form') form: NgForm;

  userFullImagePath: string;

  newMessage$: Observable<string>;
  messages: string[] = [];

  friends: User[] = [];
  friend: User;
  friend$: BehaviorSubject<User> = new BehaviorSubject<User>({});

  selectedConversationIndex = 0;

  url: string = environment.baseApiUrl;
  private userImagePathSubscription: Subscription;
  private friendsSubscription: Subscription;
  private messageSubscription: Subscription;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ionViewDidEnter() {
    this.userImagePathSubscription =
      this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
        this.userFullImagePath = fullImagePath;
      });

    this.messageSubscription = this.chatService
      .getNewMessage()
      .subscribe((message: string) => {
        this.messages.push(message);
      });

    this.friendsSubscription = this.chatService
      .getFriends()
      .subscribe((friends: User[]) => {
        console.log(friends);
        this.friends = friends;
      });
  }

  openConversation(friend: User, index: number): void {
    this.selectedConversationIndex = index;

    this.friend = friend;
    this.friend$.next(this.friend);
  }

  onSubmit() {
    const { message } = this.form.value;
    if (!message) {
      return;
    }
    this.chatService.sendMessage(message);
    this.form.reset();
  }

  ionViewDidLeave(): void {
    this.userImagePathSubscription.unsubscribe();
    this.friendsSubscription.unsubscribe();
    this.messageSubscription.unsubscribe();
  }
}
