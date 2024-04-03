import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { BehaviorSubject } from 'rxjs';
import { Class, Student } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { PaginatedResult } from '../../models/paginatedResult';
@Injectable({
  providedIn: 'root',
})
export class ClassesService {
  classesSubject = new BehaviorSubject<Class[]>([]);
  classes$ = this.classesSubject.asObservable();
  totalPages = 1;

  constructor(private api: ApiService) {}

  async getClasses(page?: number, refresh?: boolean) {
    const pageToFetch = Math.min(this.totalPages, page ?? 1);
    const result = await this.api.get<PaginatedResult<Class>>('/classes', {params: {page: pageToFetch.toString()}});
    if (refresh) {
      this.classesSubject.next([]);
    }
    this.totalPages = Math.max(1, Math.ceil(result.total / 30));
    const oldClasses = this.classesSubject.value;
    this.classesSubject.next(oldClasses.concat(result.results));
  }

  async createClass(body: { name: string }) {
    await this.api.post('/classes', body);
    this.getClasses(1,true);
  }

  async getClass(id: string) {
    return this.api.get<Class & {students: Student[]}>(`/classes/${id}`);
  }

  async deleteClass(id: string) {
    return this.api.delete(`/classes/${id}`);
  }

  async joinClass(code: string) {
    return this.api.get<Class>(`/classes/invite/${code}`);
  }

  async removeStudentFromClass(classId: string, studentId: string) {
    return this.api.delete(`/classes/${classId}/students/${studentId}`);
  }
}
