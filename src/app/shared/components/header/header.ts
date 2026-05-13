import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslocoService, TranslocoModule } from '@jsverse/transloco';

import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LayoutService } from '@app/shared/services/layout.service';
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-header',
  imports: [CommonModule, ThemeToggleComponent, LanguageSwitcherComponent, MenuModule, TranslocoModule, ErrorComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit, OnDestroy {
  items: MenuItem[] | undefined;
  private langChangeSubscription?: Subscription;

  constructor(private translocoService: TranslocoService, private router: Router, public layoutService: LayoutService) { }

  ngOnInit(): void {
    this.langChangeSubscription = this.translocoService.langChanges$.subscribe(() => {
      this.updateMenuItems();
    });
  }

  ngOnDestroy(): void {
    this.langChangeSubscription?.unsubscribe();
  }

  private updateMenuItems(): void {
    this.items = [
      {
        label: this.translocoService.translate('header.logout'),
        icon: 'pi pi-sign-out',
        command: () => {
          this.logout();
        }
      }
    ]
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/auth/login']);
  }
}
