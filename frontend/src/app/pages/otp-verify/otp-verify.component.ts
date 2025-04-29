import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/authService/auth.service';

@Component({
  selector: 'app-otp-verify',
  templateUrl: './otp-verify.component.html',
  styleUrls: ['./otp-verify.component.css'],
  standalone : true,
  imports : [ FormsModule , CommonModule

  ]
})
export class OtpVerifyComponent {

  otp: string = '';
  isResendDisabled = false;
  resendTimer = 30; 
  otpServerErrorMsg! : string

  constructor( private _authService : AuthService,
               private _router : Router,
               private _activatedRoute : ActivatedRoute  
   ){}

   clearOtpServerErrorMsg() {
    setTimeout(() => {
        this.otpServerErrorMsg = ''
    },10000)
   }

  // ✅ Auto-removes non-numeric characters
  onInputChange() {
    this.otp = this.otp.replace(/\D/g, '').slice(0, 6);
  }

  verifyOtp() {
    this._authService.verifyOtp(this.otp).subscribe({
      next: (response) => {
        console.log('✅ OTP verified successfully!');
        this._router.navigate(['../', 'login'], { relativeTo: this._activatedRoute });
        sessionStorage.removeItem('email-for-verification');

      },
      error: (err) => {
        
        console.error('❌ Error:', err.error.message);
        this.otpServerErrorMsg = err.error.message
        this.clearOtpServerErrorMsg()
      },
    });
  }
  

  // ✅ Handle Resend OTP
  resendOtp() {
    this.otpServerErrorMsg = ''
    this._authService.resendOtp().subscribe({
      next: (response) => {
        if (response) {
          console.log('✅ OTP verified successfully!');

        } else {
          console.log('❌ Invalid OTP. Try again.');
        }
      },
      error: (err) => {
        console.log('⚠️ Error verifying OTP:', err.message);

      },
    });
    if (this.isResendDisabled) return;

    console.log('Resending OTP...');
    this.isResendDisabled = true;
    this.resendTimer = 30; // Reset timer

    
    const interval = setInterval(() => {
      if (this.resendTimer > 0) {
        this.resendTimer--;
      } else {
        this.isResendDisabled = false;
        clearInterval(interval);
      }
    }, 1000);
  }

}
