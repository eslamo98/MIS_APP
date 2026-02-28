import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../serivces/auth.service';
import { pageRoutes } from '../../shared/models/common.model';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate([`/${pageRoutes.auth.login}`]);
  return false;
};
