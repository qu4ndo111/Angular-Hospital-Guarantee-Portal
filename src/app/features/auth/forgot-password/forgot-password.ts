import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { TranslocoModule } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Password } from "primeng/password";

@Component({
  selector: 'app-forgot-password',
  imports: [TranslocoModule, InputTextModule, ReactiveFormsModule, ButtonModule, RouterLink, Password],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword implements OnInit {

  forgotForm: FormGroup = new FormGroup({});
  verifyForm: FormGroup = new FormGroup({});
  resetForm: FormGroup = new FormGroup({});
  loadingSend: boolean = false;
  loadingVerify: boolean = false;
  loadingReset: boolean = false;
  forgotState: 'forgot' | 'verify' | 'reset' = 'forgot';

  constructor(private fb: FormBuilder) {

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
    this.forgotState = 'verify';
  }

  verifyOpt() {
    this.forgotState = 'reset';
  }

  resetPassword() {
    this.forgotState = 'forgot';
  }
}
