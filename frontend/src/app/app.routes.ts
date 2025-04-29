import { Routes } from '@angular/router';
import { authGuard } from './guards/authGuard/auth.guard';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { OtpVerifyComponent } from './pages/otp-verify/otp-verify.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'shop',
    loadComponent: () => import('./pages/shop/shop.component').then(m => m.ShopComponent),
    canActivate: [authGuard],
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent),
    canActivate: [authGuard],
  },
  {path : 'signup' , component : SignupComponent,  },
  {path : 'login' , component : LoginComponent},
  {path : 'verify-otp' , component : OtpVerifyComponent},
  {path: '**', component: PageNotFoundComponent },
];
  