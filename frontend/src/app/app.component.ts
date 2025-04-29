import { Component, OnInit } from '@angular/core';
import { ProductService } from './services/productService/product.service';
import { Router, NavigationEnd, RouterOutlet, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './services/authService/auth.service';
import { CartService } from './services/cartService/cart.service';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { NgToastComponent, NgToastModule } from 'ng-angular-popup';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone : true,
     imports: [NavbarComponent , FooterComponent , RouterOutlet,
              NgToastModule , CommonModule
      ],
})
export class AppComponent implements OnInit {
  
  showAppComponent!: boolean;
  isSignupRoute: boolean = false;
  isLoginRoute: boolean = false;
  pageNotFound : boolean = false
  isVeirfyOtpRoute: boolean = false;
  totalQuantity! : number

  constructor(
    private _router: Router,
    private _activatedRoute : ActivatedRoute,
    private _authService : AuthService,
    private _cartService : CartService
  ) {}

  ngOnInit(): void {
    this._cartService.getCartData().subscribe({
      next : (res) =>{
        this.totalQuantity = res.totalQuantity;
        this._cartService.totalQuantitySubject.next(this.totalQuantity)
      },
      error : (err) => {
         console.log(err)
      }
    })
    
this._authService.isLoggedIn().subscribe()

    this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = this._router.url;
        this.isSignupRoute = url.startsWith('/signup');
        this.isLoginRoute = url.startsWith('/login');
        this.isVeirfyOtpRoute = url.startsWith('/verify-otp')
     
        let route = this._activatedRoute.root
          while (route.firstChild) {
          route = route.firstChild;
        }
  
        const currentComponent = route.component as any;
        this.pageNotFound = currentComponent === PageNotFoundComponent;
        console.log(`Current route: ${url}`);
      });
      
  }
}

