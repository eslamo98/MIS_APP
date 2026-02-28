import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../serivces/auth.service';
import { pageRoutes } from '../../shared/models/common.model';

export const guestGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        // If logged in, redirect to dashboard
        router.navigate([`/${pageRoutes.dashboard}`]);
        return false;
    }

    return true;
};
