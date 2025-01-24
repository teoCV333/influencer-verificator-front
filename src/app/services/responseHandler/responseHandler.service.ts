import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResponseHandlerService {
  showModal = signal<boolean>(false);
  message = signal<string>('');
  success = signal<boolean>(false);
  error = signal<boolean>(false);

  showErrorResponse() {
    this.error.set(true);
  }

  showSuccessResponse() {
    this.success.set(true);
  }
}
