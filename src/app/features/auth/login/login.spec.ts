import { render, screen } from '@testing-library/angular';
import { Login } from './login';
import { AuthService } from '../services/auth.service';
import { ToastService } from '@app/shared/services/toast.service';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { ActivatedRoute, Router, provideRouter } from '@angular/router'; // Sử dụng provideRouter hiện đại
import { TestBed } from '@angular/core/testing';
import userEvent from '@testing-library/user-event';
import { of, throwError } from 'rxjs';

describe('Login Component', () => {
  let mockAuthService: any;
  let mockToastService: any;
  let mockActivatedRoute: any;

  beforeEach(() => {
    mockAuthService = {
      login: jasmine.createSpy('login'),
    };
    mockToastService = {
      showSuccess: jasmine.createSpy('showSuccess'),
      showError: jasmine.createSpy('showError')
    };
    mockActivatedRoute = {
      snapshot: {
        queryParams: {
          returnUrl: '/dashboard'
        }
      }
    };
  });

  async function setup() {
    return await render(Login, {
      imports: [
        TranslocoTestingModule.forRoot({
          langs: {
            en: {
              'auth.login.emailOrUsername': 'auth.login.emailOrUsername',
              'auth.common.password': 'auth.common.password',
              'auth.login.forgotPasswordLink': 'auth.login.forgotPasswordLink',
              'auth.login.registerLink': 'auth.login.registerLink',
              'auth.login.success': 'auth.login.success',
              'auth.validation.passwordIncorrect': 'auth.validation.passwordIncorrect'
            }
          },
          translocoConfig: {
            availableLangs: ['en'],
            defaultLang: 'en',
          },
        })
      ],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
        { provide: ToastService, useValue: mockToastService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });
  }

  it('should render the login form correctly', async () => {
    await setup();

    const emailInput = screen.getByLabelText('auth.login.emailOrUsername') as HTMLInputElement;
    expect(emailInput).toBeTruthy();
    expect(emailInput.value).toBe('admin@admin.com');

    const passwordInput = screen.getByLabelText('auth.common.password') as HTMLInputElement;
    expect(passwordInput).toBeTruthy();
    expect(passwordInput.value).toBe('123456aA@');

    const loginButton = screen.getByRole('button');
    expect(loginButton).toBeTruthy();

    const forgotPasswordLink = screen.getByText('auth.login.forgotPasswordLink');
    expect(forgotPasswordLink).toBeTruthy();

    const registerLink = screen.getByText('auth.login.registerLink');
    expect(registerLink).toBeTruthy();
  });

  it('should show error when submitting empty form', async () => {
    await setup();

    const emailInput = screen.getByLabelText('auth.login.emailOrUsername') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('auth.common.password') as HTMLInputElement;

    await userEvent.clear(emailInput);
    await userEvent.clear(passwordInput);

    expect(emailInput.value).toBe('');
    expect(passwordInput.value).toBe('');

    const loginButton = screen.getByRole('button') as HTMLButtonElement;
    expect(loginButton.disabled).toBe(true);
  });

  it('should show error when submit wrong credential', async () => {
    mockAuthService.login.and.returnValue(throwError(() => new Error('Unauthorized')));

    await setup();

    const emailInput = screen.getByLabelText('auth.login.emailOrUsername') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('auth.common.password') as HTMLInputElement;

    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, '123');

    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, '123');

    const loginButton = screen.getByRole('button') as HTMLButtonElement;
    expect(loginButton.disabled).toBe(false);

    await userEvent.click(loginButton);

    expect(mockAuthService.login).toHaveBeenCalledWith({ email: '123', password: '123' });
    expect(mockToastService.showError).toHaveBeenCalledWith('auth.validation.passwordIncorrect');
  });

  it('should login successfully when submit valid credential', async () => {
    mockAuthService.login.and.returnValue(of({ token: 'fake-jwt' }));

    await setup();

    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');

    const loginButton = screen.getByRole('button') as HTMLButtonElement;
    expect(loginButton.disabled).toBe(false);

    await userEvent.click(loginButton);

    expect(mockAuthService.login).toHaveBeenCalledWith({ email: 'admin@admin.com', password: '123456aA@' });
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('auth.login.success');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });
});
