import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { ErrorSimulatorService } from "@app/shared/services/error-simulator.service";
import { TranslocoPipe } from "@jsverse/transloco";

@Component({
    selector: 'app-error',
    standalone: true,
    imports: [ToggleSwitchModule, FormsModule, TranslocoPipe],
    template: `
        <div>
            <label class="error-text" for="errorToggle">{{ 'header.errorSimulator' | transloco }}</label>
            <p-toggleSwitch name="errorToggle" inputId="errorToggle" [ngModel]="errorSimulator.simulateError()" (ngModelChange)="errorSimulator.simulateError.set($event)" />
        </div>
    `,
    styles: [`
        div{
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
        }

        @media (max-width: 768px) {
            .error-text {
                display: none;
            }
        }
    `]
})
export class ErrorComponent {
    public errorSimulator: ErrorSimulatorService;

    constructor(errorSimulator: ErrorSimulatorService) {
        this.errorSimulator = errorSimulator;
    }
}
