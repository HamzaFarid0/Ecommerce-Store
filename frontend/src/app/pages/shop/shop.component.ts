import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { debounceTime } from 'rxjs';
import { CardComponent } from 'src/app/card/card.component';
import { SearchBarComponent } from 'src/app/search-bar/search-bar.component';
import { ProductService } from 'src/app/services/productService/product.service';
import { SearchService } from 'src/app/services/searchService/search.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
  standalone : true,
   imports: [SearchBarComponent , CardComponent , FormsModule , CommonModule
    ],
})

export class ShopComponent implements OnInit {

  productCategoryData : any
  category: any;
  selectedCategory: string = '';
  errorMessage : string = ''

  constructor(
    private _productSerice: ProductService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _searchService : SearchService
  ) {}

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(params => {
      let selectedCategory = params['category'];
  
      if (!selectedCategory) {
        selectedCategory = 'shirt';
        this._router.navigate([], {
          relativeTo: this._activatedRoute,
          queryParams: { category: selectedCategory },
          queryParamsHandling: 'merge',
        });
        return;
      }
  
      this.selectedCategory = selectedCategory;
  
      // Load products initially
      this.loadCategoryProducts(this.selectedCategory);
    });
  
    this._searchService.search$.pipe(debounceTime(300)).subscribe((searchTerm) => {
        this._searchService.getSearchedProducts(searchTerm, this.selectedCategory).subscribe({
          next: (products) => {
                this.errorMessage =''
            this.productCategoryData = products
          },
          error: (err) => {
           
            this.productCategoryData = [];
            this.errorMessage = err.error?.message || 'Something went wrong';
            
          }
        });
    });
  }

  loadCategoryProducts(category: string): void {
    this._productSerice.getProductsByCategory(category).subscribe({
      next: (products) =>{
        this.errorMessage =''
        this.productCategoryData = products
      } ,
      error: (err) => {
        this.productCategoryData = [];
        this.errorMessage = err.error?.message || 'Something went wrong';
      
      
      }
    });
  }


  categoryChanged(event: any) {
    this._searchService.setSearchTerm('');

    const newValue = event.target.value;
    this._router.navigate([], {
      relativeTo: this._activatedRoute,
      queryParams: { category: newValue },
      queryParamsHandling: 'merge',
    });
  }
}
