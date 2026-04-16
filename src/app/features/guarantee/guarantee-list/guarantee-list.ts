import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, DecimalPipe } from '@angular/common';

import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { Title } from '@app/shared/components/title/title';
import { DataTable } from '@app/shared/ui/data-table/data-table';
import { TableColumn } from '@app/shared/ui/data-table/data-table.model';
import { GuaranteeFilter, GuaranteeRequest, GuaranteeStatus } from '../models/guarantee.model';
import { BehaviorSubject, catchError, combineLatest, concat, debounceTime, distinctUntilChanged, finalize, map, merge, Observable, of, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { GuaranteeService } from '../services/guarantee.service';
import { ToastService } from '@app/shared/services/toast.service';
import { LoadingService } from '@app/shared/services/loading.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Filter } from '../popup/filter/filter';

interface FilterChip {
  key: string;
  label: string;
}

@Component({
  selector: 'app-guarantee-list',
  imports: [
    Title,
    DataTable,
    ReactiveFormsModule,
    DecimalPipe,
    ButtonModule,
    InputTextModule,
    TagModule,
    TooltipModule,
    TranslocoPipe,
    AsyncPipe
  ],
  templateUrl: './guarantee-list.html',
  styleUrl: './guarantee-list.scss',
  providers: [DialogService]
})
export class GuaranteeList implements OnInit, OnDestroy{
  filterPopupRef: DynamicDialogRef | null = null

  menu: MenuItem[] = [];
  columns: TableColumn[] = [];

  // Search
  searchKeyword = new FormControl<string>('');

  // Filter
  hasActiveFilters: boolean = false;
  activeFilterChips: FilterChip[] = [];

  // Table data (placeholder — no data handling)
  guaranteeList: any[] = [];
  totalRecords: number = 0;
  loading: boolean = false;

  vm$!: Observable<any>
  page = new BehaviorSubject<number>(1)
  pageSize = new BehaviorSubject<number>(10)
  filter = new BehaviorSubject<GuaranteeFilter | null>(null)

  destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private translocoService: TranslocoService,
    private guaranteeService: GuaranteeService,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.translocoService.langChanges$.pipe(takeUntil(this.destroy$)).subscribe(() => {
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

    const searchKeyword$ = concat(
      of(''),
      this.searchKeyword.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
    );

    const filter$ = this.filter.asObservable()

    const resetPageOnFilter$ = merge(
      searchKeyword$.pipe(map(() => 1)),
      filter$.pipe(map(() => 1))
    )

    const page$ = merge(
      resetPageOnFilter$,
      this.page.asObservable()
    ).pipe(
      distinctUntilChanged()
    )

    const pageSize$ = this.pageSize.asObservable().pipe(
      distinctUntilChanged()
    )

    const query$ = combineLatest([
      page$,
      pageSize$,
      searchKeyword$,
      filter$
    ]).pipe(
      map(([page, pageSize, searchKeyword, filter]) => ({
        page,
        pageSize,
        searchKeyword,
        filter
      }))
    )

    this.vm$ = query$.pipe(
      tap(() => this.loadingService.show()),
      switchMap(({ page, pageSize, searchKeyword, filter }) => {
        return this.guaranteeService.getGuaranteeRequests(filter!).pipe(
          catchError((err) => {
            this.toastService.showError(err.message || 'Lỗi hệ thống')
            return of([])
          }),
        )
      }),
      map((res) => {
        return {
          guaranteeRequests: res
        }
      }),
      tap(() => this.loadingService.hide())
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  navigateToCreate(): void {
    this.router.navigate(['/guarantee/create']);
  }

  openFilter(): void {
    this.filterPopupRef = this.dialogService.open(Filter, {
      header: this.translocoService.translate('guarantee.list.filter.title'),
      width: '50%',
      focusOnShow: false,
      data: this.filter.getValue()
    })

    this.filterPopupRef!.onClose.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.filter.next(res)
      },
      error: (err) => {
        console.log(err)
      }
    })
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
