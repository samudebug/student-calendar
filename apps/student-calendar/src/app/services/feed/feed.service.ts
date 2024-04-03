import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Class, Student, Task } from '@prisma/client';
import { format, isSameDay, startOfDay } from 'date-fns';
import { BehaviorSubject } from 'rxjs';
import { PaginatedResult } from '../../models/paginatedResult';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  feedSubject = new BehaviorSubject<
    { date: string; tasks: (Task & { student: Student; class: Class })[] }[]
  >([]);
  feed$ = this.feedSubject.asObservable();
  totalPages = 1;

  constructor(private api: ApiService) {}

  async getFeed(page?: number, refresh?: boolean) {
    const afterDate = startOfDay(new Date());
    const pageToFetch = Math.min(this.totalPages, page ?? 1);

    const tasksFeed = await this.api.get<
      PaginatedResult<Task & { student: Student; class: Class }>
    >('/users/me/tasks', {
      params: {
        afterDate: afterDate.toISOString(),
        page: pageToFetch.toString(),
      },
    });
    this.totalPages = Math.max(1, Math.ceil(tasksFeed.total / 30));
    const newTasks = new Map<
      string,
      (Task & { student: Student; class: Class })[]
    >();
    tasksFeed.results.forEach((task) => {
      let key = format(task.deliverDate, 'EEEE, MMM d');
      if (isSameDay(task.deliverDate, new Date())) {
        key = 'Today';
      }
      if (!newTasks.has(key)) {
        newTasks.set(key, []);
      }
      newTasks.set(key, [...newTasks.get(key)!, ...[task]]);
    });
    if (refresh) {
      this.feedSubject.next([]);
    }
    const oldTasksArr = this.feedSubject.value;
    const oldTasks = this.arrayToMap(oldTasksArr);
    this.feedSubject.next(this.mapToArray(this.mergeMaps(oldTasks, newTasks)));
  }

  private arrayToMap(
    arr: {
      date: string;
      tasks: (Task & { student: Student; class: Class })[];
    }[]
  ) {
    const result = new Map();
    arr.forEach((el) => {
      result.set(el.date, el.tasks);
    });
    return result;
  }

  private mapToArray(
    map: Map<string, (Task & { student: Student; class: Class })[]>
  ) {
    const result: {
      date: string;
      tasks: (Task & { student: Student; class: Class })[];
    }[] = [];
    map.forEach((value, key) => {
      result.push({
        date: key,
        tasks: value,
      });
    });
    return result;
  }

  private mergeMaps(
    map1: Map<string, (Task & { student: Student; class: Class })[]>,
    map2: Map<string, (Task & { student: Student; class: Class })[]>
  ) {
    const result = new Map<
      string,
      (Task & { student: Student; class: Class })[]
    >();
    map1.forEach((value, key) => {
      result.set(key, value);
    });


    result.forEach((value, key, map) => {
      // if map2 has the same key as map 1, merge both
      if (map2.has(key)) {
        const oldArr = value;
        map.set(key, [...oldArr, ...map2.get(key)!]);
        map2.delete(key);
      }
    });
    // if map2 has keys not added to 1, add now

    if ([...map2.keys()].length > 0) {
      map2.forEach((value, key) => {
        result.set(key, value);
      });
    }
    return result;
  }
}
