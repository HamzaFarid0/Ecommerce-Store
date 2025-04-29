import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Product } from 'src/app/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

   private _apiUrl = 'http://localhost:5000/api/search'

  private searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject.asObservable();

  constructor(private _http: HttpClient ) {}

  setSearchTerm(term: string) {
    this.searchSubject.next(term);
  }

  getSearchedProducts(keyword: string , category : string): Observable<Product[]> {
    let params = new HttpParams();
    if (keyword !== '') {
      params = params.set('keyword', keyword);
    }
    if (category) {
      params = params.set('category', category);
    }
    return this._http.get<{ success: boolean, data: Product[] }>(this._apiUrl, { params })
      .pipe(map(response => response.data));
  }

}
