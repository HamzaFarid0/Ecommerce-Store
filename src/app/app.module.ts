import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BannerOneComponent } from './banner-one/banner-one.component';
import { CardComponent } from './card/card.component';
import {HttpClient, HttpClientModule} from '@angular/common/http'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SaleBannerComponent } from './sale-banner/sale-banner.component';
import { BannerTwoComponent } from './banner-two/banner-two.component';
import { FooterComponent } from './footer/footer.component';
import { ShopComponent } from './pages/shop/shop.component';
import { CartComponent } from './pages/cart/cart.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';
import {NgToastModule} from "ng-angular-popup";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BannerOneComponent,
    CardComponent,
    SaleBannerComponent,
    BannerTwoComponent,
    FooterComponent,
    ShopComponent,
    SearchBarComponent,
    CartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    FormsModule,
    NgToastModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
