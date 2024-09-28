import { Component, OnInit } from '@angular/core';
import { faCartArrowDown } from '@fortawesome/free-solid-svg-icons';
import { CartServiceService } from '../cart-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private _cartService : CartServiceService){}

  totalQuantity : any
ngOnInit(): void {
  this._cartService.totalQuantity$.subscribe((data)=>{
      this.totalQuantity=data
  })
}

cartIcon = faCartArrowDown

}
