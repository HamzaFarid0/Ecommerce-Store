import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/authService/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone : true,
  imports : [ ReactiveFormsModule ,CommonModule , RouterModule
     
  ]
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  submitted: boolean = false;
  serverErrors: { [key: string]: string } = {};

  constructor(
    private _formBuilderService: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.signupForm = this._formBuilderService.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  submitForm(form: FormGroup) {
    this.submitted = true;
    this.serverErrors = {};
    if (this.signupForm.invalid) {
      return;
    }

    this._authService.signup(form).subscribe({
      next: (response) => {
        console.log(response);
        this._router.navigate(['../', 'verify-otp'], {
          relativeTo: this._activatedRoute,
        });
      },
      error: (err) => {
        console.log('Error during signup', err);
        if (err.error?.errors) {
          this.serverErrors = err.error.errors;
        }
      },
    });
  }
}
