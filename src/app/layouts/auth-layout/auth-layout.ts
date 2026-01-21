import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeToggleComponent } from '../../core/components/theme-toggle.component';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, ThemeToggleComponent],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {}
