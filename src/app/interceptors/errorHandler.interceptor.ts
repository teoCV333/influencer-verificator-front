import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ResponsePageService } from '@services/responsePage/responsePage.service';
import { SpinnerService } from '@services/spinner/spinner.service';
import { catchError, throwError } from 'rxjs';

export const ErrorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const responsePageService = inject(ResponsePageService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log(`error handler ${error.status}`)
      if (error.status == 401) {
        responsePageService.showError('Invalid Token.');
      }
      if (error.status == 404) {
        responsePageService.showError('Influencer Not Found');
      }
      if(error.status == 422) {
        responsePageService.showError("Invalid Parameters.");
        router.navigate(['/']);
      }
      const errorMsg = error.error.message;
      return throwError(() => errorMsg);
    })
  );
};
