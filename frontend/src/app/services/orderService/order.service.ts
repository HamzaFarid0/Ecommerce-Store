import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart, CartResponse } from 'src/app/models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private _apiUrl = 'http://localhost:5000/api/orders';

  constructor(private _http: HttpClient) {}

  orderPlaced() {
    return this._http.post<CartResponse>(`${this._apiUrl}` , {} , { withCredentials : true})
  }


}
