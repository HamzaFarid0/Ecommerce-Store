import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/authService/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-reset-passwrod',
  standalone: true,
  templateUrl: './reset-passwrod.component.html',
  styleUrls: ['./reset-passwrod.component.css'],
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
})
export class ResetPasswrodComponent {
  resetPasswordForm!: FormGroup;
  token!: string;
  submitted: boolean = false;
  passwordMismatch: boolean = false;
  successMessage: string = '';
  serverErrors: { [key: string]: string } = {};

  constructor(
    private _formBuilderService: FormBuilder,
    private _authService: AuthService,
    private _activatedRoute: ActivatedRoute,
    private _router : Router,
       private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this._formBuilderService.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    });

    this.token = this._activatedRoute.snapshot.paramMap.get('token')!;
    console.log(this.token);
  }

  showSuccess(message : string) {
    this.toast.success({detail:"SUCCESS",summary: `${message}` , duration:3000});
  }

  submit(form: FormGroup) {
    this.submitted = true;
    this.passwordMismatch = false;
    const { password, confirmPassword } = form.value;
    if (form.invalid) return;
    if (password !== confirmPassword) {
      this.passwordMismatch = true;
      return;
    }

    this._authService.resetPassword(form, this.token).subscribe({
      next: (res) => {
        this.serverErrors = {};
        this.showSuccess(res.message)
        this._router.navigate(['/login'])
      
      },
      error: (err) => {
        this.successMessage = '';
        this.serverErrors = err.error.errors;
      },
    });
  }
}






