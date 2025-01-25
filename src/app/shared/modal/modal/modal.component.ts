import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal" *ngIf="modalState().show">
      <div class="modal-content">
        <span class="close" (click)="changeModalState('')">&times;</span>
        <h2>{{ modalState().text }}</h2>
        <button (click)="changeModalState('')">Close</button>
      </div>
    </div>
  `,
})
export class ModalComponent {
  public modalState = signal({
    show: false,
    text: '',
  });

  public changeModalState(text: string) {
    this.modalState.update((value) => ({
      ...value,
      show: !value.show,
      text: text ? text : '',
    }));
  }
}
