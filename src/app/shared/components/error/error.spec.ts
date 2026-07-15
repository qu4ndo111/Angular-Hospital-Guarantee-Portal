import { TranslocoTestingModule } from '@jsverse/transloco';
import { render, screen } from '@testing-library/angular';
import { ErrorComponent } from './error.component';
import { ErrorSimulatorService } from '@app/shared/services/error-simulator.service';
import userEvent from '@testing-library/user-event';
import { signal } from '@angular/core';



describe('error component', () => {
  let mockErrorSimulatorService: any

  beforeEach(() => {
    mockErrorSimulatorService = {
      simulateError: signal(false),
    };
  })

  async function setup() {
    return await render(ErrorComponent, {
      imports: [
        TranslocoTestingModule.forRoot({
          langs: {
            vi: {
              'header.errorSimulator': 'header.errorSimulator',
            }
          },
          translocoConfig: {
            availableLangs: ['vi'],
            defaultLang: 'vi',
          },
        })
      ],
      providers: [
        { provide: ErrorSimulatorService, useValue: mockErrorSimulatorService },
      ],
    })
  }

  it('should render error component correctly', async () => {
    await setup();

    const errorSwitch = screen.getByLabelText('header.errorSimulator');
    expect(errorSwitch).toBeTruthy();
  })

  it('should toggle error simulator when switch is clicked', async () => {
    await setup();

    const errorSwitch = screen.getByLabelText('header.errorSimulator') as HTMLInputElement;
    await userEvent.click(errorSwitch);
    expect(mockErrorSimulatorService.simulateError()).toBeTrue();
  })
})
