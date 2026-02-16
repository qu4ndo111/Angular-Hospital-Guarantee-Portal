import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-card',
  imports: [CardModule, NgClass, SkeletonModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  @Input() icon: string = 'pi-box';
  @Input() value: string | number = 0;
  @Input() label: string = 'default';
  @Input() width?: string = '15rem';
  @Input() clickable?: boolean = false;
  @Input() loading?: boolean = false;

  @Output() click?: EventEmitter<void> = new EventEmitter();

  onClick() {
    if (this.clickable) this.click?.emit();
  }
}
