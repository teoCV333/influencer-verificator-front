import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  showModal = signal<boolean>(false);
  message = signal<string>('');
}
