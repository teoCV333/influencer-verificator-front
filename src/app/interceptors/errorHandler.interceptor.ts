import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ModalService } from '@services/modal/modal.service';
import { SpinnerService } from '@services/spinner/spinner.service';
import { catchError, throwError } from 'rxjs';

export const ErrorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const modalService = inject(ModalService);
  const spinnerService = inject(SpinnerService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      spinnerService.hide();
      if (error.status === 404) {
        modalService.show('Influencer Not Found');
      }
      console.log(error);
      const errorMsg = error.error.message;
      return throwError(() => errorMsg);
    })
  );
};
