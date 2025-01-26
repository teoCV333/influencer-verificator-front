import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ResponsePageService {
  error = signal<boolean>(false);
  success = signal<boolean>(false);
  text = signal<string>("");


  public showError(message: string) {
    this.text.set(message);
    this.error.set(true);
    setTimeout(() => {
      this.error.set(false);
      this.text.set('');
    }, 2000);
  }

  public showSuccess(message: string) {
    this.success.set(true);
    setTimeout(() => {
      this.success.set(false);
      this.text.set('');
    }, 2000);
  }
}
