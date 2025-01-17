import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() isVisible: boolean = false;
  @Input() message: string = '';
  @Output() closeModal = new EventEmitter<void>();
  
  close() {
    this.isVisible = false;
    this.closeModal.emit();
  }
}
