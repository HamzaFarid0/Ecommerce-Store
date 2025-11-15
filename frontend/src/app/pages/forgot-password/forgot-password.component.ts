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

    isResendDisabled: boolean = false;
  countdown: number = 30;
  private timerId: ReturnType<typeof setInterval> | null = null;

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
             this.startResendTimer();
                   setTimeout(() => {
          this.successMessage = "";
        }, 30000);
        },
        error : (err) => {
        if (err.error?.errors) {
          this.successMessage=''
          this.serverErrors = err.error.errors;
        }
        }
      })
    }

      resendLink() {
    if (this.forgotPasswordForm.invalid) return;

    this._authService.forgotPassword(this.forgotPasswordForm).subscribe({
      next: (res) => {
        this.successMessage = 'A new password reset link has been sent.';
        
      }
    });
  }

 private startResendTimer() {
    // reset if already running
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }

    this.countdown = 30;
    this.isResendDisabled = true;

    this.timerId = setInterval(() => {
      this.countdown -= 1;
      if (this.countdown <= 0) {
        if (this.timerId) {
          clearInterval(this.timerId);
          this.timerId = null;
        }
        this.isResendDisabled = false;
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}
