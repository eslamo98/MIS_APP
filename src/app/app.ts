import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingService } from './shared/services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <router-outlet></router-outlet>
    
    <!-- Global Loading Spinner -->
    <div class="loading-overlay" *ngIf="loadingService.loading$ | async">
      <div class="spinner-container">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-white fw-bold">Processing...</p>
      </div>
    </div>
  `,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('MIS_APP');
  public loadingService = inject(LoadingService);
}
