import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpErrorBus } from '@app/core/services/http-error-bus.service';
import { catchError, throwError } from 'rxjs';

const HTTP_ERROR_MESSAGES: Record<number, string> = {
  0: 'Network connection error. Please check your internet.',
  400: 'Please check the highlighted fields and correct the errors.',
  401: 'Session expired. Please log in again to continue.',
  403: "You don't have permission to perform this action.",
  404: "We couldn't find the data you were looking for.",
  422: 'Please check the highlighted fields and correct the errors.',
  500: 'Oops! Something went wrong on the server. Please try again later.',
};

export const responseInterceptor: HttpInterceptorFn = (req, next) => {
  const errorBus = inject(HttpErrorBus);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const message =
        HTTP_ERROR_MESSAGES[err.status] ??
        'Oops! Something went wrong. Please try again later.';

      errorBus.emit(message);
      return throwError(() => err);
    })
  );
};

