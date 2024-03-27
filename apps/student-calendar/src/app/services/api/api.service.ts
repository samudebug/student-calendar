import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, firstValueFrom } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   *
   * @param {string} url  The URL to perform the request. It will be appended to the baseUrl
   * @param {[header: string]: string} headers A Map of the headers to send on the request
   * @returns An instance of `T`. Throws an error otherwise
   */
  async get<T>(
    url: string,
    options?: {
      headers?: { [header: string]: string },
      params?: {[param: string]: string}
    }
  ): Promise<T> {
    return firstValueFrom(
      this.http.get<T>(`${this.baseUrl}${url}`, {
        headers: { ...options?.headers, ...(await this.getHeaders()) },
        params: options?.params
      })
    );
  }

  /**
   *
   * @param url The URL to perform the request. It will be appended to the baseUrl
   * @param body The body of the request. It will be sent as a JSON
   * @param headers A Map of the headers to send on the request
   * @returns An instance of `T`. Throws an error otherwise
   */

  async post<T>(
    url: string,
    body: Record<string, any>,
    headers?: { [header: string]: string }
  ): Promise<T> {
    return firstValueFrom(
      this.http.post<T>(`${this.baseUrl}${url}`, body, {
        headers: { ...headers, ...(await this.getHeaders()) },
      })
    );
  }

  /**
   *
   * @param {string} url  The URL to perform the request. It will be appended to the baseUrl
   * @param {[header: string]: string} headers A Map of the headers to send on the request
   * @returns An instance of `T`. Throws an error otherwise
   */
  async delete<T>(
    url: string,
    headers?: { [header: string]: string }
  ): Promise<T> {
    return firstValueFrom(
      this.http.delete<T>(`${this.baseUrl}${url}`, {
        headers: { ...headers, ...(await this.getHeaders()) },
      })
    );
  }

  /**
   *
   * @param url The URL to perform the request. It will be appended to the baseUrl
   * @param body The body of the request. It will be sent as a JSON
   * @param headers A Map of the headers to send on the request
   * @returns An instance of `T`. Throws an error otherwise
   */

  async patch<T>(
    url: string,
    body: Record<string, any>,
    headers?: Record<string, any>
  ): Promise<T> {
    return firstValueFrom(
      this.http.patch<T>(`${this.baseUrl}${url}`, body, {
        headers: { ...headers, ...(await this.getHeaders()) },
      })
    );
  }

  private async getHeaders() {
    const token = await this.authService.fetchIdToken();
    if (!token) {
      this.router.navigate(['/', 'login']);
      return;
    }
    return { authorization: token };
  }
}
