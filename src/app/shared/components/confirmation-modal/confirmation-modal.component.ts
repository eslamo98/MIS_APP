import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalTemplateComponent } from '../modal-template/modal-template.component';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, ModalTemplateComponent],
  template: `
    @if (isOpen()) {
      <app-modal-template
          [title]="title()"
          [showFooter]="true"
          (close)="onCancel()">

        <!-- Body -->
        <div class="confirm-body">
          <div class="confirm-icon-wrap">
            <div class="confirm-icon" [ngClass]="iconVariantClass()">
              <i [class]="'fas fa-' + confirmIcon()"></i>
            </div>
          </div>
          <p class="confirm-message">{{ message() }}</p>
        </div>

        <!-- Footer -->
        <div footer class="d-flex gap-2 justify-content-end w-100">
          <button type="button" class="btn-cancel" (click)="onCancel()">
            <i class="fas fa-times me-1"></i> {{ cancelLabel() }}
          </button>
          <button type="button" class="btn-confirm" [ngClass]="btnVariantClass()" (click)="onConfirm()">
            <i [class]="'fas fa-' + confirmIcon() + ' me-1'"></i> {{ confirmLabel() }}
          </button>
        </div>

      </app-modal-template>
    }
  `,
  styles: [`
    .confirm-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 0.5rem 1rem 1rem;
    }
    .confirm-icon-wrap { margin-bottom: 1.25rem; }
    .confirm-icon {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
    }
    .confirm-icon.variant-danger {
      background: rgba(239, 68, 68, 0.12);
      color: #ef4444;
      border: 2px solid rgba(239, 68, 68, 0.25);
      animation: pulse-danger 1.8s ease-in-out infinite;
    }
    @keyframes pulse-danger {
      0%, 100% { box-shadow: 0 0 0 0   rgba(239, 68, 68, 0.3); }
      50%       { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
    }
    .confirm-icon.variant-success {
      background: rgba(16, 185, 129, 0.12);
      color: #10b981;
      border: 2px solid rgba(16, 185, 129, 0.25);
      animation: pulse-success 1.8s ease-in-out infinite;
    }
    @keyframes pulse-success {
      0%, 100% { box-shadow: 0 0 0 0   rgba(16, 185, 129, 0.3); }
      50%       { box-shadow: 0 0 0 12px rgba(16, 185, 129, 0); }
    }
    .confirm-icon.variant-warning {
      background: rgba(245, 158, 11, 0.12);
      color: #f59e0b;
      border: 2px solid rgba(245, 158, 11, 0.25);
      animation: pulse-warning 1.8s ease-in-out infinite;
    }
    @keyframes pulse-warning {
      0%, 100% { box-shadow: 0 0 0 0   rgba(245, 158, 11, 0.3); }
      50%       { box-shadow: 0 0 0 12px rgba(245, 158, 11, 0); }
    }
    .confirm-icon.variant-primary {
      background: rgba(99, 102, 241, 0.12);
      color: #6366f1;
      border: 2px solid rgba(99, 102, 241, 0.25);
      animation: pulse-primary 1.8s ease-in-out infinite;
    }
    @keyframes pulse-primary {
      0%, 100% { box-shadow: 0 0 0 0   rgba(99, 102, 241, 0.3); }
      50%       { box-shadow: 0 0 0 12px rgba(99, 102, 241, 0); }
    }
    .confirm-message {
      font-size: 1rem;
      color: var(--text-main);
      line-height: 1.6;
      margin: 0;
      max-width: 380px;
      white-space: pre-line;
    }
    .btn-cancel, .btn-confirm {
      display: inline-flex;
      align-items: center;
      padding: 0.55rem 1.4rem;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
    }
    .btn-cancel {
      background: var(--bg-surface, #1e293b);
      color: var(--text-muted, #94a3b8);
      border: 1px solid var(--border-color, #334155);
    }
    .btn-cancel:hover {
      background: var(--bg-hover, #334155);
      color: var(--text-main, #f1f5f9);
    }
    .btn-confirm.btn-danger {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: #fff;
      box-shadow: 0 4px 14px rgba(239, 68, 68, 0.35);
    }
    .btn-confirm.btn-danger:hover {
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
      transform: translateY(-1px);
    }
    .btn-confirm.btn-success {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #fff;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
    }
    .btn-confirm.btn-success:hover {
      background: linear-gradient(135deg, #059669, #047857);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
      transform: translateY(-1px);
    }
    .btn-confirm.btn-warning {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #fff;
      box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);
    }
    .btn-confirm.btn-warning:hover {
      background: linear-gradient(135deg, #d97706, #b45309);
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.5);
      transform: translateY(-1px);
    }
    .btn-confirm.btn-primary {
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: #fff;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
    }
    .btn-confirm.btn-primary:hover {
      background: linear-gradient(135deg, #4f46e5, #3730a3);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
      transform: translateY(-1px);
    }
    .btn-confirm:active { transform: translateY(0); }
  `]
})
export class ConfirmationModalComponent {
  isOpen        = input<boolean>(false);
  title         = input<string>('Confirm Deletion');
  message       = input<string>('Are you sure you want to delete this item? This action cannot be undone.');
  confirmLabel  = input<string>('Delete');
  cancelLabel   = input<string>('Cancel');
  confirmIcon   = input<string>('trash-alt');
  confirmVariant = input<'danger' | 'success' | 'warning' | 'primary'>('danger');

  confirmed = output<void>();
  cancelled = output<void>();

  iconVariantClass = computed(() => `variant-${this.confirmVariant()}`);
  btnVariantClass  = computed(() => `btn-${this.confirmVariant()}`);

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
