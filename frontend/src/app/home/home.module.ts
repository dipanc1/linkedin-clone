import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { PopoverComponent } from './components/header/popover/popover.component';
import { ProfileSummaryComponent } from './components/profile-summary/profile-summary.component';
import { StartPostComponent } from './components/start-post/start-post.component';
import { AdvertisingComponent } from './components/advertising/advertising.component';
import { ModalComponent } from './components/start-post/modal/modal.component';
import { AllPostsComponent } from './components/all-posts/all-posts.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { ConnectionProfileComponent } from './components/connection-profile/connection-profile.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { FriendRequestPopoverComponent } from './components/header/friend-request-popover/friend-request-popover.component';
import { ChatComponent } from './components/chat/chat.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
  declarations: [
    HomePage,
    HeaderComponent,
    PopoverComponent,
    ProfileSummaryComponent,
    StartPostComponent,
    AdvertisingComponent,
    PopoverComponent,
    ModalComponent,
    ConnectionProfileComponent,
    AllPostsComponent,
    TabsComponent,
    UserProfileComponent,
    FriendRequestPopoverComponent,
    ChatComponent,
  ],
})
export class HomePageModule {}
