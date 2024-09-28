import { Component, OnInit, Input } from '@angular/core';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { CartServiceService } from '../cart-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  constructor(
    private _cartService: CartServiceService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private toast: NgToastService
  ) {}

  cartData: any = [];

  ngOnInit(): void {
    this._cartService.cartData$.subscribe((data) => {
      this.cartData = data;
      console.log('fd = ' , data)
    });
  }

  @Input() productFirstOrSecindElementOrCategoryElement: any;

  addIcon = faAdd;
  starIcon = faStar;

  createRange(number: number): number[] {
    return new Array(number);
  }

  showSuccess() {
    this.toast.success({detail:"SUCCESS",summary:'Item has been added to cart',duration:3000});
  }

  addProduct(data: any) {
    for (let i = 0; i < this.cartData.length; i++) {
      if (data.id === this.cartData[i]['id']) {
        this.cartData[i]['quantity']++
        this._cartService.calculateTotalQuantityAndPrice();
        this._router.navigate(['/cart']);
        return;
      }
    }
    this._cartService.getCartData(data);
    this.showSuccess()
    this._cartService.calculateTotalQuantityAndPrice();
    this._router.navigate(['/cart']);
  }
}
