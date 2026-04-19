import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@app/shared/components/title/title';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { MenuItem } from 'primeng/api';
import { map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { GuaranteeService } from '../services/guarantee.service';
import { LoadingService } from '@app/shared/services/loading.service';
import { GuaranteeForm } from '../components/guarantee-form/guarantee-form';
import { GuaranteeStatus } from '../models/guarantee.model';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-guarantee-detail',
  imports: [Title, TranslocoPipe, GuaranteeForm, TagModule],
  templateUrl: './guarantee-detail.html',
  styleUrl: './guarantee-detail.scss',
})
export class GuaranteeDetail implements OnInit, OnDestroy {
  menu: MenuItem[] = [];
  guaranteeForm!: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(private translocoService: TranslocoService, private route: ActivatedRoute, private guaranteeService: GuaranteeService, private loadingService: LoadingService, private fb: FormBuilder) { }

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
      department: [''],
      treatmentType: ['', Validators.required],
      admissionDate: ['', Validators.required],
      estimatedDischargeDate: ['', Validators.required],
      contractNo: ['', Validators.required],
      insuranceCardNo: ['', Validators.required],
      estimatedAmount: [null],
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

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
