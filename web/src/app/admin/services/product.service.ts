import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../../environments/enivironment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  private getAuthHeaders(): HttpHeaders {
    const token = isPlatformBrowser(this.platformId) ? (localStorage.getItem('auth_token') || '') : '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, product, { headers: this.getAuthHeaders() });
  }

  addBulkProducts(products: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/bulk`, { products });
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
