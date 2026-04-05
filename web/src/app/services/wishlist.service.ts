import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/enivironment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private baseUrl = environment.apiUrl;
  private wishlistCount$ = new BehaviorSubject<number>(0);
  wishlistCount = this.wishlistCount$.asObservable();

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  private getAuthHeaders(): HttpHeaders {
    const token = isPlatformBrowser(this.platformId) ? (localStorage.getItem('auth_token') || '') : '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  fetchCount(): void {
    this.getWishlist().subscribe({
      next: (res: any) => {
        const items = res.wishlist || res.items || res || [];
        this.wishlistCount$.next(items.length);
      },
      error: () => this.wishlistCount$.next(0)
    });
  }

  addToWishlist(productId: number): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/wishlist`,
      { product_id: productId },
      { headers: this.getAuthHeaders() }
    ).pipe(tap(() => this.wishlistCount$.next(this.wishlistCount$.value + 1)));
  }

  getWishlist(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/wishlist`, { headers: this.getAuthHeaders() });
  }

  removeFromWishlist(productId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/wishlist/${productId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(tap(() => this.wishlistCount$.next(Math.max(0, this.wishlistCount$.value - 1))));
  }
}
