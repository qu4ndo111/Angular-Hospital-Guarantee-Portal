/**
 * Menu Configuration - Starter Kit Version
 *
 * This is a minimal, generic menu structure for starter projects.
 * Customize this file for each client/freelance project.
 *
 * Instructions:
 * 1. Replace generic labels with client's actual modules
 * 2. Update icons to match features (see: https://primeng.org/icons)
 * 3. Set routerLink paths according to your routes
 * 4. Add/remove items based on client requirements
 */

/**
 * Menu item interface
 */
export interface MenuItem {
    label: string;
    icon: string;
    routerLink?: string;
    children?: MenuItem[];
    badge?: string;
    badgeSeverity?: 'success' | 'info' | 'warning' | 'danger';
    visible?: boolean;
}

/**
 * ========================================
 * STARTER MENU - Generic Placeholders
 * ========================================
 */
export const MENU_ITEMS: MenuItem[] = [
    // Dashboard - Most apps need this
    {
        label: 'menu.dashboard',
        icon: 'pi pi-home',
        routerLink: '/dashboard',
    },

    // Example nested menu (Module 1)
    {
        label: 'menu.guarantee',
        icon: 'pi pi-box',
        children: [
            {
                label: 'menu.guarantee.list',
                icon: 'pi pi-list',
                routerLink: '/guarantee/list',
            },
            {
                label: 'menu.guarantee.create',
                icon: 'pi pi-plus',
                routerLink: '/guarantee/create',
            },
        ],
    },

    // Example simple menu (Module 2)
    {
        label: 'Module 2',
        icon: 'pi pi-users',
        routerLink: '/module2',
    },

    // Settings - Most apps need this
    {
        label: 'Settings',
        icon: 'pi pi-cog',
        routerLink: '/settings',
    },
];

/**
 * ========================================
 * REAL-WORLD EXAMPLES (Comment out above, use one below)
 * ========================================
 */

/**
 * Example 1: E-commerce
 */
/*
export const MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
  {
    label: 'Products',
    icon: 'pi pi-box',
    children: [
      { label: 'All Products', icon: 'pi pi-list', routerLink: '/products' },
      { label: 'Add Product', icon: 'pi pi-plus', routerLink: '/products/add' },
      { label: 'Categories', icon: 'pi pi-tags', routerLink: '/products/categories' },
    ],
  },
  { label: 'Orders', icon: 'pi pi-shopping-cart', routerLink: '/orders' },
  { label: 'Customers', icon: 'pi pi-users', routerLink: '/customers' },
  { label: 'Settings', icon: 'pi pi-cog', routerLink: '/settings' },
];
*/

/**
 * Example 2: CRM System
 */
/*
export const MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
  { label: 'Leads', icon: 'pi pi-user-plus', routerLink: '/leads' },
  { label: 'Contacts', icon: 'pi pi-users', routerLink: '/contacts' },
  { label: 'Companies', icon: 'pi pi-building', routerLink: '/companies' },
  {
    label: 'Sales',
    icon: 'pi pi-dollar',
    children: [
      { label: 'Opportunities', icon: 'pi pi-star', routerLink: '/sales/opportunities' },
      { label: 'Quotes', icon: 'pi pi-file', routerLink: '/sales/quotes' },
    ],
  },
  { label: 'Reports', icon: 'pi pi-chart-line', routerLink: '/reports' },
  { label: 'Settings', icon: 'pi pi-cog', routerLink: '/settings' },
];
*/

/**
 * Example 3: Admin Dashboard
 */
/*
export const MENU_ITEMS: MenuItem[] = [
  { label: 'Overview', icon: 'pi pi-home', routerLink: '/dashboard' },
  {
    label: 'User Management',
    icon: 'pi pi-users',
    children: [
      { label: 'All Users', icon: 'pi pi-list', routerLink: '/users' },
      { label: 'Roles', icon: 'pi pi-shield', routerLink: '/users/roles' },
    ],
  },
  { label: 'Content', icon: 'pi pi-file-edit', routerLink: '/content' },
  { label: 'Media', icon: 'pi pi-images', routerLink: '/media' },
  {
    label: 'System',
    icon: 'pi pi-cog',
    children: [
      { label: 'Settings', icon: 'pi pi-sliders-h', routerLink: '/system/settings' },
      { label: 'Logs', icon: 'pi pi-history', routerLink: '/system/logs' },
    ],
  },
];
*/

/**
 * ========================================
 * HELPER FUNCTIONS
 * ========================================
 */

/**
 * Get menu items filtered by user permissions
 * @param userPermissions - Array of user permission strings
 * @returns Filtered menu items
 */
export function getMenuItems(userPermissions?: string[]): MenuItem[] {
    if (!userPermissions) {
        return MENU_ITEMS;
    }

    return MENU_ITEMS.filter((item) => {
        if (item.visible === false) return false;

        // TODO: Add your permission logic here
        // Example:
        // if (item.requiredPermission) {
        //   return userPermissions.includes(item.requiredPermission);
        // }

        return true;
    }).map((item) => {
        if (item.children) {
            return {
                ...item,
                children: item.children.filter((child) => child.visible !== false),
            };
        }
        return item;
    });
}

/**
 * Check if menu item has children
 */
export function hasChildren(item: MenuItem): boolean {
    return !!item.children && item.children.length > 0;
}

/**
 * Get active menu item based on current route
 */
export function getActiveMenuItem(currentRoute: string): MenuItem | undefined {
    for (const item of MENU_ITEMS) {
        if (item.routerLink === currentRoute) {
            return item;
        }
        if (item.children) {
            const active = item.children.find((child) => child.routerLink === currentRoute);
            if (active) return active;
        }
    }
    return undefined;
}
