import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../serivces/auth.service';
import { pageRoutes } from '../../shared/models/common.model';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data?.['roles'] as string[];
  const requiredPermissions = route.data?.['permissions'] as string[];

  // 1. Check Roles if any
  const hasRole = !requiredRoles || requiredRoles.length === 0 ||
    requiredRoles.some(role => authService.hasRole(role));

  // 2. Check Permissions if any
  const user = authService.currentUserValue();
  const userPermissions = user?.permissions || [];

  const hasPermission = !requiredPermissions || requiredPermissions.length === 0 ||
    requiredPermissions.some(p => authService.hasPermission(p));

  if (hasRole && hasPermission) {
    return true;
  }

  // Unauthorized access
  console.warn('Unauthorized access attempt to:', route.url.toString(), {
    requiredPermissions,
    userPermissions,
    hasRole,
    hasPermission
  });

  router.navigate([`/${pageRoutes.dashboard}`]);
  return false;
};
