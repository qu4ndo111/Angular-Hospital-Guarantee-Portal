import { HttpInterceptorFn } from '@angular/common/http';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `${token}`,
      },
    });
  }

  return next(req);
};
