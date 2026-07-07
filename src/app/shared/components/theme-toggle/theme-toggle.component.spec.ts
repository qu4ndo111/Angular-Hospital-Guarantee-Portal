import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { signal } from '@angular/core';
import { ThemeToggleComponent } from './theme-toggle.component';
import { ThemeService } from '@app/core/services/theme.service';

describe('ThemeToggleComponent with Testing Library', () => {
  let mockThemeSignal: any;
  let mockThemeService: any;

  beforeEach(() => {
    mockThemeSignal = signal<'light' | 'dark' | 'auto'>('dark');

    mockThemeService = {
      getTheme: () => mockThemeSignal.asReadonly(),
      setTheme: jasmine.createSpy('setTheme').and.callFake((newTheme) => {
        mockThemeSignal.set(newTheme);
      }),
    };
  });

  async function setup() {
    return await render(ThemeToggleComponent, {
      providers: [{ provide: ThemeService, useValue: mockThemeService }],
    });
  }

  it('should render the toggle button with correct icon based on initial dark theme', async () => {
    await setup();
    const button = screen.getByRole('button');
    expect(button).toBeTruthy();
    const moonIcon = button.querySelector('.pi-moon');
    expect(moonIcon).toBeTruthy();
  });

  it('should render the sun icon when initial theme is light', async () => {
    mockThemeSignal.set('light');

    await setup();

    const button = screen.getByRole('button');
    const sunIcon = button.querySelector('.pi-sun');
    expect(sunIcon).toBeTruthy();
  });

  it('should call ThemeService.setTheme to light mode when clicked in dark mode', async () => {
    await setup();

    const button = screen.getByRole('button');

    await userEvent.click(button);

    expect(mockThemeService.setTheme).toHaveBeenCalledWith('light');
  });

  it('should call ThemeService.setTheme to dark mode when clicked in light mode', async () => {
    mockThemeSignal.set('light');

    await setup();

    const button = screen.getByRole('button');

    await userEvent.click(button);

    expect(mockThemeService.setTheme).toHaveBeenCalledWith('dark');
  });
});
