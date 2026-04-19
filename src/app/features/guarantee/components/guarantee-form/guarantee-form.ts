import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-guarantee-form',
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, DatePicker, SelectModule, InputNumberModule, FileUploadModule, TranslocoPipe],
  templateUrl: './guarantee-form.html',
  styleUrl: './guarantee-form.scss',
})
export class GuaranteeForm implements OnInit {

  @Input() guaranteeForm!: FormGroup;
  @Input() isEdit: boolean = false;

  treatmentTypes: SelectItem[] = [];

  constructor(private translocoService: TranslocoService) {}

  ngOnInit(): void {
    this.treatmentTypes = [
        { label: this.translocoService.translate('guarantee.create.treatmentSection.types.inpatient'), value: 'INPATIENT' },
        { label: this.translocoService.translate('guarantee.create.treatmentSection.types.outpatient'), value: 'OUTPATIENT' },
        { label: this.translocoService.translate('guarantee.create.treatmentSection.types.surgery'), value: 'SURGERY' },
        { label: this.translocoService.translate('guarantee.create.treatmentSection.types.emergency'), value: 'EMERGENCY' }
      ];
  }
}
