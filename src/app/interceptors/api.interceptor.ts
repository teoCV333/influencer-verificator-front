import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { catchError, finalize, throwError } from "rxjs";
import { ModalService } from "../services/modal.service";

export const ApiInterceptor: HttpInterceptorFn = (req, next) => {
  const ngxUiLoaderService = inject(NgxUiLoaderService);
  const modalService = inject(ModalService)
  console.log("interceptor", req)
  ngxUiLoaderService.start();

  let errorResponse: HttpErrorResponse | null = null;

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      errorResponse = error;
      return throwError(() => error);
    }),
    finalize(() => {
      ngxUiLoaderService.stop();
      if(errorResponse) {
        modalService.message.set(errorResponse.error.status.message)
        modalService.showModal.set(true);
      }
    })
  )
}