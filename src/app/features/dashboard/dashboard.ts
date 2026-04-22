import { Component, OnDestroy, OnInit } from '@angular/core';
import { Card } from '@app/shared/ui/card/card';
import { Title } from '@app/shared/components/title/title';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { AsyncPipe } from '@angular/common';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { GuaranteeService } from '../guarantee/services/guarantee.service';
import { GuaranteeRequest, GuaranteeStatus } from '../guarantee/models/guarantee.model';
import { Router } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { DataTable } from '@app/shared/ui/data-table/data-table';
import { TableColumn } from '@app/shared/ui/data-table/data-table.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  imports: [Card, Title, TranslocoPipe, AsyncPipe, TagModule, DataTable],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, OnDestroy {
  stats$!: Observable<{
    total: number;
    reviewing: number;
    approved: number;
    rejected: number;
    recent: GuaranteeRequest[];
  }>;

  columns: TableColumn[] = []

  private destroy$ = new Subject<void>();

  constructor(
    private guaranteeService: GuaranteeService,
    private router: Router,
    private translocoService: TranslocoService
  ) { }

  ngOnInit() {
    this.translocoService.langChanges$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.columns = [
        {
          field: 'id',
          header: this.translocoService.translate('guarantee.list.table.cols.id'),
        },
        {
          field: 'patientName',
          header: this.translocoService.translate('guarantee.list.table.cols.patientName'),
        },
        {
          field: 'hospital',
          header: this.translocoService.translate('guarantee.list.table.cols.hospital'),
        },
        {
          field: 'admissionDate',
          header: this.translocoService.translate('guarantee.list.table.cols.admissionDate'),
        },
        {
          field: 'status',
          header: this.translocoService.translate('guarantee.list.table.cols.status'),
        },
      ]
    })
    this.stats$ = this.guaranteeService.getGuaranteeRequests().pipe(
      map(requests => ({
        total: requests.length,
        reviewing: requests.filter(r => r.status === 'SUBMITTED' || r.status === 'REVIEWING').length,
        approved: requests.filter(r => r.status === 'APPROVED' || r.status === 'PAID').length,
        rejected: requests.filter(r => r.status === 'REJECTED').length,
        recent: [...requests]
          .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
          .slice(0, 5)
      }))
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  getStatusSeverity(status: GuaranteeStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    const map: Record<GuaranteeStatus, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
      DRAFT: 'secondary',
      SUBMITTED: 'info',
      REVIEWING: 'warn',
      APPROVED: 'success',
      REJECTED: 'danger',
      PAID: 'success',
    };
    return map[status];
  }

  goToList() {
    this.router.navigate(['/guarantee/list']);
  }

  goToDetail(event: any) {
    this.router.navigate(['/guarantee/detail', event.id]);
  }
}
