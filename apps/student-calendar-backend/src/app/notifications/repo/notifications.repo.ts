import { messaging } from 'firebase-admin';
export class NotificationRepo {
  sendNotification(token: string, message: Record<string, any>) {
    return messaging().send({data: message, token});
  }
}
