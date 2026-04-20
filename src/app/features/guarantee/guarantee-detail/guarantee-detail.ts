import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@app/shared/components/title/title';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { MenuItem } from 'primeng/api';
import { catchError, finalize, map, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { GuaranteeService } from '../services/guarantee.service';
import { LoadingService } from '@app/shared/services/loading.service';
import { GuaranteeForm } from '../components/guarantee-form/guarantee-form';
import { GuaranteeStatus, TimelineEvent } from '../models/guarantee.model';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import moment from 'moment';
import { ToastService } from '@app/shared/services/toast.service';
import { Timeline } from 'primeng/timeline';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-guarantee-detail',
  imports: [Title, TranslocoPipe, GuaranteeForm, TagModule, ButtonModule, Timeline, DatePipe, NgClass],
  templateUrl: './guarantee-detail.html',
  styleUrl: './guarantee-detail.scss',
})
export class GuaranteeDetail implements OnInit, OnDestroy {
  menu: MenuItem[] = [];
  guaranteeForm!: FormGroup;
  isEdit: boolean = false;
  timelineEvents: TimelineEvent[] = [];
  private destroy$ = new Subject<void>();

  constructor(private translocoService: TranslocoService, private route: ActivatedRoute, private guaranteeService: GuaranteeService, private loadingService: LoadingService, private fb: FormBuilder, private router: Router, private toastService: ToastService) { }

  ngOnInit(): void {
    this.guaranteeForm = this.fb.group({
      // --- Patient info (auto-filled from lookup) ---
      patientId: [{ value: '', disabled: true }],
      patientName: [{ value: '', disabled: true }],
      dateOfBirth: [{ value: '', disabled: true }],
      gender: [{ value: '', disabled: true }],
      phone: [{ value: '', disabled: true }],
      address: [{ value: '', disabled: true }],
      // --- Guarantee info (user fills) ---
      department: [{ value: '', disabled: !this.isEdit }, Validators.required],
      treatmentType: [{ value: '', disabled: !this.isEdit }, Validators.required],
      admissionDate: [{ value: '', disabled: !this.isEdit }, Validators.required],
      estimatedDischargeDate: [{ value: '', disabled: !this.isEdit }, Validators.required],
      contractNo: [{ value: '', disabled: !this.isEdit }, Validators.required],
      insuranceCardNo: [{ value: '', disabled: !this.isEdit }, Validators.required],
      estimatedAmount: [{ value: null, disabled: !this.isEdit }, Validators.required],
      status: [''],
      id: [''],
    });

    this.translocoService.langChanges$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.menu = [
        { label: this.translocoService.translate('menu.guarantee'), routerLink: '/guarantee/list' },
        { label: this.translocoService.translate('menu.guarantee.detail') }
      ];
    });

    this.route.params.pipe(
      tap(() => this.loadingService.show()),
      takeUntil(this.destroy$),
      map((param) => param['id']),
      switchMap((id) => this.guaranteeService.getGuaranteeRequestsById(id)),
      tap((data) => {
        this.guaranteeForm.patchValue({
          id: data?.id,
          patientId: data?.patientId,
          patientName: data?.patientName,
          dateOfBirth: data?.dateOfBirth ? new Date(data?.dateOfBirth) : '',
          gender: data?.gender,
          phone: data?.phone,
          address: data?.address,
          department: data?.department,
          treatmentType: data?.treatmentType,
          admissionDate: data?.admissionDate ? new Date(data?.admissionDate) : '',
          estimatedDischargeDate: data?.estimatedDischargeDate ? new Date(data?.estimatedDischargeDate) : '',
          contractNo: data?.contractNo,
          insuranceCardNo: data?.insuranceCardNo,
          estimatedAmount: data?.estimatedAmount,
          status: data?.status,
        })
        this.isEdit = data?.status === 'DRAFT';
        this.timelineEvents = data?.timeline || [];
        this.loadingService.hide()
      })
    ).subscribe();
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

  getMarkerIcon(status: GuaranteeStatus): string {
    const map: Record<GuaranteeStatus, string> = {
      DRAFT: 'pi pi-file-edit',
      SUBMITTED: 'pi pi-send',
      REVIEWING: 'pi pi-search',
      APPROVED: 'pi pi-check',
      REJECTED: 'pi pi-times',
      PAID: 'pi pi-dollar',
    };
    return map[status] ?? 'pi pi-circle-fill';
  }

  getMarkerClass(status: GuaranteeStatus): string {
    const map: Record<GuaranteeStatus, string> = {
      DRAFT: 'bg-surface-400',
      SUBMITTED: 'bg-blue-500',
      REVIEWING: 'bg-yellow-500',
      APPROVED: 'bg-green-500',
      REJECTED: 'bg-red-500',
      PAID: 'bg-green-600',
    };
    return map[status] ?? 'bg-surface-400';
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  close() {
    this.router.navigate(['/guarantee/list'])
  }

  updateGurantee() {
    this.loadingService.show()
    const body = {
      ...this.guaranteeForm.getRawValue(),
      estimatedDischargeDate: moment(this.guaranteeForm.value.estimatedDischargeDate).format('YYYY-MM-DD'),
      admissionDate: moment(this.guaranteeForm.value.admissionDate).format('YYYY-MM-DD'),
      status: 'DRAFT',
    }

    this.guaranteeService.updateRequest(body).pipe(finalize(() => this.loadingService.hide())).subscribe({
      next: (res) => {
        this.toastService.showSuccess(this.translocoService.translate('message.success.update'))
        this.router.navigate(['/guarantee/list'])
      },
      error: (err) => {
        this.toastService.showError(err?.message || this.translocoService.translate('message.error.general'))
      }
    })
  }
}
