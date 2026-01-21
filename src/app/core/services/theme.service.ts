import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private theme = signal<Theme>('dark');

  constructor() {
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) {
      this.setTheme(saved);
    } else {
      this.detectSystemTheme();
    }
  }

  setTheme(theme: Theme) {
    this.theme.set(theme);
    localStorage.setItem('theme', theme);

    if (theme === 'dark' || (theme === 'auto' && this.prefersDark())) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  }

  private prefersDark(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private detectSystemTheme() {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    this.setTheme(media.matches ? 'dark' : 'light');

    media.addEventListener('change', (e) => {
      if (this.theme() === 'auto') {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  getTheme() {
    return this.theme.asReadonly();
  }
}
