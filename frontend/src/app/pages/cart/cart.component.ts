import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { CartService } from 'src/app/services/cartService/cart.service';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';
import { OrderService } from 'src/app/services/orderService/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone : true,
  imports : [ FontAwesomeModule , CommonModule , RouterModule
   
  ],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class CartComponent implements OnInit {
  cartData: any = {};
  errorMessage: string = '';
  deleteIcon = faTrashAlt;

  totalQuantity!: number;
  totalPrice!: number;
  loading : boolean = true

  singleOrPluralItem: any;
  private debounceTimer: any;

  disableTyping(event: KeyboardEvent) {
    event.preventDefault();
  }
  

  constructor(
    private _cartService: CartService,
    private _orderService: OrderService,
    private _checkoutService : CheckoutService
  ) {}

  ngOnInit(): void {
    this.getCartData();
   
  }

  getCartData() {
    this._cartService.getCartData().subscribe({
      next: (res) => {
        this.cartData = res.cart.items;
        console.log(this.cartData);
        this.totalPrice = res.totalPrice;
        this.totalQuantity = res.totalQuantity;
        this._cartService.totalQuantitySubject.next(this.totalQuantity);
        this.singleOrPluralItem= this.totalQuantity>1 ? 'items' : 'item'
        this.loading =false
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = err.error.message;
        this.loading =false
      },
    });
  }

  updateCartItemQuantity(productId: string, e: any) {
    clearTimeout(this.debounceTimer);

    const input = e.target as HTMLInputElement;
    const value = Number(input.value);
    this.debounceTimer = setTimeout(() => {
      this._cartService.updateCartItemQuantity(productId, value).subscribe({
        next: (res) => {
          console.log('delay hai')
          this.getCartData();
         
        },
        error: (err) => {
          console.log(err);
        },
      });
    }, 500);

  }

  deleteItem(productId: string) {
    Swal.fire({
      icon: 'warning',
      text: 'Are you sure you want to delete this item?',
      width: '600px',
      padding: '1rem',
      showCancelButton: true,
      confirmButtonText: 'YES',
      cancelButtonText: 'NO',
      customClass: {
        popup: 'small-modal',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this._cartService.deleteItem(productId).subscribe({
          next: (res) => {
            Swal.fire('Your item has been deleted', '', 'success');
            this.cartData = res.cart.items;
            this.totalPrice = res.totalPrice;
            this.totalQuantity = res.totalQuantity;
            this._cartService.totalQuantitySubject.next(this.totalQuantity);
            console.log('delete res', res);
          },
          error: (err) => {
            console.log(err.error.message);
          },
        });
      }
    });
  }

  // orderPlaced() {
  //   Swal.fire({
  //     icon: 'question',
  //     text: 'Are you sure you want to place this order?',
  //     width: '600px',
  //     padding: '1rem',
  //     showCancelButton: true,
  //     confirmButtonText: 'YES',
  //     cancelButtonText: 'NO',
  //     customClass: {
  //       popup: 'small-modal',
  //     },
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this._orderService.orderPlaced().subscribe({
  //         next: (res) => {
  //           Swal.fire('Your order has been placed', '', 'success');
  //           this.cartData = res.cart.items;
  //           this.totalPrice = res.totalPrice;
  //           this.totalQuantity = res.totalQuantity;
  //           this._cartService.totalQuantitySubject.next(this.totalQuantity);
  //         },
  //         error: (err) => {
  //           console.log(err);
  //         },
  //       });
  //     }
  //   });
  // }

  checkout(){
     this._checkoutService.createCheckoutSession().subscribe({
      next: (res) => {
       window.location.href = res.url; // Redirect to Stripe Checkout
      },
      error: (err) => {
        console.error('Payment error:', err);
      },
    });
  }

}
