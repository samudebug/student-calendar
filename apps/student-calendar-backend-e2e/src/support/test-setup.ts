/* eslint-disable */

import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, createUserWithEmailAndPassword, getAuth, getIdToken, signInWithEmailAndPassword, signOut } from 'firebase/auth';

module.exports = async function () {
  // Configure axios for tests to use.
  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ?? '3333';
  axios.defaults.baseURL = `http://${host}:${port}`;
  // this is to prevent it from throwing errors on failed requests
  axios.defaults.validateStatus = status => status >= 200 && status < 500
  const config = JSON.parse(Buffer.from(process.env.FIREBASE_WEB_CONFIG, 'base64').toString('utf-8'));
  initializeApp(config);
  const auth = getAuth();
  connectAuthEmulator(auth, process.env.FIREBASE_AUTH_HOST);
  if (!globalThis.loggedIn) {
    const testEmail = "test@email.com";
    const testPassword = "test123";
    const altTestEmail = "alt_test@email.com";
    const altTestPassword = "test123";
    try {
      await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    } catch (error) {
      if (error.code !== "auth/email-already-in-use") {
        console.log(error);
        throw error;
      }
    }
    await signOut(auth);

    try {
      await createUserWithEmailAndPassword(auth, altTestEmail, altTestPassword);
    } catch (error) {
      if (error.code !== "auth/email-already-in-use") {
        console.log(error);

        throw error;
      }
    }

  }
  axios.interceptors.request.use(async (config) => {
    if (auth.currentUser) {
      const token = await getIdToken(auth.currentUser);
      config.headers.Authorization = token;
    }
    return config;
  })
};
