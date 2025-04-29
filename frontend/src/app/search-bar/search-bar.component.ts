import { AfterViewInit, Component, OnInit } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ProductService } from '../services/productService/product.service';
import { SearchService } from '../services/searchService/search.service';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormGroup, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
  standalone : true,
  imports : [ FontAwesomeModule , FormsModule 
   
  ] ,
})
export class SearchBarComponent implements OnInit {
  constructor( private _searchService: SearchService,
              private _activatedRoute : ActivatedRoute
  ) {}

  searchIcon = faSearch;
  searchTerm = '';

  ngOnInit(): void {
    this._searchService.search$.subscribe(term => {
      this.searchTerm = term; 
    });
  }
  


 
  onSearch() {
    const trimmed = this.searchTerm.trim();
   
    this._searchService.setSearchTerm(trimmed); 
  }
  
}
