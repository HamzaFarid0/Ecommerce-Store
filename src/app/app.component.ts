import { Component, OnInit } from '@angular/core';
import { ProductServiceService } from './product-service.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  productData: any;
  productEachFirstElement: any = [];
  productEachSecondElement: any = [];
  showAppComponent!: boolean

  constructor(private _productSerice: ProductServiceService, private _router: Router) {}

  ngOnInit(): void {
    this._productSerice.getData().subscribe((data) => {
      this.productData = data;
      console.log(this.productData);

      for (let key in this.productData) {
        if (this.productEachFirstElement.length < 4) {                      // yeh less than 4 wali condition is lia add q keh mai sirf 4 profucts show krwnana chahta, aur koi reason nhi hai
          this.productEachFirstElement.push(this.productData[key][0]);
        }

        if(this.productEachSecondElement.length<4){
          this.productEachSecondElement.push(this.productData[key][1])
        }
      }
      console.log(this.productEachFirstElement);
    });

    this._router.events.subscribe((event)=>{
      if(event instanceof NavigationEnd){
        if(event.url==='/'){
          this.showAppComponent=true
        }else{
          this.showAppComponent=false
        }
      }
    })

  }
}
