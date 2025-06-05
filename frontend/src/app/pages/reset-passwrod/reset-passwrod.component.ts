import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/authService/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

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
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this._formBuilderService.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    });

    this.token = this._activatedRoute.snapshot.paramMap.get('token')!;
    console.log(this.token);
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
        this.successMessage = res.message;
      },
      error: (err) => {
        this.successMessage = '';
        this.serverErrors = err.error.errors;
      },
    });
  }
}
