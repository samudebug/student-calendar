import { Injectable } from '@angular/core';
import { Messaging } from '@angular/fire/messaging';
import { environment } from '../../../environments/environment';
import { getToken } from 'firebase/messaging';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  hasPermission = false;
  constructor(private messaging: Messaging) { }

  requestPermission() {
    this.hasPermission = Notification.permission === "granted";
    if (!this.hasPermission) {

      Notification.requestPermission().then((result) => {
        this.hasPermission = result === 'granted';
      })
    }
  }
  getFcmToken() {
    if (this.hasPermission) return getToken(this.messaging, { vapidKey: environment.vapidKey });
    return;
  }

}
