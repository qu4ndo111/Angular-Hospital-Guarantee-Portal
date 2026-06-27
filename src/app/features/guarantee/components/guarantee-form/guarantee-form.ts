import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { SelectItem } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-guarantee-form',
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, DatePicker, SelectModule, InputNumberModule, FileUploadModule, TranslocoPipe],
  templateUrl: './guarantee-form.html',
  styleUrl: './guarantee-form.scss',
})
export class GuaranteeForm implements OnInit, OnDestroy {

  @Input() guaranteeForm!: FormGroup;
  @Input() isEdit: boolean = false;

  treatmentTypes: SelectItem[] = [
    { label: '', value: 'INPATIENT' },
    { label: '', value: 'OUTPATIENT' },
    { label: '', value: 'SURGERY' },
    { label: '', value: 'EMERGENCY' }
  ];

  private destroy$ = new Subject<void>();

  constructor(private translocoService: TranslocoService) { }

  ngOnInit(): void {
    this.translocoService.langChanges$.pipe(takeUntil(this.destroy$)).subscribe(() => this.refreshTreatmentTypeLabels());
    this.guaranteeForm.get('admissionDate')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.guaranteeForm.get('estimatedDischargeDate')?.updateValueAndValidity({ emitEvent: false });
    });
  }

  private refreshTreatmentTypeLabels(): void {
    const typeKeys: Record<string, string> = {
      INPATIENT: 'guarantee.create.treatmentSection.types.inpatient',
      OUTPATIENT: 'guarantee.create.treatmentSection.types.outpatient',
      SURGERY: 'guarantee.create.treatmentSection.types.surgery',
      EMERGENCY: 'guarantee.create.treatmentSection.types.emergency',
    }
    this.treatmentTypes = this.treatmentTypes.map(opt => ({
      ...opt,
      label: this.translocoService.translate(typeKeys[opt.value]),
    }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
