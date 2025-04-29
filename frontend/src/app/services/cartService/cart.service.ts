import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../authService/auth.service';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { Cart, CartResponse } from 'src/app/models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  totalQuantitySubject = new BehaviorSubject<number>(0);
  totalQuantity$ = this.totalQuantitySubject.asObservable()

  private _apiUrl = 'http://localhost:5000/api/cart';

  constructor(private _http: HttpClient, private _authService: AuthService) {}

  getCartData(){
    return this._http.get<CartResponse>(this._apiUrl , { withCredentials: true})
  }

  addItem(productId: any): Observable<Cart> {
   return this._http.post<Cart>(`${this._apiUrl}/add`, {productId} , { withCredentials: true,});
  }

  updateCartItemQuantity(productId : string , quantity : number){
    return this._http.post(`${this._apiUrl}/update-quantity` , {productId , quantity} , { withCredentials : true})
  }

  deleteItem(productId :any) : Observable<CartResponse>{
    return this._http.delete<CartResponse>(`${this._apiUrl}/deleteItem/${productId}` , {withCredentials : true});
  }


}
