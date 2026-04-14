import { Component, OnInit } from '@angular/core';

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

  treatmentTypes: any[] = [];

  constructor(private fb: FormBuilder, private dialogService: DialogService, private translocoService: TranslocoService) { }

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
      header: this.translocoService.translate('guarantee.lookupPopup.title'),
      width: '50%',
      contentStyle: { 'max-height': '500px', 'overflow': 'auto' },
      data: this.lookupForm.value,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });
  }
}
