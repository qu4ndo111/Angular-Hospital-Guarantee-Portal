import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();

  const returnUrl = state.url;

  if (isAuthenticated) {
    return true;
  }

  router.navigate(['/auth/login'], { queryParams: { returnUrl } });
  return false;
};
