import * as firebase from "firebase-admin";

export function initializeFirebase() {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
  })
}
