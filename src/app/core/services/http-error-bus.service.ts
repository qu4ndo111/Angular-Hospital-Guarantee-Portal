import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpErrorBus {
  readonly error$ = new Subject<string>();

  emit(message: string): void {
    this.error$.next(message);
  }
}
