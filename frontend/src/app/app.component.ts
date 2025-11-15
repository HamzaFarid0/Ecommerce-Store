// import { Component, OnInit } from '@angular/core';
// import { ProductService } from './services/productService/product.service';
// import { Router, NavigationEnd, RouterOutlet, ActivatedRoute } from '@angular/router';
// import { filter } from 'rxjs';
// import { AuthService } from './services/authService/auth.service';
// import { CartService } from './services/cartService/cart.service';
// import { NavbarComponent } from './navbar/navbar.component';
// import { FooterComponent } from './footer/footer.component';
// import { NgToastComponent, NgToastModule } from 'ng-angular-popup';
// import { CommonModule } from '@angular/common';
// import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css'],
//   standalone : true,
//      imports: [NavbarComponent , FooterComponent , RouterOutlet,
//               NgToastModule , CommonModule
//       ],
// })
// export class AppComponent implements OnInit {
  
//   // showAppComponent!: boolean;
//   // isSignupRoute: boolean = false;
//   // isLoginRoute: boolean = false;
//   // isSuccessRoute : boolean = false
//   // isOrdersRoute : boolean = false
//   // isCartRoute : boolean = false
//   // isCancelRoute : boolean = false
//   // pageNotFound : boolean = false
//   // isVeirfyOtpRoute: boolean = false;
//   // isForgotPasswordRoute : boolean = false
//   // isResetPasswordRoute : boolean =false
//     hideLayout = false; 
//   totalQuantity! : number

//     private layoutHiddenRoutes = [
//     '/signup',
//     '/login',
//     '/success',
//     '/cancel',
//     '/verify-otp',
//     '/forgot-password',
//     '/reset-password'
//   ];

//   constructor(
//     private _router: Router,
//     private _activatedRoute : ActivatedRoute,
//     private _authService : AuthService,
//     private _cartService : CartService
//   ) {}

//   ngOnInit(): void {

//       this._cartService.getCartData().subscribe({
//     next : (res) =>{
//       this.totalQuantity = res.totalQuantity;
//       this._cartService.totalQuantitySubject.next(this.totalQuantity)
//     },
//     error : (err) => {
//        console.log(err)
//     }
//   })
  
// this._authService.isLoggedIn().subscribe()

//     this._router.events
//       .pipe(filter((event) => event instanceof NavigationEnd))
//       .subscribe(() => {
//         // const url = this._router.url;
//         // this.isSignupRoute = url.startsWith('/signup');
//         // this.isLoginRoute = url.startsWith('/login');
//         // this.isSuccessRoute = url.startsWith('/success');
//         // this.isCancelRoute = url.startsWith('/cancel');
//         // this.isOrdersRoute = url.startsWith('/orders')
//         //   this.isCartRoute = url.startsWith('/cart')
//         // this.isVeirfyOtpRoute = url.startsWith('/verify-otp')
//         // this.isForgotPasswordRoute=url.startsWith('/forgot-password')
//         // this.isResetPasswordRoute = url.startsWith('/reset-password')
     
//         // let route = this._activatedRoute.root
//         //   while (route.firstChild) {
//         //   route = route.firstChild;
//         // }
  
//         // const currentComponent = route.component as any;
//         // this.pageNotFound = currentComponent === PageNotFoundComponent;
//         // console.log(`Current routert: ${url}`);
//  const currentUrl = this._router.url;

//         // Hide layout on selected routes
//         this.hideLayout = this.layoutHiddenRoutes.some(path =>
//           currentUrl.startsWith(path)
//         );

//         // Special handling for page-not-found
//         let route = this._activatedRoute.root;
//         while (route.firstChild) route = route.firstChild;

//         if (route.component === PageNotFoundComponent) {
//           this.hideLayout = true;
//         }

//       });
      
//   }
// }


import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone : true,
  imports: [CommonModule , RouterOutlet ],
})
export class AppComponent {}

