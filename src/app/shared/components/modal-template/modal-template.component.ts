import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-modal-template',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="modal-overlay animate-fade-in" (click)="close.emit()">
      <div class="modal-content-wrapper animate-slide-up" (click)="$event.stopPropagation()">

        <!-- Modal Header -->
        <div class="modal-header d-flex justify-content-between align-items-center">
          <h5 class="modal-title fw-bold mb-0">{{ title() }}</h5>
          <button type="button" class="btn-close-custom" (click)="close.emit()">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <ng-content></ng-content>
        </div>

        <!-- Optional Footer -->
        @if (showFooter()) {
          <div class="modal-footer">
            <ng-content select="[footer]"></ng-content>
          </div>
        }

      </div>
    </div>
  `,
    styles: [`
    .modal-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(8px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .modal-content-wrapper {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 24px;
      width: 100%;
      max-width: 800px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .modal-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--border-color);
      background: rgba(255, 255, 255, 0.02);
    }
    .modal-title {
      color: var(--text-main);
      letter-spacing: -0.5px;
    }
    .modal-body {
      padding: 2rem;
      overflow-y: auto;
      flex: 1;
    }
    .modal-footer {
      padding: 1.5rem 2rem;
      border-top: 1px solid var(--border-color);
      background: rgba(255, 255, 255, 0.02);
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .btn-close-custom {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 1.2rem;
      cursor: pointer;
      transition: all 0.2s;
      width: 32px; height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
    .btn-close-custom:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(40px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
  `]
})
export class ModalTemplateComponent {
    title      = input<string>('Modal Title');
    showFooter = input<boolean>(false);
    close      = output<void>();
}
