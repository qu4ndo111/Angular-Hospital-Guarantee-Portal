import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';

/**
 * STAT Card Component - Reusable statistics card
 *
 * @example
 * <app-card icon="pi pi-users" value="2,847" label="Total Users" />
 * <app-card icon="pi pi-dollar" value="$45,230" label="Revenue" iconBg="#10b981" />
 * <app-card icon="pi pi-box" [value]="orders" label="Orders" [loading]="isLoading" />
 */
@Component({
  selector: 'app-card',
  imports: [CardModule, NgClass, SkeletonModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  /** PrimeIcons class  e.g. "pi pi-users" */
  @Input() icon: string = 'pi pi-box';

  /** Main metric value e.g. "2,847" or "$45,230" */
  @Input() value: string | number = 0;

  /** Descriptive label e.g. "Total Users" */
  @Input() label: string = '';

  /** Icon circle background color. Defaults to --color-primary */
  @Input() iconBg?: string;

  /** Show hover effect and pointer cursor */
  @Input() clickable: boolean = false;

  /** Show skeleton loader instead of content */
  @Input() loading: boolean = false;

  @Output() cardClick = new EventEmitter<void>();

  onClick() {
    if (this.clickable) this.cardClick.emit();
  }
}
