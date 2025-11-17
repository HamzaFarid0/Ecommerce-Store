



import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { faShoppingCart, faChevronDown, faBox, faSignOutAlt, faHome, faShop, faUser, faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CartService } from '../services/cartService/cart.service';
import { AuthService } from '../services/authService/auth.service';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,        // Required for *ngIf, async pipe, etc.
    RouterLink,          // Required for routerLink
    RouterLinkActive,    // Required for routerLinkActive
    FontAwesomeModule    // For fa-icon
  ]
})
export class NavbarComponent implements OnInit {
  // Icons
  
  cartIcon = faShoppingCart;
  dropdownIcon = faChevronDown;
  ordersIcon = faBox;
  logoutIcon = faSignOutAlt;
  homeIcon = faHouse;
  shopIcon = faShop;
  userIcon = faUser;
  user$ = this._authService.currentUser$;

  // State
  dropdownOpen = false;
  mobileMenuOpen = false;
  totalQuantity!: number
  


   constructor(private _cartService : CartService,
             private _authService : AuthService,
             private _router : Router,
             private _activatedRoute : ActivatedRoute
  ){}

  ngOnInit(): void {
  this._cartService.totalQuantity$.subscribe((data)=>{
    this.totalQuantity=data
    localStorage.setItem('totalQuantity', String(data));
  })
  }



  // Dropdown methods
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  // Mobile menu methods
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  // Close both dropdowns
  closeDropdowns(): void {
    this.closeDropdown();
    this.closeMobileMenu();
  }



  // Logout
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

  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    
    if (!target.closest('.user-menu')) {
      this.closeDropdown();
    }
    
    if (!target.closest('.mobile-toggle') && !target.closest('.header-content')) {
      this.closeMobileMenu();
    }
  }

  // Close dropdowns on escape key
  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    this.closeDropdown();
    this.closeMobileMenu();
  }

  // Handle window resize
  @HostListener('window:resize')
  onWindowResize(): void {
    if (window.innerWidth > 768 && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }
}


