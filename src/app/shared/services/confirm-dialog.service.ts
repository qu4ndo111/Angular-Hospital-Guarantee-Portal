import { Injectable } from "@angular/core";
import { ConfirmationService } from "primeng/api";

@Injectable({
    providedIn: 'root'
})
export class ConfirmDialogService {
  constructor(private confirmationService: ConfirmationService) { }

  showConfirmDialog(message: string, header: string, accept: () => void, reject: () => void) {
    this.confirmationService.confirm({
      message: message,
      header: header,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        accept();
      },
      reject: () => {
        reject();
      }
    });
  }
}
