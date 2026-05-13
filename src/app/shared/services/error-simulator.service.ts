import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorSimulatorService {
  readonly simulateError = signal<boolean>(false);

  toggle(): void {
    this.simulateError.update(v => !v);
  }

  enable(): void {
    this.simulateError.set(true);
  }

  disable(): void {
    this.simulateError.set(false);
  }
}
