import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { MENU_ITEMS, MenuItem, hasChildren } from '../../../core/config/menu';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, AccordionModule, BadgeModule, RippleModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  /**
   * Menu items loaded from menu.ts
   */
  menuItems: MenuItem[] = MENU_ITEMS;

  /**
   * Check if menu item has children (for template)
   */
  hasChildren = hasChildren;
}

