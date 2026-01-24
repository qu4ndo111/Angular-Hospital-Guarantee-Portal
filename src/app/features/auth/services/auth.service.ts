import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';

import { catchError, delay, map, of, switchMap, tap, throwError } from 'rxjs';

import { LoginModel, RegisterModel } from '../model/auth-model';
import { RegisterAccount } from '../register-account/register-account';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient, private translocoService: TranslocoService) { }

  login(payload: LoginModel) {
    return of(payload).pipe(
      delay(800),
      switchMap(({ email, password }) => {
        if (email === 'admin_test' && password === '123456aA@') {
          return of({
            accessToken: 'fake-jwt-token',
            user: { id: 1, name: 'Admin' }
          });
        }
        return throwError(() => new Error(this.translocoService.translate('auth.login.passwordError')));
      }),
      tap((res) => {
        localStorage.setItem('accessToken', res.accessToken);
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    )
  }

  registerAccount(payload: RegisterModel) {
    return of(payload).pipe(
      delay(800),
      switchMap(({username, email, password, confirmPassword}) => {
        const newAccount = {
          username,
          email,
          password,
          confirmPassword
        };
        return of(newAccount);
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    )
  }

  /**
   * Check if user is authenticated by verifying token exists
   * @returns boolean - true if user has valid token
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;

    // TODO: When integrating with real backend, add token expiration check:
    // - Decode JWT token
    // - Check if token is expired
    // - Return false if expired
  }

  /**
   * Get access token from localStorage
   * @returns string | null - access token or null if not found
   */
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Logout user by removing token from localStorage
   */
  logout(): void {
    localStorage.removeItem('accessToken');
    // TODO: When integrating with real backend:
    // - Call logout API endpoint
    // - Clear user data from store/service
    // - Invalidate refresh token if using
  }
}
