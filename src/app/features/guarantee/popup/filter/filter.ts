import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { MultiSelect } from 'primeng/multiselect';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { GuaranteeFilter } from '../../models/guarantee.model';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-filter',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    DatePicker,
    MultiSelect,
    DividerModule,
    TranslocoPipe,
    SelectModule,
    InputTextModule,
  ],
  templateUrl: './filter.html',
  styleUrl: './filter.scss',
})
export class Filter implements OnInit, OnDestroy {
  filterForm!: FormGroup;

  private destroy$ = new Subject<void>();

  statusOptions = [
    { label: '', value: 'DRAFT' },
    { label: '', value: 'SUBMITTED' },
    { label: '', value: 'REVIEWING' },
    { label: '', value: 'APPROVED' },
    { label: '', value: 'REJECTED' },
    { label: '', value: 'PAID' },
  ];

  treatmentTypeOptions = [
    { label: '', value: 'INPATIENT' },
    { label: '', value: 'OUTPATIENT' },
    { label: '', value: 'SURGERY' },
    { label: '', value: 'EMERGENCY' }
  ];

  constructor(
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    private translocoService: TranslocoService,
    private config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      fromDate: [null],
      toDate: [null],
      statuses: [[]],
      hospital: [null],
      treatmentType: [null],
    });

    if (this.config.data) {
      const oldFilter = {
        fromDate: this.config.data.fromDate ? new Date(this.config.data.fromDate) : null,
        toDate: this.config.data.toDate ? new Date(this.config.data.toDate) : null,
        statuses: this.config.data.statuses || [],
        hospital: this.config.data.hospital || null,
        treatmentType: this.config.data.treatmentType || null,
      }
      this.filterForm.patchValue(oldFilter)
    }

    this.translocoService.langChanges$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.refreshStatusLabels();
      this.refreshTreatmentTypeLabels();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private refreshStatusLabels(): void {
    const statusKeys: Record<string, string> = {
      DRAFT: 'guarantee.list.status.draft',
      SUBMITTED: 'guarantee.list.status.submitted',
      REVIEWING: 'guarantee.list.status.reviewing',
      APPROVED: 'guarantee.list.status.approved',
      REJECTED: 'guarantee.list.status.rejected',
      PAID: 'guarantee.list.status.paid',
    };
    this.statusOptions = this.statusOptions.map(opt => ({
      ...opt,
      label: this.translocoService.translate(statusKeys[opt.value]),
    }));
  }

  private refreshTreatmentTypeLabels(): void {
    const typeKeys: Record<string, string> = {
      INPATIENT: 'guarantee.create.treatmentSection.types.inpatient',
      OUTPATIENT: 'guarantee.create.treatmentSection.types.outpatient',
      SURGERY: 'guarantee.create.treatmentSection.types.surgery',
      EMERGENCY: 'guarantee.create.treatmentSection.types.emergency',
    }
    this.treatmentTypeOptions = this.treatmentTypeOptions.map(opt => ({
      ...opt,
      label: this.translocoService.translate(typeKeys[opt.value]),
    }));
  }

  apply(): void {
    const { fromDate, toDate, statuses, hospital, treatmentType } = this.filterForm.value;
    const filter: GuaranteeFilter = {
      fromDate: fromDate ? (fromDate as Date).toISOString().split('T')[0] : null,
      toDate: toDate ? (toDate as Date).toISOString().split('T')[0] : null,
      statuses: statuses?.length ? statuses : null,
      hospital: hospital ? hospital.trim() : null,
      treatmentType: treatmentType || null,
      activeFilterChips: this.buildActiveFilterChips(fromDate, toDate, statuses, hospital, treatmentType),
    };
    this.ref.close(filter);
  }

  private buildActiveFilterChips(fromDate: Date | null, toDate: Date | null, statuses: string[], hospital: string, treatmentType: string): Record<string, string>[] {
    const activeFilterChips: Record<string, string>[] = [];
    if (fromDate) {
      activeFilterChips.push({ label: this.translocoService.translate('guarantee.list.filterPopup.dateRange.from'), key: fromDate.toISOString().split('T')[0] });
    }
    if (toDate) {
      activeFilterChips.push({ label: this.translocoService.translate('guarantee.list.filterPopup.dateRange.to'), key: toDate.toISOString().split('T')[0] });
    }
    if (statuses?.length) {
      activeFilterChips.push(...statuses.map(status => ({ label: this.translocoService.translate('guarantee.list.filterPopup.status.label'), key: status })));
    }
    if (hospital && hospital.trim()) {
      activeFilterChips.push({ label: `${this.translocoService.translate('guarantee.list.filterPopup.hospital.label')}: ${hospital.trim()}`, key: hospital.trim() });
    }
    if (treatmentType) {
      const typeLabel = this.treatmentTypeOptions.find(t => t.value === treatmentType)?.label || treatmentType;
      activeFilterChips.push({ label: `${this.translocoService.translate('guarantee.list.filterPopup.treatmentType.label')}: ${typeLabel}`, key: treatmentType });
    }
    return activeFilterChips;
  }

  reset(): void {
    this.filterForm.reset({ fromDate: null, toDate: null, statuses: [], hospital: null, treatmentType: null });
  }

  cancel(): void {
    this.ref.close(null);
  }
}
