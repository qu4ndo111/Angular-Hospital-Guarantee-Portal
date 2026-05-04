import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  isMobileSidebarVisible = signal(false);

  toggleMobileSidebar() {
    this.isMobileSidebarVisible.update(v => !v);
  }

  closeMobileSidebar() {
    this.isMobileSidebarVisible.set(false);
  }
}
