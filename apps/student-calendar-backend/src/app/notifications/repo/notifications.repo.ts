import { messaging } from 'firebase-admin';
export class NotificationRepo {
  sendNotification(token: string, message: Record<string, any>) {
    return messaging().send({ data: message, token });
  }

  sendNotificationToTopic(topic: string, message: Record<string, any>) {
    return messaging().send({ data: message, topic: `/topics/${topic}` });

  }

  subscribeToTopic(token: string, topic: string) {
    return messaging().subscribeToTopic(token, `/topics/${topic}`);
  }
}
