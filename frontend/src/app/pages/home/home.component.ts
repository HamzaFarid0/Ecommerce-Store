import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { BannerOneComponent } from 'src/app/banner-one/banner-one.component';
import { BannerTwoComponent } from 'src/app/banner-two/banner-two.component';
import { CardComponent } from 'src/app/card/card.component';
import { SaleBannerComponent } from 'src/app/sale-banner/sale-banner.component';
import { AuthService } from 'src/app/services/authService/auth.service';
import { CartService } from 'src/app/services/cartService/cart.service';
import { ProductService } from 'src/app/services/productService/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone : true,
  imports: [BannerOneComponent ,  CardComponent, SaleBannerComponent,
            BannerTwoComponent , RouterModule  
  ],
})
export class HomeComponent implements OnInit{

   productData: any;
   productEachFirstElement: any = [];
   productEachSecondElement: any = [];
   groupedByCategory: { [key: string]: any[] } = {};
   categoryNames: string[] = [];
  


  constructor(private _productSerice : ProductService ,
              private _cartService : CartService,
              private _authService : AuthService
  ) {}

ngOnInit(): void {


     this._productSerice.getAllProducts().subscribe((data) => {
        console.log(data);
        this.productData = data
    
        for (let product of this.productData) {
         
          if (!this.groupedByCategory[product.category]) {
            this.groupedByCategory[product.category] = [];
          }
          this.groupedByCategory[product.category].push(product);
        }
        this.categoryNames = Object.keys(this.groupedByCategory).slice(0, 4);
  
        for (let category of this.categoryNames) {
          const products = this.groupedByCategory[category];
          if (products[0]) this.productEachFirstElement.push(products[0]);
          if (products[1]) this.productEachSecondElement.push(products[1]);
        }
      });
}

}
