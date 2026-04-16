import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { MultiSelect } from 'primeng/multiselect';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { GuaranteeFilter } from '../../models/guarantee.model';

@Component({
  selector: 'app-filter',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    DatePicker,
    MultiSelect,
    DividerModule,
    TranslocoPipe,
  ],
  templateUrl: './filter.html',
  styleUrl: './filter.scss',
})
export class Filter implements OnInit {
  filterForm!: FormGroup;

  statusOptions = [
    { label: '', value: 'DRAFT' },
    { label: '', value: 'SUBMITTED' },
    { label: '', value: 'REVIEWING' },
    { label: '', value: 'APPROVED' },
    { label: '', value: 'REJECTED' },
    { label: '', value: 'PAID' },
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
    });

    if (this.config.data) {
      const oldFilter = {
        fromDate: this.config.data.fromDate ? new Date(this.config.data.fromDate) : null,
        toDate: this.config.data.toDate ? new Date(this.config.data.toDate) : null,
        statuses: this.config.data.statuses || [],
      }
      this.filterForm.patchValue(oldFilter)
    }

    this.refreshStatusLabels();
    this.translocoService.langChanges$.subscribe(() => this.refreshStatusLabels());
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

  apply(): void {
    const { fromDate, toDate, statuses } = this.filterForm.value;
    const filter: GuaranteeFilter = {
      fromDate: fromDate ? (fromDate as Date).toISOString().split('T')[0] : null,
      toDate: toDate ? (toDate as Date).toISOString().split('T')[0] : null,
      statuses: statuses?.length ? statuses : null,
    };
    this.ref.close(filter);
  }

  reset(): void {
    this.filterForm.reset({ fromDate: null, toDate: null, statuses: [] });
  }

  cancel(): void {
    this.ref.close(null);
  }
}
