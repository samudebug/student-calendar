import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { BehaviorSubject } from 'rxjs';
import { Class } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
@Injectable({
  providedIn: 'root',
})
export class ClassesService {
  classesSubject = new BehaviorSubject<Class[]>([]);
  classes$ = this.classesSubject.asObservable();

  constructor(private api: ApiService) {}

  async getClasses() {
    const classes = await this.api.get<Class[]>('/classes');
    this.classesSubject.next(classes);
  }

  async createClass(body: { name: string }) {
    await this.api.post('/classes', body);
    this.getClasses();
  }

  async getClass(id: string) {
    return this.api.get<Class>(`/classes/${id}`);
  }

  async deleteClass(id: string) {
    return this.api.delete(`/classes/${id}`);
  }

  async joinClass(code: string) {
    return this.api.get<Class>(`/classes/invite/${code}`);
  }
}
