import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  signOut,
  user,
  User,
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,

} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { signInWithEmailAndPassword, updateProfile, getIdToken } from 'firebase/auth';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = user(this.auth);

  constructor(
    private auth: Auth,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    authState(auth).subscribe((user: User | null) => {
      if (user) {
        return this.router.navigate(['classes']);
      }
      return this.router.navigate(['/login']);
    });
  }

  async login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error: any) {
      const errorCode = error.code;
      if (errorCode === AuthErrorCodes.INVALID_EMAIL) {
        this.snackBar.open('This email is invalid', undefined, {
          duration: 3000,
        });
        return;
      }
      if (errorCode === AuthErrorCodes.INVALID_PASSWORD) {
        this.snackBar.open('The password is incorrect', undefined, {
          duration: 3000,
        });
        return;
      }
      this.snackBar.open('An error has ocurred', undefined, { duration: 3000 });
    }
  }

  async register(name: string, email: string, password: string) {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      const user = await firstValueFrom(this.user$);
      if (!user) return;
      await updateProfile(user, { displayName: name });
    } catch (error: any) {
      const errorCode = error.code;
      if (errorCode === AuthErrorCodes.INVALID_EMAIL) {
        this.snackBar.open('This email is invalid', undefined, {
          duration: 3000,
        });
        return;
      }
      if (errorCode === AuthErrorCodes.INVALID_PASSWORD) {
        this.snackBar.open('The password is incorrect', undefined, {
          duration: 3000,
        });
        return;
      }
      if (errorCode === AuthErrorCodes.EMAIL_EXISTS) {
        this.snackBar.open('This email is already in use', undefined, {
          duration: 3000,
        });
        return;
      }
      this.snackBar.open('An error has ocurred', undefined, { duration: 3000 });
    }
  }

  async logout() {
    await signOut(this.auth);
  }

  async sendResetPasswordEmail(email: string) {
    await sendPasswordResetEmail(this.auth,email);
  }

  async fetchIdToken() {
    const user = await firstValueFrom(this.user$);
    if (!user) return;
    return getIdToken(user);
  }
}
