import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/serivces/auth.service';
import { pageRoutes } from '../../../shared/models/common.model';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo-container">
            <div class="logo-orb"></div>
            <span class="logo-text">MIS APP</span>
          </div>
          <h1>Create Account</h1>
          <p>Join us today! It only takes a minute to get started.</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-grid">
            <div class="form-field" [class.error]="isFieldInvalid('username')">
              <label for="username">Username</label>
              <input type="text" id="username" formControlName="username" placeholder="johndoe">
              <div class="error-msg" *ngIf="isFieldInvalid('username')">Required (min 3 chars)</div>
            </div>

            <div class="form-field" [class.error]="isFieldInvalid('email')">
              <label for="email">Email</label>
              <input type="email" id="email" formControlName="email" placeholder="john@example.com">
              <div class="error-msg" *ngIf="isFieldInvalid('email')">Valid email required</div>
            </div>
          </div>

          <div class="form-field" [class.error]="isFieldInvalid('password')">
            <label for="password">Password</label>
            <input type="password" id="password" formControlName="password" placeholder="••••••••">
            <div class="error-msg" *ngIf="isFieldInvalid('password')">Min 8 characters</div>
          </div>

          <div class="form-field" [class.error]="isFieldInvalid('confirmPassword')">
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" formControlName="confirmPassword" placeholder="••••••••">
            <div class="error-msg" *ngIf="isFieldInvalid('confirmPassword')">Passwords must match</div>
          </div>

          <div class="error-banner" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button type="submit" [disabled]="registerForm.invalid || isLoading" class="btn-submit">
            <span *ngIf="!isLoading">Create Account</span>
            <div class="loader" *ngIf="isLoading"></div>
          </button>
        </form>

        <div class="auth-footer">
          Already have an account? 
          <a [routerLink]="['/auth/login']">Sign In</a>
        </div>
      </div>
    </div>
  `,
    styles: [`
    :host { display: block; height: 100vh; width: 100%; }
    .auth-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at top right, #1e1b4b, #0f172a);
      padding: 20px;
      font-family: 'Inter', sans-serif;
    }
    .auth-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      width: 100%;
      max-width: 520px;
      padding: 40px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .auth-header { text-align: center; margin-bottom: 32px; }
    .logo-container { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 16px; }
    .logo-orb { width: 28px; height: 28px; background: linear-gradient(135deg, #6366f1, #a855f7); border-radius: 8px; }
    .logo-text { color: white; font-size: 20px; font-weight: 800; }
    h1 { color: white; font-size: 28px; font-weight: 700; margin: 0 0 8px; letter-spacing: -0.5px; }
    p { color: #94a3b8; font-size: 15px; margin: 0; }
    .auth-form { display: flex; flex-direction: column; gap: 20px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-field { display: flex; flex-direction: column; gap: 6px; }
    label { color: #e2e8f0; font-size: 13px; font-weight: 500; margin-left: 4px; }
    input {
      width: 100%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 12px 14px;
      color: white;
      font-size: 15px;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }
    input:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15); }
    .btn-submit {
      margin-top: 8px;
      padding: 14px;
      border-radius: 10px;
      border: none;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3); }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    .loader { width: 18px; height: 18px; border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 50%; border-top-color: white; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .error-banner { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #f87171; padding: 10px; border-radius: 10px; font-size: 13px; text-align: center; }
    .error-msg { color: #f87171; font-size: 11px; margin-top: 2px; }
    .auth-footer { margin-top: 24px; text-align: center; color: #94a3b8; font-size: 14px; }
    .auth-footer a { color: #6366f1; text-decoration: none; font-weight: 600; margin-left: 4px; }
  `]
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    registerForm: FormGroup;
    isLoading = false;
    errorMessage: string | null = null;

    constructor() {
        this.registerForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required]],
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('password')?.value === g.get('confirmPassword')?.value
            ? null : { mismatch: true };
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.registerForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    onSubmit() {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.errorMessage = null;

        this.authService.register(this.registerForm.value).subscribe({
            next: (res) => {
                if (res.isSuccess) {
                    this.router.navigate([`/${pageRoutes.dashboard}`]);
                } else {
                    this.errorMessage = res.message || 'Registration failed.';
                    this.isLoading = false;
                }
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'An error occurred during registration.';
                this.isLoading = false;
            }
        });
    }
}
