import { ChangeDetectorRef, Component, OnDestroy, OnInit, signal } from '@angular/core';

import { Title } from '../../../shared/components/title/title';

import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
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
import { catchError, debounceTime, distinctUntilChanged, exhaustMap, map, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ToastService } from '@app/shared/services/toast.service';
import { LoadingService } from '@app/shared/services/loading.service';
import { GuaranteeForm } from '../components/guarantee-form/guarantee-form';
import { AsyncPipe } from '@angular/common';
import { ConfirmDialogService } from '@app/shared/services/confirm-dialog.service';

@Component({
  selector: 'app-guarantee-create-new',
  imports: [Title, ReactiveFormsModule, InputTextModule, ButtonModule, DatePicker, SelectModule, InputNumberModule, FileUploadModule, TranslocoPipe, GuaranteeForm, AsyncPipe],
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

  suggestions$!: Observable<Patient[]>;
  showSuggestions = signal<boolean>(false);
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private dialogService: DialogService, private translocoService: TranslocoService, private router: Router, private guaranteeService: GuaranteeService, private toastMessage: ToastService, private cdr: ChangeDetectorRef, private loadingService: LoadingService, private confirmDialogService: ConfirmDialogService) { }

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
      estimatedDischargeDate: ['', [Validators.required, this.estimatedDischargeDateValidator()]],
      contractNo: ['', Validators.required],
      insuranceCardNo: ['', Validators.required],
      estimatedAmount: [null],
    });
    this.patientSuggestions();
    this.setupAutosave();
    this.checkAndRestoreDraft();
  }

  estimatedDischargeDateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const admissionDate = control.parent?.get('admissionDate')?.value;
      const estimatedDischargeDate = control.value;
      if (estimatedDischargeDate && admissionDate) {
        if (dayjs(estimatedDischargeDate).isBefore(dayjs(admissionDate))) {
          return { invalidDate: true };
        }
      }
      return null;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  patientSuggestions() {
    this.suggestions$ = this.lookupForm.get('cccd')!.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        const patientId = this.guaranteeForm.get('patientId')?.value;
        const canShow = !patientId;
        this.showSuggestions.set(canShow);
      }),
      switchMap((value) => {
        const keyword = value.trim();
        if (!keyword || keyword.length < 3) return of([])
        return this.guaranteeService.searchPatients(keyword).pipe(
          catchError((error) => {
            this.toastMessage.showError(error?.message || this.translocoService.translate('message.error.general'))
            return of([])
          }));
      }),
    )
  }

  selectPatient(patient: Patient) {
    this.lookupForm.patchValue({
      cccd: patient.id,
      name: patient.name,
      dateOfBirth: dayjs(patient.dateOfBirth, "YYYY-MM-DD").toDate(),
    })
    this.guaranteeForm.patchValue({
      patientId: patient.id,
      patientName: patient.name,
      dateOfBirth: dayjs(patient.dateOfBirth, "YYYY-MM-DD").toDate(),
      gender: patient.gender,
      phone: patient.phone,
      address: patient.address,
    });
    this.showSuggestions.set(false);
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
        dateOfBirth: dayjs(item.dateOfBirth, "YYYY-MM-DD").toDate(),
        gender: item.gender,
        phone: item.phone,
        address: item.address,
      });
    })
  }

  setupAutosave() {
    this.guaranteeForm.valueChanges.pipe(
      debounceTime(1500),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      const value = this.guaranteeForm.getRawValue();
      const hasData = Object.values(value).some(
        value => value !== null && value !== undefined && String(value).trim() !== ''
      );
      if (hasData) {
        localStorage.setItem('guarantee_draft', JSON.stringify(value))
      }
    })
  }

  checkAndRestoreDraft() {
    const draft = localStorage.getItem('guarantee_draft');
    if (!draft) return;

    const message = this.translocoService.translate('guarantee.create.draft.message');
    const header = this.translocoService.translate('guarantee.create.draft.title');
    
    const restoreDraft = () => {
      const draftData = JSON.parse(draft);
      if (draftData.dateOfBirth) {
        draftData.dateOfBirth = dayjs(draftData.dateOfBirth).toDate();
      }
      if (draftData.admissionDate) {
        draftData.admissionDate = dayjs(draftData.admissionDate).toDate();
      }
      if (draftData.estimatedDischargeDate) {
        draftData.estimatedDischargeDate = dayjs(draftData.estimatedDischargeDate).toDate();
      }
      this.guaranteeForm.patchValue(draftData);
    };

    const clearDraft = () => {
      localStorage.removeItem('guarantee_draft');
    };

    this.confirmDialogService.showConfirmDialog(message, header, () => restoreDraft(), () => clearDraft());
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
        dateOfBirth: dayjs(this.guaranteeForm.value.dateOfBirth).format('YYYY-MM-DD'),
        status: 'DRAFT',
      }
      this.guaranteeService.addRequest(body).subscribe({
        next: (res) => {
          if (res) {
            this.toastMessage.showSuccess(this.translocoService.translate('message.success.create'))
            localStorage.removeItem('guarantee_draft');
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
