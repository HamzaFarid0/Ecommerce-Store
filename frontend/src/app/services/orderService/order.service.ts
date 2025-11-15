import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart, CartResponse } from 'src/app/models/cart.model';
import { Order } from 'src/app/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private _apiUrl = 'http://localhost:5000/api';

  constructor(private _http: HttpClient) {}

  getOrders(): Observable<{ success: boolean; orders: Order[] }> {
    return this._http.get<{ success: boolean; orders: Order[] }>
    (`${this._apiUrl}/orders` , { withCredentials : true})
  }


}
