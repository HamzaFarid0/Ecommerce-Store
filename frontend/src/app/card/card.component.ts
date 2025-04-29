import { Component, OnInit, Input } from '@angular/core';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CartService } from '../services/cartService/cart.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  standalone : true,
  imports : [FontAwesomeModule , CommonModule ]
})
export class CardComponent implements OnInit {
  constructor(
    private _cartService: CartService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private toast: NgToastService
  ) {}

  cartData: any = [];

  ngOnInit(): void {

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

  addItem(product: any) {
    this._cartService.addItem(product._id).subscribe({
      next: (res) => {
        console.log('Product added to cart:', res);
        this.showSuccess()
        this._router.navigate(['../', 'cart'], { relativeTo: this._activatedRoute });
      },
      error: (err) => {
        console.error('Error adding product to cart:', err);
      },
    });
  }
}
