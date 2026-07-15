import { TranslocoTestingModule } from '@jsverse/transloco';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/angular';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Header } from './header';
import { ErrorSimulatorService } from '@app/shared/services/error-simulator.service';
import { ThemeService } from '@app/core/services/theme.service';
import { LayoutService } from '@app/shared/services/layout.service';
import { Router } from '@angular/router';
import { signal } from '@angular/core';




describe('header component', () => {

  let mockErrorSimulatorService: any;
  let mockThemeService: any;
  let mockLayoutService: any;
  let mockRouter: any;

  beforeEach(() => {
    mockErrorSimulatorService = {
      simulateError: jasmine.createSpy('simulateError').and.returnValue(false),
    };

    mockThemeService = {
      getTheme: jasmine.createSpy('getTheme').and.callFake(() => signal('dark')),
      toggleTheme: jasmine.createSpy('toggleTheme'),
      isDark: jasmine.createSpy('isDark').and.returnValue(false),
    };

    mockLayoutService = {
      toggleMobileSidebar: jasmine.createSpy('toggleMobileSidebar'),
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    spyOn(localStorage, 'removeItem');
  })

  async function setup() {
    return await render(Header, {
      imports: [
        TranslocoTestingModule.forRoot({
          langs: {
            vi: {
              'common.appTitle': 'Business App',
              'header.logout': 'Đăng xuất',
            }
          },
          translocoConfig: {
            availableLangs: ['vi'],
            defaultLang: 'vi',
          },
        })
      ],
      providers: [
        provideNoopAnimations(),
        { provide: Router, useValue: mockRouter },
        { provide: ErrorSimulatorService, useValue: mockErrorSimulatorService },
        { provide: ThemeService, useValue: mockThemeService },
        { provide: LayoutService, useValue: mockLayoutService },
      ],
    })
  }

  it('should render header correctly', async () => {
    const { fixture } = await setup();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('app-language-switcher')).toBeTruthy();
    expect(root.querySelector('app-theme-toggle')).toBeTruthy();
    expect(root.querySelector('app-notification')).toBeTruthy();
    expect(root.querySelector('app-error')).toBeTruthy();

    const buttonToggle = screen.getByRole('button', { name: /toggle menu/i, hidden: true });
    expect(buttonToggle).toBeTruthy();
  })

  it('should toggle mobile sidebar when menu button is clicked', async () => {
    await setup();

    const buttonToggle = screen.getByRole('button', { name: /toggle menu/i, hidden: true });
    expect(buttonToggle).toBeTruthy();

    await userEvent.click(buttonToggle);
    expect(mockLayoutService.toggleMobileSidebar).toHaveBeenCalled();
  })

  it('should open logout menu and log out correctly when user avatar is clicked', async () => {
    await setup();

    const userAvatar = screen.getByTitle('User Profile');

    expect(userAvatar).toBeTruthy();

    await userEvent.click(userAvatar);

    const logout = screen.getByText('Đăng xuất');
    expect(logout).toBeTruthy();

    await userEvent.click(logout);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
    expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken');
  })
})
