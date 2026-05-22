import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { TranslocoModule } from '@jsverse/transloco';
import { TranslocoService } from '@jsverse/transloco';

import { AuthService } from '../services/auth.service';
import { finalize } from 'rxjs';
import { Button } from 'src/app/shared/ui/button/button';
import { ToastService } from '@app/shared/services/toast.service';

@Component({
  selector: 'app-login',
  imports: [InputTextModule, PasswordModule, FormsModule, ReactiveFormsModule, Button, TranslocoModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  loading = signal(false);
  returnUrl: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private toastService: ToastService, private translocoService: TranslocoService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['admin@admin.com', [Validators.required]],
      password: ['123456aA@', [Validators.required]],
    });

    const rawReturnUrl = this.route.snapshot.queryParams['returnUrl'];
    this.returnUrl = this.validateReturnUrl(rawReturnUrl);
  }

  onSubmit() {
    if (this.loginForm.invalid) return

    this.loading.set(true);
    this.authService.login(this.loginForm.value).pipe(finalize(() => {
      this.loading.set(false);
    })).subscribe({
      next: (res) => {
        this.toastService.showSuccess(this.translocoService.translate('auth.login.success'));
        this.loginForm.reset();
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        this.toastService.showError(this.translocoService.translate('auth.validation.passwordIncorrect'))
      }
    })
  }

  private validateReturnUrl(url: string | undefined): string {
    const DEFAULT = '/dashboard';
    if (!url) return DEFAULT;
    if (url.startsWith('/') && !url.startsWith('//')) return url;
    return DEFAULT;
  }
}
