import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

import { TranslocoModule } from '@jsverse/transloco';
import { TranslocoService } from '@jsverse/transloco';

import { AuthService } from '../services/auth.service';
import { finalize } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [InputTextModule, PasswordModule, FormsModule, ReactiveFormsModule, ButtonModule, TranslocoModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  loading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private messageService: MessageService, private translocoService: TranslocoService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if(this.loginForm.invalid) return

    this.loading = true;
    this.authService.login(this.loginForm.value).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: this.translocoService.translate('auth.login.loginSuccess') });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.translocoService.translate('auth.login.passwordError') });
      }
    })
  }
}
