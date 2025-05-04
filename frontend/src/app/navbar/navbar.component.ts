import { Component, HostListener, OnInit } from '@angular/core';
import { faCartArrowDown } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/authService/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CartService } from '../services/cartService/cart.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone : true,
  imports : [FontAwesomeModule , RouterModule , CommonModule]
})
export class NavbarComponent implements OnInit {
  
  totalQuantity! : number
  dropdownOpen = false;
  user$ = this._authService.currentUser$;

  constructor(private _cartService : CartService,
             private _authService : AuthService,
             private _router : Router,
             private _activatedRoute : ActivatedRoute
  ){}

ngOnInit(): void {

  this._cartService.totalQuantity$.subscribe((data)=>{
      this.totalQuantity=data
  })

}

cartIcon = faCartArrowDown

toggleDropdown() {
  this.dropdownOpen = !this.dropdownOpen;
}

@HostListener('document:click', ['$event'])
onClickOutside(event: Event) {
  const target = event.target as HTMLElement;
  if (!target.closest('.user-menu')) {
    this.dropdownOpen = false;
  }
}

logout(){
  console.log('logout')
  this._authService.logout().subscribe({
    next : () => {
       this._router.navigate(['/login'])
    },
    error : (err) => {
      console.error("Error during logout:", err.error.message); 
    }
  })
}

}
