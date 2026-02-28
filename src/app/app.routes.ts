import { UsersMgmtComponent } from './features/rbac/users-mgmt/users-mgmt.component';
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { guestGuard } from './core/guards/guest.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ActionTypes, Modules, pageRoutes, Permissions } from './shared/models/common.model';

export const routes: Routes = [
    {
        path: pageRoutes.auth.login,
        component: LoginComponent,
        canActivate: [guestGuard]
    },
    {
        path: pageRoutes.auth.register,
        component: RegisterComponent,
        canActivate: [guestGuard]
    },
    {
        path: pageRoutes.root,
        component: MainLayoutComponent,
        children: [
            {
                path: pageRoutes.root,
                component: DashboardComponent,
                canActivate: [authGuard],
                pathMatch: 'full'
            },
            {
                path: pageRoutes.orders,
                loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
                canActivate: [authGuard, roleGuard],
                data: { permissions: [Permissions.Orders.Read] }
            },
            {
                path: pageRoutes.users,
                loadComponent: () => import('./features/rbac/users-mgmt/users-mgmt.component').then(m => m.UsersMgmtComponent),
                canActivate: [authGuard, roleGuard],
                data: { permissions: [Permissions.Users.Read] }
            },
            {
                path: pageRoutes.profile,
                loadComponent: () => import('./features/auth/user-profile.component').then(m => m.UserProfileComponent),
                canActivate: [authGuard]
            },
            {
                path: pageRoutes.roles,
                loadComponent: () => import('./features/rbac/roles-mgmt/roles-mgmt.component').then(m => m.RolesMgmtComponent),
                canActivate: [authGuard, roleGuard],
                data: { permissions: [Permissions.RolesModule.Read] }
            },
            {
                path: pageRoutes.permissions,
                loadComponent: () => import('./features/rbac/permissions-mgmt/permissions-mgmt.component').then(m => m.PermissionsMgmtComponent),
                canActivate: [authGuard, roleGuard],
                data: { permissions: [Permissions.RolesModule.Read] }
            },
            {
                path: pageRoutes.modules,
                loadComponent: () => import('./features/rbac/modules-mgmt/modules-mgmt.component').then(m => m.ModulesMgmtComponent),
                canActivate: [authGuard, roleGuard],
                data: { permissions: [Permissions.RolesModule.Read] }
            },
            {
                path: pageRoutes.rolePermissions,
                loadComponent: () => import('./features/rbac/role-permissions-mgmt/role-permissions-mgmt.component').then(m => m.RolePermissionsMgmtComponent),
                canActivate: [authGuard, roleGuard],
                data: { permissions: [Permissions.RolesModule.Read] }
            },
            {
                path: pageRoutes.userPermissions,
                loadComponent: () => import('./features/rbac/user-permissions-mgmt/user-permissions-mgmt.component').then(m => m.UserPermissionsMgmtComponent),
                canActivate: [authGuard, roleGuard],
                data: { permissions: [Permissions.Users.Read] }
            },
            {
                path: pageRoutes.userRoles,
                loadComponent: () => import('./features/rbac/user-roles-mgmt/user-roles-mgmt.component').then(m => m.UserRolesMgmtComponent),
                canActivate: [authGuard, roleGuard],
                data: { permissions: [Permissions.Users.Read] }
            },
            {
                path: 'forms-demo',
                loadComponent: () => import('./features/forms-demo/forms-demo.component').then(m => m.FormsDemoComponent),
                canActivate: [authGuard]
            },
            {
                path: 'ocr-extractor',
                loadComponent: () => import('./features/ocr-extractor/ocr-extractor.component').then(m => m.OcrExtractorComponent),
                canActivate: [authGuard]
            },
            {
                path: 'search-demo',
                loadComponent: () => import('./features/orders-search/orders-search.component').then(m => m.OrdersSearchComponent),
                canActivate: [authGuard]
            }
        ]
    },
    {
        path: pageRoutes.home,
        component: HomeComponent
    },
    {
        path: '**',
        redirectTo: pageRoutes.home
    }
];
