import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResponsePageService } from '@services/responsePage/responsePage.service';
import { SpinnerService } from '@services/spinner/spinner.service';
import { catchError, finalize, throwError } from 'rxjs';

export const SpinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerService = inject(SpinnerService);
  console.log("Spinner")
  spinnerService.show();
  return next(req).pipe(
    finalize(() => spinnerService.hide()));
};
