import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, ButtonModule, MenuModule],
  template: `
    <div class="lang-switcher-container">
      <button
        type="button"
        class="lang-btn"
        (click)="menu.toggle($event)"
        [title]="'Switch Language'">
        <i class="pi pi-globe"></i>
        <span class="lang-code">{{ currentLang() }}</span>
      </button>

      <p-menu
        #menu
        [model]="languageItems"
        [popup]="true"
        styleClass="lang-menu">
      </p-menu>
    </div>
  `,
  styles: [`
    .lang-switcher-container {
      position: relative;
      display: inline-block;
    }

    .lang-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border: none;
      background: transparent;
      color: var(--text-color);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.9rem;

      i {
        font-size: 1.1rem;
        color: var(--text-color-secondary);
      }

      .lang-code {
        text-transform: uppercase;
        font-weight: 500;
      }

      &:hover {
        background: var(--highlight-bg);
      }
    }

    :host ::ng-deep {
      .lang-menu {
        width: 120px !important;
        left: auto !important;
        right: 0 !important;

        .p-menuitem-link {
          padding: 0.75rem 1rem;

          .p-menuitem-text {
            font-size: 0.95rem;
          }

          &.active {
            background: var(--primary-50);
            color: var(--primary-color);
            font-weight: 500;
          }
        }
      }
    }
  `]
})
export class LanguageSwitcherComponent {
  private translocoService = inject(TranslocoService);

  /**
   * Available languages
   * Customize this array based on your app's supported languages
   */
  languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  ];

  /**
   * Get current active language
   */
  currentLang() {
    return this.translocoService.getActiveLang().toUpperCase();
  }

  /**
   * Menu items for language selection
   */
  languageItems: MenuItem[] = this.languages.map(lang => ({
    label: `${lang.flag} ${lang.label}`,
    command: () => this.changeLanguage(lang.code),
    styleClass: this.isActiveLang(lang.code) ? 'active' : '',
  }));

  /**
   * Change application language
   */
  changeLanguage(langCode: string) {
    this.translocoService.load(langCode).subscribe(() => {
      this.translocoService.setActiveLang(langCode);
      localStorage.setItem('preferredLanguage', langCode);

      this.languageItems = this.languages.map(lang => ({
        label: `${lang.flag} ${lang.label}`,
        command: () => this.changeLanguage(lang.code),
        styleClass: this.isActiveLang(lang.code) ? 'active' : '',
      }));
    });
  }

  /**
   * Check if language is currently active
   */
  private isActiveLang(code: string): boolean {
    return this.translocoService.getActiveLang() === code;
  }
}
