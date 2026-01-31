import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule, ButtonSeverity } from 'primeng/button';

@Component({
  selector: 'app-button',
  imports: [ButtonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() severity: ButtonSeverity = 'primary';
  @Input() disabled: boolean = false;
  @Input() type: string = 'button';
  @Input() loading: boolean = false;

  @Output() onClick = new EventEmitter<void>();

  constructor() { }

  handleClick() {
    this.onClick.emit();
  }
}
