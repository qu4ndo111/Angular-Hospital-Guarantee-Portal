import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-template',
  standalone: true,
  template: `
    <div class="error-state">
      <div class="error-state__card">
        <div class="error-state__icon">
          <i [class]="icon"></i>
        </div>
        @if (title) {
          <h4 class="error-state__title">{{ title }}</h4>
        }
        @if (desc) {
          <p class="error-state__desc">{{ desc }}</p>
        }
        @if (showRetry) {
          <button class="error-state__retry" (click)="onRetry()">
            <i class="pi pi-refresh"></i>
            {{ retryText }}
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .error-state {
      padding: 1rem 0 2rem;
      animation: fadeInUp 0.35s ease both;

      &__card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3.5rem 1rem;
        background: var(--bg-card);
        border: 1px solid color-mix(in srgb, #ef4444 30%, transparent);
        border-radius: var(--border-radius);
        text-align: center;
      }

      &__icon {
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        background: color-mix(in srgb, #ef4444 12%, transparent);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;

        i {
          font-size: 1.75rem;
          color: #ef4444;
        }
      }

      &__title {
        font-size: 1.05rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.4rem;
      }

      &__desc {
        font-size: 0.875rem;
        color: var(--text-muted);
        max-width: 28rem;
        margin: 0 0 1.25rem;
        line-height: 1.55;
      }

      &__retry {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.55rem 1.25rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: #ef4444;
        background: transparent;
        border: 1.5px solid #ef4444;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: background 0.2s, color 0.2s, transform 0.15s;

        &:hover {
          background: #ef4444;
          color: #fff;
          transform: translateY(-1px);
        }
      }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ErrorTemplateComponent {
  @Input() title: string = '';
  @Input() desc: string = '';
  @Input() retryText: string = 'Retry';
  @Input() icon: string = 'pi pi-exclamation-circle';
  @Input() showRetry: boolean = true;

  @Output() retry = new EventEmitter<void>();

  onRetry() {
    this.retry.emit();
  }
}
