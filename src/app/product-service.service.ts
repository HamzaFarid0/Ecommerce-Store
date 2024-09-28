import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ProductServiceService{
  constructor(private _http: HttpClient) {}

  _url = 'assets/data/product-data.json';

  productData: any;
  category: any;

  categorySubject = new BehaviorSubject('shirt');
  category$ = this.categorySubject.asObservable();

  productDataCategorySubject = new BehaviorSubject<any[]>([]);
  productDataCategory$ = this.productDataCategorySubject.asObservable();
  
  getData() {
    return this._http.get(this._url);
  }

  //  idr se hamein productCategoryData(in shop-component jis ko iterate kr ke) ka data milta hai
  // agr yeh call nhi call kre initially(ngoNint) aur categoryChanged() ami tab taak hamara
  //  productCategoryData(in shop-component) khali raha ga
  getDataOfCategory() {
    this.category$.subscribe((data) => {
      this.category = data;
      console.log('car', this.category);
    });
    this.getData().subscribe((data: any) => {
      this.productData = data;
      console.log('op', this.category)
      this.productDataCategorySubject.next(this.productData[this.category]);
    });
  }



}
