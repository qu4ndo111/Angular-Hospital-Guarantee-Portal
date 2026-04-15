import { Component, OnInit, signal } from '@angular/core';

import { DataTable } from '@app/shared/ui/data-table/data-table';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { GuaranteeService } from '../../services/guarantee.service';
import { TableColumn } from '@app/shared/ui/data-table/data-table.model';
import { AsyncPipe } from '@angular/common';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Patient } from '../../models/guarantee.model';


interface LookupPopupData {
  cccd: string;
  name?: string;
  dateOfBirth?: string;
}

@Component({
  selector: 'app-lookup-popup',
  imports: [DataTable, AsyncPipe, ButtonModule, TranslocoPipe, ReactiveFormsModule, DatePicker, InputTextModule],
  templateUrl: './lookup-popup.html',
  styleUrl: './lookup-popup.scss',
})



export class LookupPopup implements OnInit {

  lookupForm!: FormGroup;
  loading = signal(false);
  data$ = new BehaviorSubject<LookupPopupData>({
    cccd: ''
  })

  vm$!: Observable<any>
  columns: TableColumn[] = [
  ];

  constructor(public ref: DynamicDialogRef, private config: DynamicDialogConfig, private guaranteeService: GuaranteeService, private translocoService: TranslocoService, private fb: FormBuilder) {
    this.columns = [
      { field: 'id', header: this.translocoService.translate('guarantee.lookupPopup.cccd'),  },
      { field: 'name', header: this.translocoService.translate('guarantee.lookupPopup.name') },
      { field: 'dateOfBirth', header: this.translocoService.translate('guarantee.lookupPopup.dateOfBirth') },
      { field: 'phone', header: this.translocoService.translate('guarantee.lookupPopup.phone') }
    ];
  }

  ngOnInit(): void {
    this.lookupForm = this.fb.group({
      cccd: ['', Validators.required],
      name: [''],
      dateOfBirth: [''],
    })
    this.data$.next(this.config.data)
    this.vm$ = this.data$.pipe(
      tap(() => this.loading.set(true)),
      switchMap(({ cccd }) => {
        return this.guaranteeService.getPatientById(cccd);
      }),
      map((res: any) => {
        if (res) {
          return {
            patients: [res]
          }
        }
        return undefined
      }),
      catchError((error) => {
        return of(undefined)
      }),
      tap(() => this.loading.set(false)),
    );
  }

  lookup() {
    this.data$.next(this.lookupForm.value)
  }

  onPatientSelect(patient: Patient): void {
    this.ref.close(patient);
  }
}
