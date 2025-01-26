import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ModalService } from '@services/modal/modal.service';
import { SpinnerService } from '@services/spinner/spinner.service';
import { catchError, finalize, throwError } from 'rxjs';

export const SpinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerService = inject(SpinnerService);
  spinnerService.show();
  return next(req).pipe(finalize(() => spinnerService.hide()));
};
