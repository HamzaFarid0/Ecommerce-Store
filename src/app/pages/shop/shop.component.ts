import { Component, ElementRef,OnInit,ViewChild,} from '@angular/core';
import { ProductServiceService } from 'src/app/product-service.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit {
  constructor(private _productSerice: ProductServiceService) {}

  @ViewChild('category', { static: true }) categorySelected!: ElementRef;

  productData: any;
  productCategoryData = [];
  category: any;

  ngOnInit(): void {

    //  jab jab productDataCategorySubject ki valueChangeHoGi/valueEmitKreGa, tou yeh line 
    // hamesha run hoo gi beshak  ngOnInit mai hai
    this._productSerice.productDataCategory$.subscribe((data: any) => {
      this.productCategoryData = data;
    });
    //  Initially view mai sirf data(array of products) ko load krna ke lia yeh call kia,  
    // q keh ar yeh call nhi kre ga tou productCategoryData epmty raha ga aur view mai bhi kuch
    // nhi ho ga
    this._productSerice.getDataOfCategory();
    //  category value pass kr raha hon idr categorySubject mai 
    this._productSerice.categorySubject.next(this.categorySelected.nativeElement.value)
    
  }

  categoryChanged(value: any) {
    this._productSerice.getDataOfCategory();
    this._productSerice.categorySubject.next(value)
  }
}












// searchInputValue: any;
// ngAfterViewChecked(): void {
//   this._searchService.search$.subscribe((data) => {
//     this.searchInputValue = data;
//   });
// }

// filterProductCategoryData() {
//   this.productCategoryData = this.productCategoryData.filter((elem: any) => {
//     return elem.name.includes(this.searchInputValue);
//   });
// }
