import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CartServiceService } from 'src/app/cart-service.service';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom, 
})
export class CartComponent implements OnInit {
  constructor(private _cartService: CartServiceService) {}

  cartData: any = [];
  deleteIcon = faTrashAlt;

  totalQuantity: any
  totalPrice : any

singleOrPluralItem : any

  ngOnInit(): void {
    this._cartService.cartData$.subscribe((data) => {
      this.cartData = data;
      console.log('cart data = ', data);
    });
  
    this._cartService.totalQuantity$.subscribe((data)=>{
      this.totalQuantity =data
    })
    this._cartService.totalPrice$.subscribe((data)=>{
      this.totalPrice=data
    })
    this.singleOrPluralItem= this.totalQuantity>1 ? 'items' : 'item'
  }

  inputChanged(){
    this._cartService.calculateTotalQuantityAndPrice()
        this.singleOrPluralItem= this.totalQuantity>1 ? 'items' : 'item'
  }

  deleteItem(index : any){
    Swal.fire({
      icon: 'warning',
      text: 'Are you sure you want to delete this item?',
      width: '600px',  
      padding: '1rem', 
      showCancelButton: true,
      confirmButtonText: 'YES',
      cancelButtonText: 'NO',
      customClass: {
        popup: 'small-modal'
      }
    }).then((result) => {
      if (result.isConfirmed) {
     this.cartData.splice(index,1)
     this._cartService.calculateTotalQuantityAndPrice()
        Swal.fire('Your item has been deleted', '', 'success');
      }
    });
  }

  orderPlaced(){

    Swal.fire({
      icon:'question',
      text: 'Are you sure you want to place this order?',
      width: '600px',  
      padding: '1rem', 
      showCancelButton: true,
      confirmButtonText: 'YES',
      cancelButtonText: 'NO',
      customClass: {
        popup: 'small-modal',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this._cartService.cartDataSubject.next([])
        this._cartService.totalQuantitySubject.next(0)
        Swal.fire('Your order has been placed', '', 'success');
      }
    });

  }


}
