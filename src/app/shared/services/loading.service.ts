import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Global loading state service
 *
 * @example
 * // In component
 * constructor(private loadingService: LoadingService) {}
 *
 * this.loadingService.show();
 * await someAsyncOperation();
 * this.loadingService.hide();
 *
 * // Or with auto-hide
 * this.loadingService.show();
 * this.http.get('api/data')
 *   .pipe(finalize(() => this.loadingService.hide()))
 *   .subscribe();
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  private requestCount = 0;

  show(): void {
    this.requestCount++;
    this.loadingSubject.next(true);
  }

  hide(): void {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.loadingSubject.next(false);
    }
  }

  forceHide(): void {
    this.requestCount = 0;
    this.loadingSubject.next(false);
  }

  isLoading(): boolean {
    return this.loadingSubject.value;
  }
}
