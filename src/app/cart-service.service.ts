import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartServiceService implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  cartDataSubject = new BehaviorSubject<any[]>([]);
  cartData$ = this.cartDataSubject.asObservable();

  totalQuantitySubject = new BehaviorSubject<any>(0);
  totalQuantity$ = this.totalQuantitySubject.asObservable();

  totalPriceSubject = new BehaviorSubject<any>(0);
  totalPrice$ = this.totalPriceSubject.asObservable();

  getCartData(data: []) {
    const currentCartData = this.cartDataSubject.value;
    currentCartData.push(data);
    this.cartDataSubject.next(currentCartData);
  }

  cartDataProp: any = [];
  totalQuantity = 0;
  totalPrice = 0;

  calculateTotalQuantityAndPrice() {
    this.cartData$.subscribe((data) => {
      this.cartDataProp = data;
    });
    this.totalQuantity = this.cartDataProp.reduce((res: any, item: any) => {
     return res + item.quantity;
    }, 0);
    this.totalQuantitySubject.next(this.totalQuantity);
    console.log('tot quan : ', this.totalQuantity)

    this.totalPrice = this.cartDataProp.reduce((res: any, item: any) => {
    return  res + item.price*item.quantity;
    }, 0);
    this.totalPriceSubject.next(this.totalPrice);
    console.log('tot Price : ' , this.totalPrice)
  }
}
