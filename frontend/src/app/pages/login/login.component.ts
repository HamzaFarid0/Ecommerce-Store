import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/authService/auth.service';
import { CartService } from 'src/app/services/cartService/cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
    standalone : true,
    imports : [ ReactiveFormsModule , CommonModule , RouterModule
  
    ],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {

  loginForm! : FormGroup
  submitted: boolean = false;
  serverErrors: { [key: string]: string } = {};
  totalQuantity! : number

  constructor(private _formBuilderService : FormBuilder,
              private _router : Router,
              private _activatedRoute : ActivatedRoute,
              private _authService : AuthService,
              private _cartService : CartService
  ){}

 ngOnInit(): void {
   this.loginForm = this._formBuilderService.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
   })
 }

 submitForm(form : FormGroup){
  this.submitted = true;
  this.serverErrors = {};
  if (this.loginForm.invalid) {
    return;
  }

     this._authService.login(form).subscribe({
      next: (response) => {
        console.log("Login successful", response);
        this._router.navigate(['../' ] , { relativeTo : this._activatedRoute})
        this._cartService.getCartData().subscribe({
          next : (res) =>{
            this.totalQuantity = res.totalQuantity;
            this._cartService.totalQuantitySubject.next(this.totalQuantity)
          },
          error : (err) => {
             console.log(err)
          }
        })
        
      },
      error: (err) => {
        console.error("Login failed:", err.error.message);
        if (err.error?.errors) {
          this.serverErrors = err.error.errors;
        }
      }
    });
   
 }

}
