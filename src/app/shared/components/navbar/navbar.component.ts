import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { AuthService } from '../../../core/serivces/auth.service';
import { ThemeService } from '../../services/theme.service';
import { LanguageService } from '../../services/language.service';
import { Router, RouterModule } from '@angular/router';
import { pageRoutes } from '../../../shared/models/common.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, AsyncPipe],
  template: `
    <nav class="navbar navbar-expand-lg border-bottom px-4 shadow-sm glass-nav sticky-top">
      <div class="container-fluid">
        <span class="navbar-brand fw-bold text-gradient">MIS APP</span>

        <div class="ms-auto d-flex align-items-center gap-3">

          <!-- Language Toggle -->
          <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" (click)="langService.toggleLanguage()">
            <i class="fas fa-globe me-1"></i>
            {{ langService.currentLang() === 'en' ? 'العربية' : 'English' }}
          </button>

          <!-- Theme Toggle -->
          <button class="btn btn-sm border-0 rounded-circle theme-icon" (click)="themeService.toggleTheme()">
            <i class="fas" [ngClass]="themeService.isDarkMode() ? 'fa-sun text-warning' : 'fa-moon text-primary'"></i>
          </button>

          <!-- User Profile -->
          @if (authService.user$ | async; as user) {
            <div class="dropdown">
              <button class="btn border-0 d-flex align-items-center gap-2 p-1" type="button" data-bs-toggle="dropdown">
                <div class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center">
                  {{ user.username.charAt(0).toUpperCase() }}
                </div>
                <div class="d-none d-md-block text-start">
                  <div class="small fw-bold lh-1">{{ user.nickname || user.username }}</div>
                  <div class="smaller text-muted">{{ user.email }}</div>
                </div>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                <li>
                  <a class="dropdown-item py-2" [routerLink]="pageRoutes.profile">
                    <i class="fas fa-user-circle me-2"></i> Profile
                  </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item py-2 text-danger" (click)="logout()" href="javascript:void(0)">
                    <i class="fas fa-sign-out-alt me-2"></i> Logout
                  </a>
                </li>
              </ul>
            </div>
          }

        </div>
      </div>
    </nav>
  `,
  styles: [`
    .glass-nav {
      background: var(--nav-bg);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-color: var(--border-color) !important;
      z-index: 1050;
    }
    .theme-icon {
      width: 36px;
      height: 36px;
      background: var(--border-color);
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-main);
    }
    .theme-icon:hover {
      background: var(--text-muted);
      color: white;
    }
    .avatar {
      width: 38px;
      height: 38px;
      font-size: 16px;
      font-weight: bold;
      border: 2px solid var(--border-color);
    }
    .smaller { font-size: 0.75rem; }
    .navbar-brand { color: var(--text-main) !important; }
  `]
})
export class NavbarComponent {
  authService  = inject(AuthService);
  themeService = inject(ThemeService);
  langService  = inject(LanguageService);
  private router = inject(Router);
  pageRoutes = pageRoutes;

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
