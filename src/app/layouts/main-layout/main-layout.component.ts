import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NotificationComponent } from '../../shared/components/notification/notification.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent, NotificationComponent],
  template: `
    <app-notification-container></app-notification-container>
    <div class="app-container d-flex flex-column h-100">
      <!-- Top Navbar -->
      <app-navbar></app-navbar>

      <div class="d-flex flex-grow-1 overflow-hidden">
        <!-- Sidebar -->
        <app-sidebar class="d-none d-lg-block"></app-sidebar>

        <!-- Main Content Area -->
        <main class="flex-grow-1 overflow-auto p-4 content-bg">
          <div class="container-fluid animate-fade-in">
             <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      overflow: hidden;
      background-color: var(--bg-app);
    }
    .content-bg {
      background: var(--bg-app);
    }
    .animate-fade-in {
      animation: fadeIn 0.4s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class MainLayoutComponent { }
