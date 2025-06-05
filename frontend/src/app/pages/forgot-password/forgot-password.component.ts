import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/authService/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  imports : [ ReactiveFormsModule , CommonModule , RouterModule]
})

export class ForgotPasswordComponent implements OnInit{

  forgotPasswordForm! : FormGroup
    submitted: boolean = false;
    successMessage : string = ''
  serverErrors: { [key: string]: string } = {};

    constructor(private _formBuilderService : FormBuilder,
                private _authService : AuthService,
    ){}

    ngOnInit(): void {
      this.forgotPasswordForm = this._formBuilderService.group({
          email: ['', [Validators.required, Validators.email]],
      })
    }

    submit(form : FormGroup){
      this.submitted=true
      this._authService.forgotPassword(form).subscribe({
        next : (res) => {
          this.serverErrors={}
          this.successMessage=res.message
        },
        error : (err) => {
        if (err.error?.errors) {
          this.successMessage=''
          this.serverErrors = err.error.errors;
        }
        }
      })
    }

}
