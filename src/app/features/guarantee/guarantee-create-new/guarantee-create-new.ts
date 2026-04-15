import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';

import { Title } from '../../../shared/components/title/title';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { DatePicker } from 'primeng/datepicker';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LookupPopup } from '../popup/lookup-popup/lookup-popup';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Patient } from '../models/guarantee.model';
import { Router } from '@angular/router';
import moment from 'moment';
import { GuaranteeService } from '../services/guarantee.service';
import { exhaustMap, tap } from 'rxjs';
import { ToastService } from '@app/shared/services/toast.service';

@Component({
  selector: 'app-guarantee-create-new',
  imports: [Title, ReactiveFormsModule, InputTextModule, ButtonModule, DatePicker, SelectModule, InputNumberModule, FileUploadModule, TranslocoPipe],
  templateUrl: './guarantee-create-new.html',
  styleUrl: './guarantee-create-new.scss',
  providers: [DialogService]
})
export class GuaranteeCreateNew implements OnInit {
  lookupRef: DynamicDialogRef<LookupPopup> | null = null;
  menu: MenuItem[] = [];
  lookupForm!: FormGroup;
  guaranteeForm!: FormGroup;
  loading = signal<boolean>(false)
  treatmentTypes: any[] = [];

  constructor(private fb: FormBuilder, private dialogService: DialogService, private translocoService: TranslocoService, private router: Router, private guaranteeService: GuaranteeService, private toastMessage: ToastService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.translocoService.langChanges$.subscribe(() => {
      this.menu = [
        { label: this.translocoService.translate('menu.guarantee') },
        { label: this.translocoService.translate('menu.guarantee.create') }
      ];
      this.treatmentTypes = [
        { label: this.translocoService.translate('guarantee.create.treatmentSection.types.inpatient'), value: 'INPATIENT' },
        { label: this.translocoService.translate('guarantee.create.treatmentSection.types.outpatient'), value: 'OUTPATIENT' },
        { label: this.translocoService.translate('guarantee.create.treatmentSection.types.surgery'), value: 'SURGERY' },
        { label: this.translocoService.translate('guarantee.create.treatmentSection.types.emergency'), value: 'EMERGENCY' }
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

    this.lookupRef?.onClose.subscribe((item: Patient) => {
      if (!item) return;
      this.guaranteeForm.patchValue({
        patientId: item.id,
        patientName: item.name,
        dateOfBirth: moment(item.dateOfBirth).format('YYYY-MM-DD'),
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
    this.loading.set(true)
    try {
      const body = {
        ...this.guaranteeForm.value,
        id: `GRT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
        estimatedDischargeDate: moment(this.guaranteeForm.value.estimatedDischargeDate).format('YYYY-MM-DD'),
        admissionDate: moment(this.guaranteeForm.value.admissionDate).format('YYYY-MM-DD'),
      }
      this.guaranteeService.addRequest(body).subscribe({
        next: (res) => {
          if(res) {
            this.toastMessage.showSuccess('')
          }
        },
        error: (err) => {
          this.toastMessage.showError('')
        }
      })
    } catch (error) {
      this.toastMessage.showError('')
    } finally {
      this.loading.set(false)
      this.cdr.markForCheck()
    }

  }
}
