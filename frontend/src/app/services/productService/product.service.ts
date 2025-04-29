import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from 'src/app/models/product.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private _apiUrl = 'http://localhost:5000/api/products'
  
  constructor( private _http: HttpClient ) { }

  getAllProducts(): Observable<Product[]>{
    return this._http.get<{ success: boolean, data: Product[] }>(this._apiUrl)
    .pipe(map(response => response.data));
  }

  // Get products by category
  getProductsByCategory(category: string): Observable<Product[]> {
    const params = new HttpParams().set('category', category);
    
    return this._http.get<{ success: boolean, data: Product[] }>(this._apiUrl, { params })
    .pipe(map(response => response.data));
  }

}
