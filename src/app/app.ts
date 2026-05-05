import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ThemeService } from './core/services/theme.service';
import { TranslocoService } from '@jsverse/transloco';
import { ToastService } from './shared/services/toast.service';
import { ConfirmDialogService } from './shared/services/confirm-dialog.service';
import { ConfirmDialog } from './shared/ui/confirm-dialog/confirm-dialog';
import { Loading } from './shared/ui/loading/loading';
import { LoadingService } from './shared/services/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, ConfirmDialog, Loading],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [MessageService, ToastService, ConfirmationService, ConfirmDialogService, LoadingService]
})
export class App {
  protected readonly title = signal('angular-business-base');

  constructor(
    private themeService: ThemeService,
    private translocoService: TranslocoService,
    private titleService: Title
  ) {
    this.themeService.initTheme();

    this.translocoService.load(this.translocoService.getActiveLang()).subscribe();

    this.translocoService.selectTranslate('common.appTitle').subscribe(title => {
      this.titleService.setTitle(title);
    });
  }
}
