import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { Title } from '@app/shared/components/title/title';
import { DataTable } from '@app/shared/ui/data-table/data-table';
import { TableColumn } from '@app/shared/ui/data-table/data-table.model';
import { GuaranteeStatus } from '../models/guarantee.model';

interface FilterChip {
  key: string;
  label: string;
}

@Component({
  selector: 'app-guarantee-list',
  imports: [
    Title,
    DataTable,
    FormsModule,
    DecimalPipe,
    ButtonModule,
    InputTextModule,
    TagModule,
    TooltipModule,
    TranslocoPipe,
  ],
  templateUrl: './guarantee-list.html',
  styleUrl: './guarantee-list.scss',
})
export class GuaranteeList implements OnInit {
  menu: MenuItem[] = [];
  columns: TableColumn[] = [];

  // Search
  searchKeyword: string = '';

  // Filter
  hasActiveFilters: boolean = false;
  activeFilterChips: FilterChip[] = [];

  // Table data (placeholder — no data handling)
  guaranteeList: any[] = [];
  totalRecords: number = 0;
  loading: boolean = false;

  constructor(
    private router: Router,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.translocoService.langChanges$.subscribe(() => {
      this.menu = [
        { label: this.translocoService.translate('menu.guarantee') },
        { label: this.translocoService.translate('menu.guarantee.list') },
      ];

      this.columns = [
        { field: 'id', header: this.translocoService.translate('guarantee.list.table.cols.id'), width: '160px', sortable: true },
        { field: 'patientName', header: this.translocoService.translate('guarantee.list.table.cols.patientName'), sortable: true },
        { field: 'patientId', header: this.translocoService.translate('guarantee.list.table.cols.patientId'), width: '140px' },
        { field: 'treatmentType', header: this.translocoService.translate('guarantee.list.table.cols.treatmentType'), width: '140px' },
        { field: 'admissionDate', header: this.translocoService.translate('guarantee.list.table.cols.admissionDate'), width: '130px', sortable: true },
        { field: 'estimatedAmount', header: this.translocoService.translate('guarantee.list.table.cols.estimatedAmount'), width: '150px', template: 'estimatedAmount' },
        { field: 'status', header: this.translocoService.translate('guarantee.list.table.cols.status'), width: '130px', template: 'status' },
        { field: 'actions', header: '', width: '90px', template: 'actions' },
      ];
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['/guarantee/create']);
  }

  openFilter(): void {
    // Sẽ mở filter popup — chưa xử lý
  }

  removeFilter(key: string): void {
    this.activeFilterChips = this.activeFilterChips.filter(c => c.key !== key);
    this.hasActiveFilters = this.activeFilterChips.length > 0;
  }

  clearAllFilters(): void {
    this.activeFilterChips = [];
    this.hasActiveFilters = false;
  }

  getStatusLabel(status: GuaranteeStatus): string {
    const map: Record<GuaranteeStatus, string> = {
      DRAFT: this.translocoService.translate('guarantee.list.status.draft'),
      SUBMITTED: this.translocoService.translate('guarantee.list.status.submitted'),
      REVIEWING: this.translocoService.translate('guarantee.list.status.reviewing'),
      APPROVED: this.translocoService.translate('guarantee.list.status.approved'),
      REJECTED: this.translocoService.translate('guarantee.list.status.rejected'),
      PAID: this.translocoService.translate('guarantee.list.status.paid'),
    };
    return map[status] ?? status;
  }

  getStatusSeverity(status: GuaranteeStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const map: Record<GuaranteeStatus, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
      DRAFT: 'secondary',
      SUBMITTED: 'info',
      REVIEWING: 'warn',
      APPROVED: 'success',
      REJECTED: 'danger',
      PAID: 'success',
    };
    return map[status] ?? 'secondary';
  }
}
