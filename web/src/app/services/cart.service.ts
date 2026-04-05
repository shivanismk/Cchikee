import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/enivironment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = environment.apiUrl;
  private cartCount$ = new BehaviorSubject<number>(0);
  cartCount = this.cartCount$.asObservable();

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  private getAuthHeaders(): HttpHeaders {
    const token = isPlatformBrowser(this.platformId) ? (localStorage.getItem('auth_token') || '') : '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  fetchCount(): void {
    this.getCart().subscribe({
      next: (res: any) => {
        const items = res.cart || res.items || res || [];
        this.cartCount$.next(items.length);
      },
      error: () => this.cartCount$.next(0)
    });
  }

  addToCart(productId: number, quantity: number = 1, size?: string): Observable<any> {
    const body: any = { product_id: productId, quantity };
    if (size) body['size'] = size;
    return this.http.post<any>(
      `${this.baseUrl}/cart`,
      body,
      { headers: this.getAuthHeaders() }
    ).pipe(tap(() => this.cartCount$.next(this.cartCount$.value + 1)));
  }

  getCart(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/cart`, { headers: this.getAuthHeaders() });
  }

  updateCartItem(cartItemId: number, quantity: number): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/cart/${cartItemId}`,
      { quantity },
      { headers: this.getAuthHeaders() }
    );
  }

  removeCartItem(cartItemId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.baseUrl}/cart/${cartItemId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(tap(() => this.cartCount$.next(Math.max(0, this.cartCount$.value - 1))));
  }
}
