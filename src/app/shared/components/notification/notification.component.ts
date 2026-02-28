import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/serivces/notification.service';

@Component({
    selector: 'app-notification-container',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="notification-container" [ngClass]="pos()">
      <div *ngFor="let note of notifications()" 
           class="notification-toast animate-slide" 
           [ngClass]="note.type">
        
        <div class="toast-icon">
          <i class="fas" [ngClass]="getIcon(note.type)"></i>
        </div>

        <div class="toast-content">
          <div class="toast-title" *ngIf="note.title">{{ note.title }}</div>
          <div class="toast-message">{{ note.message }}</div>
        </div>

        <button class="toast-close" (click)="remove(note.id)">
          <i class="fas fa-times"></i>
        </button>

        <div class="toast-progress" [style.animation-duration.ms]="note.duration"></div>
      </div>
    </div>
  `,
    styles: [`
    .notification-container {
      position: fixed;
      z-index: 9999;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    }

    /* Positions */
    .top-right { top: 0; right: 0; }
    .top-left { top: 0; left: 0; }
    .bottom-right { bottom: 0; right: 0; flex-direction: column-reverse; }
    .bottom-left { bottom: 0; left: 0; flex-direction: column-reverse; }
    .top-center { top: 0; left: 50%; transform: translateX(-50%); align-items: center; }
    .bottom-center { bottom: 0; left: 50%; transform: translateX(-50%); align-items: center; flex-direction: column-reverse; }

    .notification-toast {
      min-width: 320px;
      max-width: 450px;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      position: relative;
      overflow: hidden;
      pointer-events: auto;
      backdrop-filter: blur(8px);
    }

    .toast-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .toast-content { flex: 1; }
    .toast-title { font-weight: 700; font-size: 0.95rem; margin-bottom: 4px; color: var(--text-main); }
    .toast-message { font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; }

    .toast-close {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 4px;
      opacity: 0.6;
      transition: opacity 0.2s;
    }
    .toast-close:hover { opacity: 1; }

    /* Types Styling */
    .success .toast-icon { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .error .toast-icon { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
    .warning .toast-icon { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    .info .toast-icon { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }

    .success { border-left: 4px solid #10b981; }
    .error { border-left: 4px solid #ef4444; }
    .warning { border-left: 4px solid #f59e0b; }
    .info { border-left: 4px solid #3b82f6; }

    /* Progress Bar */
    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: currentColor;
      opacity: 0.3;
      width: 100%;
      transform-origin: left;
      animation: shrink linear forwards;
    }

    @keyframes shrink {
      from { transform: scaleX(1); }
      to { transform: scaleX(0); }
    }

    /* Animations */
    .animate-slide {
      animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(20px) scale(0.9); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `]
})
export class NotificationComponent {
    private service = inject(NotificationService);

    notifications = this.service.activeNotifications;
    pos = this.service.currentPosition;

    remove(id: number) {
        this.service.remove(id);
    }

    getIcon(type: string): string {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-times-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }
}
