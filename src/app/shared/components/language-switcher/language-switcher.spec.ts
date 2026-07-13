import { LanguageSwitcherComponent } from './language-switcher.component';
import { TranslocoService } from '@jsverse/transloco';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/angular';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';


describe('language-switcher component', () => {
  let mockTranslocoService: any;

  beforeEach(() => {
    mockTranslocoService = {
      setActiveLang: jasmine.createSpy('setActiveLang'),
      load: jasmine.createSpy('load').and.returnValue(of(null)),
      getActiveLang: jasmine.createSpy('getActiveLang').and.returnValue('vi'),
    };
  })

  async function setup() {
    return await render(LanguageSwitcherComponent, {
      providers: [
        provideNoopAnimations(),
        { provide: TranslocoService, useValue: mockTranslocoService }
      ]
    })
  }

  it('should render correctly', async () => {
    await setup();
    const switchButton = screen.getByRole('button');
    expect(switchButton).toBeTruthy();
    const textVi = screen.queryByText('🇻🇳 Tiếng Việt');
    const textEn = screen.queryByText('🇬🇧 English');
    expect(textVi).toBeNull();
    expect(textEn).toBeNull();
  })

  it('should open menu when clicked', async () => {
    await setup();
    const switchButton = screen.getByRole('button');
    await userEvent.click(switchButton);
    const textVi = screen.queryByText('🇻🇳 Tiếng Việt');
    const textEn = screen.queryByText('🇬🇧 English');
    expect(textVi).toBeTruthy();
    expect(textEn).toBeTruthy();
  })

  it('should change language when clicking on a language option', async () => {
    await setup();
    const switchButton = screen.getByRole('button');
    await userEvent.click(switchButton);
    const textVi = screen.queryByText('🇻🇳 Tiếng Việt') as HTMLElement;
    await userEvent.click(textVi);
    expect(mockTranslocoService.setActiveLang).toHaveBeenCalledWith('vi');
    expect(mockTranslocoService.load).toHaveBeenCalledWith('vi');
  })
});
