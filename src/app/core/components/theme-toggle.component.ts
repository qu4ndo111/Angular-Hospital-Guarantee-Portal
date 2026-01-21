import { Component, inject } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-theme-toggle',
    standalone: true,
    imports: [ButtonModule],
    template: `
    <p-button
      [icon]="themeIcon()"
      [outlined]="true"
      [rounded]="true"
      severity="secondary"
      (onClick)="toggleTheme()"
    />
  `,
    styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class ThemeToggleComponent {
    private themeService = inject(ThemeService);

    themeIcon() {
        const theme = this.themeService.getTheme()();
        return theme === 'dark' ? 'pi pi-moon' : 'pi pi-sun';
    }

    tooltipText() {
        const theme = this.themeService.getTheme()();
        return theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }

    toggleTheme() {
        const current = this.themeService.getTheme()();
        const next = current === 'dark' ? 'light' : 'dark';
        this.themeService.setTheme(next);
    }
}
