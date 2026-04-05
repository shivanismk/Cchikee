import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/enivironment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  register(data: { first_name: string; last_name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/register`, data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/login`, data).pipe(
      tap((res: any) => {
        if (this.isBrowser) {
          if (res?.token) localStorage.setItem('auth_token', res.token);
          if (res?.user) localStorage.setItem('user', JSON.stringify(res.user));
        }
      })
    );
  }

  // Send Google credential (JWT) to your backend for verification
  loginWithGoogleBackend(idToken: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/google`, { id_token: idToken }).pipe(
      tap((res: any) => {
        if (this.isBrowser) {
          if (res?.token) localStorage.setItem('auth_token', res.token);
          if (res?.user) localStorage.setItem('user', JSON.stringify(res.user));
        }
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  isLoggedIn(): boolean {
    return this.isBrowser ? !!localStorage.getItem('auth_token') : false;
  }

  getStoredUser(): any {
    if (!this.isBrowser) return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
