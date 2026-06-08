import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable, of, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

import { Title } from '@app/shared/components/title/title';
import { TableColumn } from '@app/shared/ui/data-table/data-table.model';

import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { MenuItem, SelectItem } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';
import { DatePicker } from "primeng/datepicker";
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DataTable } from "@app/shared/ui/data-table/data-table";
import { FormControl, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { HospitalPerformanceModel, MonthlyReportModel } from '../models/report.model';
import { ReportsService } from '../services/reports.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { LoadingService } from '@app/shared/services/loading.service';
import { ToastService } from '@app/shared/services/toast.service';

@Component({
  selector: 'app-report-list',
  imports: [
    Title,
    TranslocoPipe,
    TabsModule,
    DatePicker,
    SelectModule,
    ButtonModule,
    DataTable,
    AsyncPipe,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './report-list.html',
  styleUrl: './report-list.scss',
})
export class ReportList implements OnInit, OnDestroy {

  menu: MenuItem[] = [];

  monthlyReportColumn: TableColumn[] = [];
  hospitalPerformanceColumn: TableColumn[] = [];
  treatmentTypeOptions: SelectItem[] = []

  activeTab = new BehaviorSubject<number>(0)

  dateRange = new FormControl<Date[]>([]);
  treatmentType = new FormControl<string | null>(null);

  private destroy$ = new Subject<void>();

  monthlyPage = new BehaviorSubject<number>(1)
  monthlyPageSize = new BehaviorSubject<number>(10)
  monthlyVm$!: Observable<{ data: MonthlyReportModel[]; total: number }>;
  monthlyLoading: boolean = false

  hospitalPage = new BehaviorSubject<number>(1)
  hospitalPageSize = new BehaviorSubject<number>(10)
  hospitalVm$!: Observable<{ data: HospitalPerformanceModel[]; total: number }>;
  hospitalLoading: boolean = false;

  constructor(private translocoService: TranslocoService, private reportsService: ReportsService, private loadingService: LoadingService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.translocoService.langChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.menu = [
          { label: this.translocoService.translate('menu.report') },
          { label: this.translocoService.translate('menu.report.list') }
        ];

        const typeKeys: Record<string, string> = {
          INPATIENT: 'guarantee.create.treatmentSection.types.inpatient',
          OUTPATIENT: 'guarantee.create.treatmentSection.types.outpatient',
          SURGERY: 'guarantee.create.treatmentSection.types.surgery',
          EMERGENCY: 'guarantee.create.treatmentSection.types.emergency',
        };

        this.treatmentTypeOptions = [
          { label: this.translocoService.translate(typeKeys['INPATIENT']), value: 'INPATIENT' },
          { label: this.translocoService.translate(typeKeys['OUTPATIENT']), value: 'OUTPATIENT' },
          { label: this.translocoService.translate(typeKeys['SURGERY']), value: 'SURGERY' },
          { label: this.translocoService.translate(typeKeys['EMERGENCY']), value: 'EMERGENCY' }
        ];
        this.initColumn()
      });
    this.loadData()
  }

  initColumn() {
    this.monthlyReportColumn = [
      { field: 'month', header: this.translocoService.translate('report.list.monthlyTable.month'), width: '130px' },
      { field: 'total', header: this.translocoService.translate('report.list.monthlyTable.total'), width: '130px' },
      { field: 'approved', header: this.translocoService.translate('report.list.monthlyTable.approved'), width: '130px', template: 'approved' },
      { field: 'rejected', header: this.translocoService.translate('report.list.monthlyTable.rejected'), width: '130px', template: 'rejected' },
      { field: 'inProgress', header: this.translocoService.translate('report.list.monthlyTable.inProgress'), width: '130px', template: 'inProgress' },
      { field: 'avgDays', header: this.translocoService.translate('report.list.monthlyTable.avgDays'), width: '140px', template: 'avgDays' },
      { field: 'claimedAmount', header: this.translocoService.translate('report.list.monthlyTable.claimedAmount'), width: '200px', template: 'claimedAmount' },
      { field: 'assessedAmount', header: this.translocoService.translate('report.list.monthlyTable.assessedAmount'), width: '200px', template: 'assessedAmount' }
    ];

    this.hospitalPerformanceColumn = [
      { field: 'hospital', header: this.translocoService.translate('report.list.hospitalTable.hospital'), width: '230px' },
      { field: 'total', header: this.translocoService.translate('report.list.hospitalTable.total'), width: '150px' },
      { field: 'approved', header: this.translocoService.translate('report.list.hospitalTable.approved'), width: '150px', template: 'approved' },
      { field: 'rejected', header: this.translocoService.translate('report.list.hospitalTable.rejected'), width: '150px', template: 'rejected' },
      { field: 'inProgress', header: this.translocoService.translate('report.list.hospitalTable.inProgress'), width: '150px', template: 'inProgress' },
      { field: 'avgDays', header: this.translocoService.translate('report.list.hospitalTable.avgDays'), width: '160px', template: 'avgDays' },
      { field: 'sla', header: this.translocoService.translate('report.list.hospitalTable.sla'), width: '140px', template: 'sla' }
    ];
  }

  loadData(): void {
    const dateRange$ = this.dateRange.valueChanges.pipe(
      startWith(this.dateRange.value),
      distinctUntilChanged(),
      filter((item) => {
        if (!item || item.length === 0) return true
        if (item[0] && !item[1]) return false;
        return true
      }),
    )

    const filter$ = combineLatest([
      dateRange$,
      this.treatmentType.valueChanges.pipe(startWith(this.treatmentType.value), distinctUntilChanged())
    ]).pipe(
      map(([dateRange, treatmentType]) => ({
        fromDate: dateRange?.[0],
        toDate: dateRange?.[1],
        treatmentType
      }))
    )

    const resetPageOnFilter$ = merge(
      filter$.pipe(map(() => 1)),
    )

    this.initMonthly(filter$, resetPageOnFilter$)
    this.initHospital(filter$, resetPageOnFilter$)
  }

  initMonthly(filter$: Observable<{
    fromDate: Date | undefined;
    toDate: Date | undefined;
    treatmentType: string | null;
  }>, resetPageOnFilter$: Observable<number>) {
    const monthlyPage$ = merge(
      resetPageOnFilter$,
      this.monthlyPage.asObservable().pipe(distinctUntilChanged())
    )

    const monthlyPageSize$ = this.monthlyPageSize.asObservable().pipe(
      distinctUntilChanged(),
    )

    const monthlyQuery$ = combineLatest([
      this.activeTab.asObservable().pipe(distinctUntilChanged()),
      monthlyPage$,
      monthlyPageSize$,
      filter$,
    ]).pipe(
      map(([_tab, page, pageSize, { fromDate, toDate, treatmentType }]) => ({
        tab: _tab,
        page,
        pageSize,
        fromDate,
        toDate,
        treatmentType
      }))
    )

    this.monthlyVm$ = monthlyQuery$.pipe(
      tap(() => this.monthlyLoading = true),
      filter((item) => item.tab === 0),
      switchMap(({ page, pageSize, fromDate, toDate, treatmentType }) => {
        return this.reportsService.getMonthlyReportData({ fromDate, toDate, treatmentType: treatmentType! }, page, pageSize).pipe(
          catchError(() => of({ data: [], total: 0 }))
        )
      }),
      map((res) => ({
        data: res.data || [],
        total: res.total
      })),
      tap(() => this.monthlyLoading = false),
    )

  }

  initHospital(filter$: Observable<{
    fromDate: Date | undefined;
    toDate: Date | undefined;
    treatmentType: string | null;
  }>, resetPageOnFilter$: Observable<number>) {
    const hospitalPage$ = merge(
      resetPageOnFilter$,
      this.hospitalPage.asObservable().pipe(distinctUntilChanged())
    )

    const hospitalPageSize$ = this.hospitalPageSize.asObservable().pipe(
      distinctUntilChanged(),
    )

    const hospitalQuery$ = combineLatest([
      this.activeTab.asObservable().pipe(distinctUntilChanged()),
      hospitalPage$,
      hospitalPageSize$,
      filter$
    ]).pipe(
      map(([_tab, page, pageSize, { fromDate, toDate, treatmentType }]) => ({
        tab: _tab,
        page,
        pageSize,
        fromDate,
        toDate,
        treatmentType
      }))
    )

    this.hospitalVm$ = hospitalQuery$.pipe(
      tap(() => this.hospitalLoading = true),
      filter((item) => item.tab === 1),
      switchMap(({ page, pageSize, fromDate, toDate, treatmentType }) => {
        return this.reportsService.getHospitalPerformanceReportData({ fromDate, toDate, treatmentType: treatmentType! }, page, pageSize).pipe(
          catchError(() => of({ data: [], total: 0 }))
        )
      }),
      map((res) => ({
        data: res.data || [],
        total: res.total
      })),
      tap(() => this.hospitalLoading = false),
    )
  }

  onTabChange(val: any): void {
    if (val !== undefined && val !== null) {
      this.activeTab.next(Number(val));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearFilter() {
    this.dateRange.reset();
    this.treatmentType.reset();
  }

  onMonthlyPage(event: any): void {
    const page = (event.first ?? 0) / (event.rows ?? 10) + 1;
    this.monthlyPage.next(page);
    this.monthlyPageSize.next(event.rows ?? 10);
  }

  onHospitalPage(event: any): void {
    const page = (event.first ?? 0) / (event.rows ?? 10) + 1;
    this.hospitalPage.next(page);
    this.hospitalPageSize.next(event.rows ?? 10);
  }

  exportMonthly() {
    this.loadingService.show()

    const filter = {
      fromDate: this.dateRange.value?.[0],
      toDate: this.dateRange.value?.[1],
      treatmentType: this.treatmentType.value!
    }

    this.reportsService.getMonthlyReportData(filter).subscribe({
      next: (res) => {
        const headers = [
          this.translocoService.translate('report.list.monthlyTable.month'),
          this.translocoService.translate('report.list.monthlyTable.total'),
          this.translocoService.translate('report.list.monthlyTable.approved'),
          this.translocoService.translate('report.list.monthlyTable.rejected'),
          this.translocoService.translate('report.list.monthlyTable.inProgress'),
          this.translocoService.translate('report.list.monthlyTable.avgDays'),
          this.translocoService.translate('report.list.monthlyTable.claimedAmount'),
          this.translocoService.translate('report.list.monthlyTable.assessedAmount')
        ]

        const escapeCsv = (str: any) => `"${String(str ?? '').replace(/"/g, '""')}"`;

        const rows = [
          headers.map(escapeCsv).join(','),
          ...res.data.map(item => [
            escapeCsv(item.month),
            escapeCsv(item.total),
            escapeCsv(item.approved),
            escapeCsv(item.rejected),
            escapeCsv(item.inProgress),
            escapeCsv(item.avgDays),
            escapeCsv(item.claimedAmount),
            escapeCsv(item.assessedAmount)
          ].join(','))
        ].join('\n')

        const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')

        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute('download', `monthly-report-${new Date().toISOString().split('T')[0]}.csv`)
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }

        this.loadingService.hide()
        this.toastService.showSuccess(this.translocoService.translate('message.success.exportMonthly'))
      },
      error: () => {
        this.loadingService.hide()
        this.toastService.showError(this.translocoService.translate('message.error.general'))
      }
    })
  }

  exportHospital() {
    this.loadingService.show()

    const filter = {
      fromDate: this.dateRange.value?.[0],
      toDate: this.dateRange.value?.[1],
      treatmentType: this.treatmentType.value!
    }

    this.reportsService.getHospitalPerformanceReportData(filter).subscribe({
      next: (res) => {
        const headers = [
          this.translocoService.translate('report.list.hospitalTable.hospital'),
          this.translocoService.translate('report.list.hospitalTable.total'),
          this.translocoService.translate('report.list.hospitalTable.approved'),
          this.translocoService.translate('report.list.hospitalTable.rejected'),
          this.translocoService.translate('report.list.hospitalTable.inProgress'),
          this.translocoService.translate('report.list.hospitalTable.avgDays'),
          this.translocoService.translate('report.list.hospitalTable.sla')
        ]

        const escapeCsv = (str: any) => `"${String(str ?? '').replace(/"/g, '""')}"`;

        const rows = [
          headers.map(escapeCsv).join(','),
          ...res.data.map(item => [
            escapeCsv(item.hospital),
            escapeCsv(item.total),
            escapeCsv(item.approved),
            escapeCsv(item.rejected),
            escapeCsv(item.inProgress),
            escapeCsv(item.avgDays),
            escapeCsv(item.sla)
          ].join(','))
        ].join('\n')

        const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')

        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute('download', `hospital-report-${new Date().toISOString().split('T')[0]}.csv`)
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }

        this.loadingService.hide()
        this.toastService.showSuccess(this.translocoService.translate('message.success.exportHospital'))
      },
      error: () => {
        this.loadingService.hide()
        this.toastService.showError(this.translocoService.translate('message.error.general'))
      }
    })
  }

}

