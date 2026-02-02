import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from '../../services/loading.service';

@Component({
    selector: 'app-loading',
    imports: [CommonModule, BlockUIModule, ProgressSpinnerModule],
    templateUrl: './loading.html',
    styleUrl: './loading.scss'
})
export class Loading {
    constructor(public loadingService: LoadingService) { }
}
