import { ChangeDetectorRef, Component, OnDestroy, OnInit, signal } from '@angular/core';

import { Title } from '../../../shared/components/title/title';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MenuItem, SelectItem } from 'primeng/api';
import { DatePicker } from 'primeng/datepicker';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LookupPopup } from '../popup/lookup-popup/lookup-popup';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Patient } from '../models/guarantee.model';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { GuaranteeService } from '../services/guarantee.service';
import { exhaustMap, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ToastService } from '@app/shared/services/toast.service';
import { LoadingService } from '@app/shared/services/loading.service';
import { GuaranteeForm } from '../components/guarantee-form/guarantee-form';

@Component({
  selector: 'app-guarantee-create-new',
  imports: [Title, ReactiveFormsModule, InputTextModule, ButtonModule, DatePicker, SelectModule, InputNumberModule, FileUploadModule, TranslocoPipe, GuaranteeForm],
  templateUrl: './guarantee-create-new.html',
  styleUrl: './guarantee-create-new.scss',
  providers: [DialogService]
})
export class GuaranteeCreateNew implements OnInit, OnDestroy {
  lookupRef: DynamicDialogRef<LookupPopup> | null = null;
  menu: MenuItem[] = [];
  lookupForm!: FormGroup;
  guaranteeForm!: FormGroup;
  loading = signal<boolean>(false)

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private dialogService: DialogService, private translocoService: TranslocoService, private router: Router, private guaranteeService: GuaranteeService, private toastMessage: ToastService, private cdr: ChangeDetectorRef, private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.translocoService.langChanges$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.menu = [
        { label: this.translocoService.translate('menu.guarantee') },
        { label: this.translocoService.translate('menu.guarantee.create') }
      ];
    });

    this.lookupForm = this.fb.group({
      cccd: ['', Validators.required],
      name: [''],
      dateOfBirth: [''],
    });

    this.guaranteeForm = this.fb.group({
      // --- Patient info (auto-filled from lookup) ---
      patientId: [{ value: '', disabled: true }],
      patientName: [{ value: '', disabled: true }],
      dateOfBirth: [{ value: '', disabled: true }],
      gender: [{ value: '', disabled: true }],
      phone: [{ value: '', disabled: true }],
      address: [{ value: '', disabled: true }],
      // --- Guarantee info (user fills) ---
      department: [''],
      treatmentType: ['', Validators.required],
      admissionDate: ['', Validators.required],
      estimatedDischargeDate: ['', Validators.required],
      contractNo: ['', Validators.required],
      insuranceCardNo: ['', Validators.required],
      estimatedAmount: [null],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  lookup() {
    this.lookupRef = this.dialogService.open(LookupPopup, {
      header: this.translocoService.translate('guarantee.lookupPopup.lookupTitle'),
      width: '50%',
      contentStyle: { 'max-height': '500px', 'overflow': 'auto' },
      data: this.lookupForm.value,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });

    this.lookupRef?.onClose.pipe(takeUntil(this.destroy$)).subscribe((item: Patient) => {
      if (!item) return;
      this.guaranteeForm.patchValue({
        patientId: item.id,
        patientName: item.name,
        dateOfBirth: dayjs(item.dateOfBirth).format('YYYY-MM-DD'),
        gender: item.gender,
        phone: item.phone,
        address: item.address,
      });
    })
  }

  close() {
    this.router.navigate(['/guarantee/list'])
  }

  createNewGurantee() {
    this.loadingService.show()
    try {
      const body = {
        ...this.guaranteeForm.getRawValue(),
        id: `GRT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
        estimatedDischargeDate: dayjs(this.guaranteeForm.value.estimatedDischargeDate).format('YYYY-MM-DD'),
        admissionDate: dayjs(this.guaranteeForm.value.admissionDate).format('YYYY-MM-DD'),
        status: 'DRAFT',
      }
      this.guaranteeService.addRequest(body).subscribe({
        next: (res) => {
          if(res) {
            this.toastMessage.showSuccess(this.translocoService.translate('message.success.create'))
            this.router.navigate(['/guarantee/list'])
          }
        },
        error: (err) => {
          this.toastMessage.showError(err?.message || this.translocoService.translate('message.error.general'))
        }
      })
    } catch (error) {
      this.toastMessage.showError(this.translocoService.translate('message.error.general'))
    } finally {
      this.loadingService.hide()
      this.cdr.markForCheck()
    }
  }
}
