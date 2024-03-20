import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { BehaviorSubject } from 'rxjs';
import { Class } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  classesSubject = new BehaviorSubject<Class[]>([]);
  classes$ = this.classesSubject.asObservable();

  constructor(private api: ApiService, private authService: AuthService) { }

  async getClasses() {
    const token = await this.authService.fetchIdToken();
    if (!token) throw new Error("User not logged in");
    const classes = await this.api.get<Class[]>('/classes', {authorization: token})
    this.classesSubject.next(classes);
  }

  async createClass(body: {name: string}) {
    const token = await this.authService.fetchIdToken();
    if (!token) throw new Error("User not logged in");
    await this.api.post('/classes', body, {authorization: token});
    this.getClasses();
  }

  async getClass(id: string) {
    const token = await this.authService.fetchIdToken();
    if (!token) throw new Error('User not logged in');
    return this.api.get<Class>(`/classes/${id}`, {authorization: token});
  }

  async deleteClass(id:string) {
    const token = await this.authService.fetchIdToken();
    if (!token) throw new Error('User not logged in');
    return this.api.delete(`/classes/${id}`, {authorization: token});
  }
}
