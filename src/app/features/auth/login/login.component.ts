import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/serivces/auth.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { pageRoutes } from '../../../shared/models/common.model';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private loadingService = inject(LoadingService);
    private router = inject(Router);

    loginForm: FormGroup;
    errorMessage: string | null = null;
    showPassword = false;

    constructor() {
        this.loginForm = this.fb.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            rememberMe: [false]
        });
    }

    get isLoading(): boolean {
        return this.loadingService.isLoading;
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.loginForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    onSubmit() {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.loadingService.show();
        this.errorMessage = null;

        this.authService.login(this.loginForm.value).subscribe({
            next: (response) => {
                this.loadingService.hide();
                if (response.isSuccess) {
                    this.router.navigate([`/${pageRoutes.dashboard}`]);
                } else {
                    this.errorMessage = response.message || 'Login failed.';
                }
            },
            error: (err) => {
                this.loadingService.hide();
                this.errorMessage = err.error?.message || 'A network error occurred.';
            }
        });
    }
}
