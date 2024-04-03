import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { BehaviorSubject } from 'rxjs';
import { Student, Task } from '@prisma/client';
import { startOfDay, subDays } from 'date-fns';
import { PaginatedResult } from '../../models/paginatedResult';
@Injectable({
  providedIn: 'root',
})
export class TasksService {
  tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();
  totalPages = 1;
  constructor(private api: ApiService) {}

  async getTasks(classId: string, page?: number, refresh?: boolean) {
    const pageToFetch = Math.min(this.totalPages, page ?? 1);

    const afterDate = startOfDay(subDays(new Date(), 1));
    const tasks = await this.api.get<PaginatedResult<Task>>(`/classes/${classId}/tasks`, {
      params: { afterDate: afterDate.toISOString(), page: pageToFetch.toString() },
    });
    if (refresh) {
      this.tasksSubject.next([]);
    }
    this.totalPages = Math.max(1, Math.ceil(tasks.total / 30));
    const oldTasks = this.tasksSubject.value;
    this.tasksSubject.next(oldTasks.concat(tasks.results));
  }

  async createTask(
    classId: string,
    body: { name: string; deliverDate: Date; notes: string }
  ) {
    await this.api.post(`/classes/${classId}/tasks`, body);
    this.getTasks(classId, 1, true);
  }

  async updateTask(
    classId: string,
    taskId: string,
    body: Partial<{ name: string; deliverDate: Date; notes: string }>
  ) {
    await this.api.patch(`/classes/${classId}/tasks/${taskId}`, body);
    this.getTasks(classId, 1, true);
  }

  async getTask(classId: string, taskId: string) {
    return this.api.get<Task & { student: Student }>(
      `/classes/${classId}/tasks/${taskId}`
    );
  }

  async deleteTask(classId: string, taskId: string) {
    return this.api.delete(`/classes/${classId}/tasks/${taskId}`);
  }
}
