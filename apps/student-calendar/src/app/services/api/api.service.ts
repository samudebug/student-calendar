import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';
  constructor(private http: HttpClient) {}

  /**
   *
   * @param {string} url  The URL to perform the request. It will be appended to the baseUrl
   * @param {[header: string]: string} headers A Map of the headers to send on the request
   * @returns An instance of `T`. Throws an error otherwise
   */
  get<T>(url: string, headers: { [header: string]: string }): Promise<T> {
    return firstValueFrom(
      this.http.get<T>(`${this.baseUrl}${url}`, { headers })
    );
  }

  /**
   *
   * @param url The URL to perform the request. It will be appended to the baseUrl
   * @param body The body of the request. It will be sent as a JSON
   * @param headers A Map of the headers to send on the request
   * @returns An instance of `T`. Throws an error otherwise
   */

  post<T>(
    url: string,
    body: Record<string, any>,
    headers: { [header: string]: string }
  ): Promise<T> {
    return firstValueFrom(
      this.http.post<T>(`${this.baseUrl}${url}`, body, { headers })
    );
  }

  /**
   *
   * @param {string} url  The URL to perform the request. It will be appended to the baseUrl
   * @param {[header: string]: string} headers A Map of the headers to send on the request
   * @returns An instance of `T`. Throws an error otherwise
   */
  delete<T>(url: string, headers: { [header: string]: string }): Promise<T> {
    return firstValueFrom(this.http.delete<T>(`${this.baseUrl}${url}`, {headers}));
  }
}
