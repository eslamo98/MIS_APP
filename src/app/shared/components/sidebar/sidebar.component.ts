import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/serivces/auth.service';
import { ActionTypes, Modules, pageRoutes } from '../../models/common.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar d-flex flex-column border-end position-sticky top-0 h-100 py-3">
      <div class="px-3 mb-4 d-flex align-items-center gap-2">
        <i class="fas fa-shield-alt text-primary fs-4"></i>
        <span class="fs-5 fw-bold text-white">Console</span>
      </div>

      <div class="flex-grow-1 px-2 scroll-area">
        <ul class="nav nav-pills flex-column gap-1">
          <!-- Always visible Dashboard -->
          <li class="nav-item">
            <a [routerLink]="['/' + pageRoutes.root]" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
              <i class="fas fa-tachometer-alt me-2 w-20"></i> Dashboard
            </a>
          </li>

          <!-- Orders Module -->
          <li class="nav-item" *ngIf="authService.checkPermission(ActionTypes.Read, Modules.Orders)">
            <a [routerLink]="['/' + pageRoutes.orders]" routerLinkActive="active" class="nav-link">
              <i class="fas fa-shopping-cart me-2 w-20"></i> Orders
            </a>
          </li>

          <!-- RBAC Section -->
          <li class="nav-item mt-3">
            <div class="small fw-bold text-muted text-uppercase mb-2 px-3 opacity-50">RBAC System</div>
          </li>

          <li class="nav-item" *ngIf="authService.checkPermission(ActionTypes.Read, Modules.Users)">
            <a [routerLink]="['/' + pageRoutes.users]" routerLinkActive="active" class="nav-link">
              <i class="fas fa-users me-2 w-20"></i> Users
            </a>
          </li>

          <li class="nav-item" *ngIf="authService.checkPermission(ActionTypes.Read, Modules.Roles)">
            <a [routerLink]="['/' + pageRoutes.roles]" routerLinkActive="active" class="nav-link">
              <i class="fas fa-user-shield me-2 w-20"></i> Role List
            </a>
          </li>

          <li class="nav-item" *ngIf="authService.checkPermission(ActionTypes.Read, Modules.Roles)">
            <a [routerLink]="['/' + pageRoutes.permissions]" routerLinkActive="active" class="nav-link">
              <i class="fas fa-key me-2 w-20"></i> Permission List
            </a>
          </li>

          <li class="nav-item" *ngIf="authService.checkPermission(ActionTypes.Read, Modules.Roles)">
            <a [routerLink]="['/' + pageRoutes.modules]" routerLinkActive="active" class="nav-link">
              <i class="fas fa-th-large me-2 w-20"></i> System Modules
            </a>
          </li>

          <li class="nav-item mt-3">
            <div class="small fw-bold text-muted text-uppercase mb-2 px-3 opacity-50">Security Mapping</div>
          </li>

          <li class="nav-item" *ngIf="authService.checkPermission(ActionTypes.Read, Modules.Roles)">
            <a [routerLink]="['/' + pageRoutes.rolePermissions]" routerLinkActive="active" class="nav-link">
              <i class="fas fa-shield-alt me-2 w-20"></i> Role Permissions
            </a>
          </li>

          <li class="nav-item" *ngIf="authService.checkPermission(ActionTypes.Read, Modules.Users)">
            <a [routerLink]="['/' + pageRoutes.userRoles]" routerLinkActive="active" class="nav-link">
              <i class="fas fa-user-tag me-2 w-20"></i> User Roles
            </a>
          </li>

          <li class="nav-item" *ngIf="authService.checkPermission(ActionTypes.Read, Modules.Users)">
            <a [routerLink]="['/' + pageRoutes.userPermissions]" routerLinkActive="active" class="nav-link">
              <i class="fas fa-id-badge me-2 w-20"></i> User Direct Pers.
            </a>
          </li>

          <!-- Features Section -->
          <li class="nav-item mt-3">
            <div class="small fw-bold text-muted text-uppercase mb-2 px-3 opacity-50">Features</div>
          </li>

          <li class="nav-item">
            <a routerLink="/forms-demo" routerLinkActive="active" class="nav-link">
              <i class="fas fa-wpforms me-2 w-20"></i> Form Engine
            </a>
          </li>

          <li class="nav-item">
            <a routerLink="/ocr-extractor" routerLinkActive="active" class="nav-link">
              <i class="fas fa-wpforms me-2 w-20"></i> OCR Engine
            </a>
          </li>

          <li class="nav-item">
            <a routerLink="/search-demo" routerLinkActive="active" class="nav-link">
              <i class="fas fa-search me-2 w-20"></i> Search System
            </a>
          </li>
        </ul>
      </div>

      <div class="px-3 pt-3 border-top mt-auto">
        <div class="small fw-bold text-muted text-uppercase mb-2 px-2">Support</div>
        <a href="#" class="nav-link small opacity-75 d-flex align-items-center">
            <i class="fas fa-question-circle me-2"></i> Documentation
        </a>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 270px;
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-color);
      min-height: calc(100vh - 64px);
      transition: all 0.3s ease;
    }
    .nav-link {
      color: var(--text-muted);
      border-radius: 12px;
      padding: 12px 18px;
      margin: 2px 0;
      font-weight: 500;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .nav-link:hover {
      background: rgba(99, 102, 241, 0.05);
      color: #7c3aed;
      transform: translateX(4px);
    }
    [dir="rtl"] .nav-link:hover {
      transform: translateX(-4px);
    }
    .nav-link.active {
      background: var(--primary-gradient) !important;
      color: white !important;
      box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
    }
    .w-20 { width: 24px; text-align: center; }
    .scroll-area {
      overflow-y: auto;
      max-height: calc(100vh - 180px);
    }
    .text-white { color: var(--text-main) !important; }
  `]
})
export class SidebarComponent {
  authService = inject(AuthService);
  ActionTypes = ActionTypes;
  Modules = Modules;
  pageRoutes = pageRoutes;
}
