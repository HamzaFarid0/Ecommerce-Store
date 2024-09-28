import { AfterViewInit, Component, OnInit } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ProductServiceService } from '../product-service.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent implements OnInit {
  constructor( private _productService: ProductServiceService) {}

  searchIcon = faSearch;
  productData: any;
  productDataCategory = [];
  unChangedproductDataCategory = [];
  category: any;


  searchInputValue: any;

  ngOnInit(): void {
  
    // code Word= correct ,  1- yeh do is lia add kia takke , selected category ka data non-filtered
    // data le sake
    this._productService.getData().subscribe((data: any) => {
      this.productData = data;
      this.productDataCategory = this.productData[this.category];
      console.log('new', this.productDataCategory);
    });
   // code Word= correct , 2- yeh do is lia add kia takke , selected category ka data non-filtered
    // data le sake
    this._productService.category$.subscribe((data :any) => {
      this.category = data;
    });

    this._productService.productDataCategory$.subscribe((data : any)=>{
      this.productDataCategory=data
    })
  }
  


  onChange(e: any) {
    //  only below lin is lai add ki  takke , selected category ka data non-filtered
    // data le sake
    this._productService.productDataCategorySubject.next(this.productData[this.category])
    this.searchInputValue = e.target.value.toLowerCase();
    this.unChangedproductDataCategory = this.productDataCategory.filter(
      (elem: any) => {
        return elem.name.toLowerCase().includes(this.searchInputValue);
      }
    );

    console.log('unChanged ', this.unChangedproductDataCategory)
    this._productService.productDataCategorySubject.next(this.unChangedproductDataCategory);
  }
}
