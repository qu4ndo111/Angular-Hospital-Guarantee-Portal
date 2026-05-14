import { Component, OnDestroy, OnInit, signal, effect } from '@angular/core';
import { Card } from '@app/shared/ui/card/card';
import { Title } from '@app/shared/components/title/title';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { AsyncPipe } from '@angular/common';
import { Observable, Subject, catchError, map, of, takeUntil } from 'rxjs';
import { GuaranteeService } from '../guarantee/services/guarantee.service';
import { GuaranteeRequest, GuaranteeStatus } from '../guarantee/models/guarantee.model';
import { Router } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { DataTable } from '@app/shared/ui/data-table/data-table';
import { TableColumn } from '@app/shared/ui/data-table/data-table.model';
import { ChartModule } from 'primeng/chart';
import { ThemeService } from '../../core/services/theme.service';
@Component({
  selector: 'app-dashboard',
  imports: [Card, Title, TranslocoPipe, AsyncPipe, TagModule, DataTable, ChartModule],
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
  } | null>;

  loadError = signal<string | null>(null);
  columns: TableColumn[] = []

  monthlyChartData$!: Observable<any>;
  statusChartData$!: Observable<any>;
  monthlyChartOptions: any;
  statusChartOptions: any;

  private destroy$ = new Subject<void>();

  constructor(
    private guaranteeService: GuaranteeService,
    private router: Router,
    private translocoService: TranslocoService,
    private themeService: ThemeService
  ) {
    effect(() => {
      this.themeService.getTheme()();
      setTimeout(() => {
        this.initChartOptions();
        this.monthlyChartOptions = { ...this.monthlyChartOptions };
        this.statusChartOptions = { ...this.statusChartOptions };
      });
    });
  }

  ngOnInit() {
    this.translocoService.langChanges$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.initChartTotalByMonthly()
      this.initChartStatus()
      this.initChartOptions()
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
    this.loadError.set(null);
    this.stats$ = this.guaranteeService.getGuaranteeRequests().pipe(
      map(requests => ({
        total: requests.length,
        reviewing: requests.filter(r => r.status === 'SUBMITTED' || r.status === 'REVIEWING').length,
        approved: requests.filter(r => r.status === 'APPROVED' || r.status === 'PAID').length,
        rejected: requests.filter(r => r.status === 'REJECTED').length,
        recent: [...requests]
          .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
          .slice(0, 5)
      })),
      catchError(err => {
        this.loadError.set(err?.message ?? 'Unknown error');
        return of(null);
      })
    );
  }

  initChartTotalByMonthly() {
    this.monthlyChartData$ = this.guaranteeService.getMonthlyChartData().pipe(
      map((res) => ({
        labels: res.map(item => {
          const date = new Date(item.month + '-01');
          const lang = this.translocoService.getActiveLang();
          return new Intl.DateTimeFormat(lang === 'vi' ? 'vi-VN' : 'en-US', { month: 'short', year: 'numeric' }).format(date);
        }),
        datasets: [
          {
            label: this.translocoService.translate('dashboard.stats.total'),
            data: res.map(item => item.count),
            backgroundColor: '#3b82f6',
            borderRadius: 4
          }
        ]
      })),
      catchError(err => {
        this.loadError.set(err?.message ?? 'Unknown error');
        return of(null);
      })
    );
  }

  initChartStatus() {
    this.statusChartData$ = this.guaranteeService.getStatusChartData().pipe(
      map((res) => {
        const colors: Record<string, string> = {
          'DRAFT': '#64748b',
          'SUBMITTED': '#0ea5e9',
          'REVIEWING': '#f59e0b',
          'APPROVED': '#10b981',
          'REJECTED': '#ef4444',
          'PAID': '#22c55e'
        };

        return {
          labels: res.map(item => this.translocoService.translate(`guarantee.list.status.${item.status.toLowerCase()}`)),
          datasets: [
            {
              data: res.map(item => item.count),
              backgroundColor: res.map(item => colors[item.status] || '#3b82f6'),
              borderWidth: 0
            }
          ]
        };
      }),
      catchError(err => {
        this.loadError.set(err?.message ?? 'Unknown error');
        return of(null);
      })
    );
  }

  initChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-primary');
    const textColorSecondary = documentStyle.getPropertyValue('--text-muted');
    const surfaceBorder = documentStyle.getPropertyValue('--border-color');

    this.monthlyChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: { weight: 500 }
          },
          grid: {
            display: false,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };

    this.statusChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 1,
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            usePointStyle: true,
            padding: 20
          }
        }
      }
    };
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
