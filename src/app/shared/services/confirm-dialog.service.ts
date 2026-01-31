import { Injectable } from "@angular/core";
import { TranslocoService } from "@jsverse/transloco";
import { ConfirmationService } from "primeng/api";

@Injectable({
    providedIn: 'root'
})
export class ConfirmDialogService {
  constructor(private confirmationService: ConfirmationService, private translateService: TranslocoService) { }

  showConfirmDialog(message: string, header: string, accept: () => void, reject: () => void) {
    this.confirmationService.confirm({
      message: this.translateService.translate(message),
      header: this.translateService.translate(header),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        accept();
      },
      reject: () => {
        reject();
      },
      rejectLabel: this.translateService.translate('common.actions.cancel'),
      acceptLabel: this.translateService.translate('common.actions.ok'),
    });
  }
}
