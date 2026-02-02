# 🚀 Angular Business Base - Freelance Starter Kit

> Lean Angular 20 starter kit for freelance projects. Pull, customize, ship fast.

[![Angular](https://img.shields.io/badge/Angular-20.3-red.svg)](https://angular.io/)
[![PrimeNG](https://img.shields.io/badge/PrimeNG-20.4-blue.svg)](https://primeng.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

---

## 🎯 Overview

Minimal yet complete starter kit for freelance developers. **Philosophy: "Just Enough, Not Too Much"**

### What's Included ✅

- 🔐 **Auth Flow** - Login, Register, Forgot Password + Guards
- 🎨 **UI/UX** - Responsive layouts, Dark/Light theme, PrimeNG + TailwindCSS
- 🌍 **i18n** - EN/VI with Transloco + Language switcher
- 🏗️ **Layouts** - Main layout (header, sidebar, footer) + Auth layout
- 🧩 **Components** - Button, DataTable wrappers + Toast, ConfirmDialog services

### Tech Stack

Angular 20.3 • PrimeNG 20.4 • Transloco 8.2 • TailwindCSS 4.1 • TypeScript 5.9

---

## 📁 Key Project Structure

```
src/app/
├── core/                    # Guards, services, app-wide config
│   ├── config/menu.ts       # Sidebar menu
│   ├── guard/               # Auth & guest guards
│   └── services/            # Theme service
│
├── features/                # Feature modules
│   ├── auth/               # Login, Register, Forgot Password
│   └── dashboard/          # Main dashboard
│
├── layouts/                 # Layout components
│   ├── main-layout/        # Header + Sidebar + Content
│   └── auth-layout/        # Centered layout for auth
│
└── shared/                  # Shared resources
    ├── components/         # Header, Footer, Sidebar, etc.
    ├── ui/                 # Button, DataTable, ConfirmDialog wrappers
    └── services/           # Toast, ConfirmDialog services
```

---

## 🚀 Quick Start

```bash
# Install
npm install

# Start dev server
npm start

# Navigate to http://localhost:4200/
# Login: admin@admin.com / any password
```

---

## 📚 Common Tasks

### Add New Page

```bash
ng generate component features/your-feature --standalone
```

Add route in `app.routes.ts`:
```typescript
{ path: 'your-feature', component: YourFeatureComponent, canActivate: [authGuard] }
```

### Add Menu Item

Edit `core/config/menu.ts`:
```typescript
{
  label: 'Your Feature',
  icon: 'pi pi-star',
  routerLink: '/your-feature'
}
```

### Add Translation

**`public/assets/i18n/en.json`:**
```json
{ "yourFeature": { "title": "Your Feature" } }
```

**Usage:**
```html
<div *transloco="let t">{{ t('yourFeature.title') }}</div>
```

### Customize Theme

**`src/styles.scss`:**
```scss
:root { --color-primary: #your-color; }
```

### Show Notifications

```typescript
// Toast
constructor(private toast: ToastService) {}
this.toast.showSuccess('Success!');

// Confirm Dialog
constructor(private confirmDialog: ConfirmDialogService) {}
this.confirmDialog.showConfirmDialog(
  'Are you sure?',
  'Confirm',
  () => { /* accept */ },
  () => { /* reject */ }
);
```

### Use DataTable

```typescript
columns = [
  { field: 'id', header: 'ID', sortable: true },
  { field: 'name', header: 'Name', sortable: true }
];
data = [{ id: 1, name: 'John' }];
```

```html
<app-data-table [value]="data" [columns]="columns"></app-data-table>
```

### Build Production

```bash
ng build --configuration production
```

---

## 💼 Freelance Workflow

### Recommended Process

**1. Clone per project:**
```bash
git clone <this-repo> client-project-name
cd client-project-name
rm -rf .git
git init
npm install
```

**2. Customize:**
- Update branding (colors, logo)
- Remove unused features
- Add project-specific components
- Configure API endpoints

**3. Develop & Deploy:**
- Use existing components where possible
- Add new components only when needed
- Build and deploy

**4. After completion:**
- Extract reusable components back to starter kit
- Document lessons learned

### What to Add Per Project

Add based on **actual requirements**, not speculation:

- **Form-heavy:** FormField wrapper
- **E-commerce:** Product cards, cart
- **Dashboard:** Chart wrappers, stat cards
- **Content:** Rich text editor
- **File uploads:** Upload component

---

## 🏗️ Architecture

### Folder Philosophy

- **`core/`** - Singleton services, guards, app config
- **`features/`** - Business features, lazy-loadable
- **`shared/`** - Reusable across features

### Why Minimal Wrappers?

Only wrap when you need:
- Consistent customization across app
- Enforce certain props
- Additional functionality

**Don't wrap just to wrap.**

### Mocked Auth

Every project has different auth (JWT, OAuth, session). Mocked flow shows the pattern - easy to replace with real implementation.

---

## ❌ Intentionally NOT Included

To keep starter kit lean:

- ❌ State Management (NgRx) - add if project is complex
- ❌ Form wrappers (Input, Checkbox) - requirements vary
- ❌ API integration - every backend is different
- ❌ File upload - strategies vary
- ❌ Charts/graphs - add when needed
- ❌ Testing setup - add based on requirements
- ❌ CI/CD - varies per client

**Better to add what you need, when you need it.**

---

## 🎨 Quick Customization

### Colors
```scss
// src/styles.scss
:root {
  --color-primary: #your-brand;
  --color-secondary: #your-secondary;
}
```

### Logo
Replace logo in `shared/components/header/header.html` and `public/favicon.ico`

### Menu
Edit `core/config/menu.ts`

### Remove Auth
```bash
rm -rf src/app/features/auth
# Remove auth routes and guards
```

### Remove i18n
```bash
# Remove transloco from app.config.ts
# Remove language-switcher from header
# Use hardcoded strings
```

---

## � Commands

```bash
npm start                              # Dev server
npm run build                          # Production build
ng generate component <name> --standalone   # New component
ng generate service <name>             # New service
```

---

## 🤝 Improve Your Starter Kit

After each project:

1. **Extract reusable components** → Add to `shared/ui`
2. **Document patterns** → Update README
3. **Refactor improvements** → Commit back
4. **Keep project-specific code** → Don't add to starter kit

---

## 🎯 Success Metrics

- ⏱️ Start new project in **< 30 minutes**
- 🧠 Understand codebase in **< 1 hour**
- ⚡ Ship MVP in **< 1 week**
- 🔧 Customize without fighting the framework

---

## 📖 Resources

- [Angular Docs](https://angular.dev)
- [PrimeNG Docs](https://primeng.org/)
- [Transloco Docs](https://jsverse.github.io/transloco/)

---

**Philosophy:** This is a **starting point**, not a complete framework. Add features based on **real requirements**, not speculation. Keep it **simple and maintainable**. Learn from each project and improve iteratively.

**Happy coding! 🚀**
