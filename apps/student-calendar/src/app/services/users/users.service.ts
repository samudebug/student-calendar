import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private api: ApiService) { }

  updateUserInfo(user: Partial<{name: string,  photoUrl: string, fcmToken: string}>) {
    return this.api.patch('/users/me', user);
  }
}
