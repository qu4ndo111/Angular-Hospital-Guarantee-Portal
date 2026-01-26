import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

@Component({
  selector: 'app-header',
  imports: [CommonModule, ThemeToggleComponent, LanguageSwitcherComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

}
