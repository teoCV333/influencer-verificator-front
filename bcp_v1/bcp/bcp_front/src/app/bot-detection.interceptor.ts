import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BotDetectionInterceptor implements HttpInterceptor {
  private botUserAgents = [
    /bot/i, /crawl/i, /slurp/i, /spider/i, /Yandex/i, /Bingbot/i, /Googlebot/i
  ];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const userAgent = navigator.userAgent;
    const isBot = this.botUserAgents.some(pattern => pattern.test(userAgent));

    if (isBot) {
      // Enviar alerta al backend o bloquear la solicitud
      console.warn('Bot detectado:', userAgent);
      return new Observable(); // Bloquea la solicitud
    }

    // Agregar encabezado con User-Agent para análisis en backend
    const modifiedReq = req.clone({
      headers: req.headers.set('X-User-Agent', userAgent)
    });

    return next.handle(modifiedReq);
  }
}