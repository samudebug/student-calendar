import * as firebase from "firebase-admin";

export function initializeFirebase() {
  const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf-8'));
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    projectId: process.env.GOOGLE_CLOUD_PROJECT
  })
}
