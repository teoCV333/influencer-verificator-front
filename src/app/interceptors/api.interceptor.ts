import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { catchError, finalize, throwError } from "rxjs";
import { ResponseHandlerService } from "../services/responseHandler/responseHandler.service";

export const ApiInterceptor: HttpInterceptorFn = (req, next) => {
  const ngxUiLoaderService = inject(NgxUiLoaderService);
  const responseHandlerService = inject(ResponseHandlerService)
  console.log("interceptor", req)
  ngxUiLoaderService.start();

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      //responseHandlerService.message.set(error.error.status.message);
      console.log
      return throwError(() => error);
    }),
    finalize(() => {
      ngxUiLoaderService.stop();
      /* if (responseHandlerService.success() === false) {
        responseHandlerService.error.set(true);
      } else {
        responseHandlerService.success.set(true);
      } */
    })
  )
}