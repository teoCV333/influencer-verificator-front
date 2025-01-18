import { HttpInterceptorFn } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { finalize } from "rxjs";

 export const ApiInterceptor: HttpInterceptorFn = (req, next) => {
   const ngxUiLoaderService = inject(NgxUiLoaderService);
   console.log("interceptor")
   ngxUiLoaderService.start();
    return next(req).pipe(finalize(() => ngxUiLoaderService.stop()))
 }