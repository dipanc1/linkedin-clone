import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { User } from 'src/app/auth/models/user.model';
import { environment } from 'src/environments/environment';
import { ChatService } from '../../services/chat.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Message } from '../../models/Message';
import { Conversation } from '../../models/Conversation';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  @ViewChild('form') form: NgForm;

  userFullImagePath: string;
  userId: number;

  conversations$: Observable<Conversation[]>;
  conversations: Conversation[] = [];
  conversation: Conversation;

  newMessage$: Observable<string>;
  messages: Message[] = [];

  friends: User[] = [];
  friend: User;
  friend$: BehaviorSubject<User> = new BehaviorSubject<User>({});

  selectedConversationIndex = 0;

  url: string = environment.baseApiUrl;
  private userImagePathSubscription: Subscription;
  private userIdSubscription: Subscription;
  private conversationSubscription: Subscription;
  private newMessagesSubscription: Subscription;
  private friendsSubscription: Subscription;
  private friendSubscription: Subscription;
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

    this.userIdSubscription = this.authService.userId.subscribe(
      (userId: number) => {
        this.userId = userId;
      }
    );

    this.conversationSubscription = this.chatService
      .getConversations()
      .subscribe((conversations: Conversation[]) => {
        this.conversations.push(conversations[0]); //Note: from mergeMap stream
      });

    this.messageSubscription = this.chatService
      .getConversationMessages()
      .subscribe((messages: Message[]) => {
        messages.forEach((message: Message) => {
          const allMessageIds = this.messages.map((m: Message) => m.id);
          if (!allMessageIds.includes(message.id)) {
            this.messages.push(message);
          }
        });
      });

    this.newMessagesSubscription = this.chatService
      .getNewMessage()
      .subscribe((message: Message) => {
        message.createdAt = new Date();
        const allMessageIds = this.messages.map((m: Message) => m.id);
        if (!allMessageIds.includes(message.id)) {
          this.messages.push(message);
        }
      });

    this.friendSubscription = this.friend$.subscribe((friend: any) => {
      if (JSON.stringify(friend) !== '{}') {
        this.chatService.joinConversation(this.friend.id);
      }
    });

    this.friendsSubscription = this.chatService
      .getFriends()
      .subscribe((friends: User[]) => {
        this.friends = friends;

        if (friends.length > 0) {
          this.friend = this.friends[0];
          this.friend$.next(this.friend);

          friends.forEach((friend: User) => {
            this.chatService.createConversation(friend);
          });
          this.chatService.joinConversation(this.friend.id);
        }
      });
  }

  openConversation(friend: User, index: number): void {
    this.selectedConversationIndex = index;
    this.chatService.leaveConversation();

    this.friend = friend;
    this.friend$.next(this.friend);

    this.messages = [];
  }

  onSubmit() {
    const { message } = this.form.value;
    if (!message) {
      return;
    }

    const conversationUserIds = [this.userId, this.friend.id].sort();

    this.conversations.forEach((conversation: Conversation) => {
      const userIds = conversation.users.map((user: User) => user.id).sort();

      if (JSON.stringify(conversationUserIds) === JSON.stringify(userIds)) {
        this.conversation = conversation;
      }
    });

    this.chatService.sendMessage(message, this.conversation);
    this.form.reset();
  }

  deriveFullImagePath(user: User): string {
    const url = `${environment.baseApiUrl}/feed/image/`;

    if (user.id === this.userId) {
      return this.userFullImagePath;
    } else if (user.imagePath) {
      return url + user.imagePath;
    } else if (this.friend.imagePath) {
      return url + this.friend.imagePath;
    } else {
      return url + 'blank-profile-picture.png';
    }
  }

  ionViewDidLeave(): void {
    this.chatService.leaveConversation();

    this.userImagePathSubscription.unsubscribe();
    this.friendsSubscription.unsubscribe();
    this.messageSubscription.unsubscribe();
    this.userIdSubscription.unsubscribe();
    this.conversationSubscription.unsubscribe();
    this.newMessagesSubscription.unsubscribe();
    this.friendSubscription.unsubscribe();
  }
}
