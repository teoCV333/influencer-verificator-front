import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { catchError, finalize, throwError } from 'rxjs';
import { ResponseHandlerService } from '../services/responseHandler/responseHandler.service';

export const ApiInterceptor: HttpInterceptorFn = (req, next) => {
  const ngxUiLoaderService = inject(NgxUiLoaderService);
  ngxUiLoaderService.start();
  return next(req).pipe(
    finalize(() => {
      ngxUiLoaderService.stop();
    })
  );
};
