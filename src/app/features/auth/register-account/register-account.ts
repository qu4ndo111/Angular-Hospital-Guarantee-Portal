import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { TranslocoModule } from '@jsverse/transloco';
import { TranslocoService } from '@jsverse/transloco';

import { finalize } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register-account',
  imports: [TranslocoModule, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, RouterLink],
  templateUrl: './register-account.html',
  styleUrl: './register-account.scss',
})
export class RegisterAccount implements OnInit {

  registerForm: FormGroup = new FormGroup({});
  loading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private messageService: MessageService, private translocoService: TranslocoService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()\-_=+])[A-Za-z\d@$!%*?&^#()\-_=+]{8,}$/)]],
      confirmPassword: ['', [Validators.required]],
    });

    this.registerForm.get('confirmPassword')?.valueChanges.subscribe((value) => {
      if (value && this.registerForm.get('password')?.value !== value) {
        this.registerForm.get('confirmPassword')?.setErrors({ mismatch: true });
      } else {
        this.registerForm.get('confirmPassword')?.setErrors(null);
      }
    })
  }

  onSubmit() {
    if (this.registerForm.invalid) return
    this.loading = true
    this.authService.registerAccount(this.registerForm.value).pipe(finalize(() => { this.loading = false })).subscribe({
      next: (res) => {
        if (res) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: this.translocoService.translate('auth.register.success') });
          this.registerForm.reset();
          this.router.navigate(['/auth/login']);
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
      }
    })
  }
}
