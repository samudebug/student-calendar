import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';
  constructor(private http: HttpClient) {}

  get<T>(url: string, headers: { [header: string]: string }): Promise<T> {
    return firstValueFrom(
      this.http.get<T>(`${this.baseUrl}${url}`, { headers })
    );
  }
}
