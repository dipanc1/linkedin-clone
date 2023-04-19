import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { SocketIoConfig, Socket } from 'ngx-socket-io';

const config: SocketIoConfig = {
  url: environment.socketUrl,
  options: {
    transportOptions: {
      polling: {
        extraHeaders: {
          authorization: localStorage.getItem('CapacitorStorage.token'),
        },
      },
    },
  },
};

@Injectable({
  providedIn: 'root',
})

export class ChatSocketService extends Socket {
  constructor() {
    super(config);
  }
}
