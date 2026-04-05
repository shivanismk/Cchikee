import { Injectable } from '@angular/core';
import { environment } from '../../environments/enivironment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCategories(data:any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/getAllCategories`, data);
  }

  getCategoriesWithTree(): Observable<{ categories: any[] }> {
    return this.http.get<{ categories: any[] }>(`${this.baseUrl}/categories/tree`);
  }

  getParentCategories(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/categories`);
  }
}
