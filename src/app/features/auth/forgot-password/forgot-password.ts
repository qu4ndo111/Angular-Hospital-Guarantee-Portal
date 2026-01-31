import { Component, computed, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { TranslocoModule } from '@jsverse/transloco';
import { InputTextModule } from 'primeng/inputtext';
import { Password } from "primeng/password";

import { Button } from '@app/shared/ui/button/button';
import { ConfirmDialogService } from '@app/shared/services/confirm-dialog.service';
import { ConfirmDialog } from '@app/shared/ui/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-forgot-password',
  imports: [TranslocoModule, InputTextModule, ReactiveFormsModule, Button, RouterLink, Password],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword implements OnInit {

  forgotForm: FormGroup = new FormGroup({});
  verifyForm: FormGroup = new FormGroup({});
  resetForm: FormGroup = new FormGroup({});
  loadingSend = signal(false);
  loadingVerify = signal(false);
  loadingReset = signal(false);
  forgotState = signal<'forgot' | 'verify' | 'reset'>('forgot');

  constructor(private fb: FormBuilder, private confirmDialogService: ConfirmDialogService) {

  }

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.verifyForm = this.fb.group({
      code: ['', [Validators.required]],
    });

    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()\-_=+])[A-Za-z\d@$!%*?&^#()\-_=+]{8,}$/)]],
      confirmPassword: ['', [Validators.required]],
    });

    this.resetForm.get('confirmPassword')?.valueChanges.subscribe((value) => {
      if(value && this.resetForm.get('password')?.value !== value) {
        this.resetForm.get('confirmPassword')?.setErrors({ mismatch: true });
      } else {
        this.resetForm.get('confirmPassword')?.setErrors(null);
      }
    })
  }

  sendOpt() {
    this.confirmDialogService.showConfirmDialog('Are you sure you want to proceed?', 'Confirmation', () => {
      this.forgotState.set('verify');
      this.loadingSend.set(true)
    }, () => {
      this.loadingSend.set(false)
    })
    const canProcess = computed(() => this.forgotForm.valid && this.forgotState() === 'forgot')
    if(!canProcess()) return
    this.forgotState.set('verify');
    this.loadingSend.set(true)
  }

  verifyOpt() {
    const canProcess = computed(() => this.verifyForm.valid && this.forgotState() === 'verify')
    if(!canProcess()) return
    this.forgotState.set('reset');
    this.loadingVerify.set(true)
  }

  resetPassword() {
    const canProcess = computed(() => this.resetForm.valid && this.forgotState() === 'reset')
    if(!canProcess()) return
    this.forgotState.set('forgot');
    this.loadingReset.set(true)
  }
}
