import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/enivironment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  private getAuthHeaders(): HttpHeaders {
    const token = isPlatformBrowser(this.platformId) ? (localStorage.getItem('auth_token') || '') : '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/products`, { headers: this.getAuthHeaders() });
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/products/${id}`, { headers: this.getAuthHeaders() });
  }

  createProduct(productData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, productData, { headers: this.getAuthHeaders() });
  }

  updateProduct(id: number, productData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, productData, { headers: this.getAuthHeaders() });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  searchProducts(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?search=${keyword}`, { headers: this.getAuthHeaders() });
  }

  getProductsByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?category=${categoryId}`, { headers: this.getAuthHeaders() });
  }

  getNewArrivals(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/products/new-arrivals`);
  }

  getTrendingProducts(categoryId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/products/trending?level_one_category=${categoryId}`);
  }
}
