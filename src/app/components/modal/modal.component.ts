import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ResponseHandlerService } from '../../services/responseHandler/responseHandler.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  responseHandlerService = inject(ResponseHandlerService);
  isVisible = this.responseHandlerService.showModal;
  message = this.responseHandlerService.message;

  constructor() {
  }

}
