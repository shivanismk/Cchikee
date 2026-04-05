import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/enivironment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  private getAuthHeaders(): HttpHeaders {
    const token = isPlatformBrowser(this.platformId) ? (localStorage.getItem('auth_token') || '') : '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  placeOrder(orderData: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/orders`,
      orderData,
      { headers: this.getAuthHeaders() }
    );
  }

  getOrders(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/orders`, { headers: this.getAuthHeaders() });
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/orders/${id}`, { headers: this.getAuthHeaders() });
  }
}
