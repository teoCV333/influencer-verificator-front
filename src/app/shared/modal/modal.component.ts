import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { ModalService } from '@services/modal/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      id="modal"
      *ngIf="!modalService.isShow"
      class="fixed inset-0 flex items-center justify-center bg-opacity-50"
    >
      <div class="bg-white rounded-lg p-33 shadow-lg text-black">
        <span class="close cursor-pointer" (click)="modalService.hide()"
          >&times;</span
        >
        <h2>{{ modalService.text() }}</h2>
        <button
          (click)="modalService.hide()"
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  `,
})
export class ModalComponent {
  public modalService = inject(ModalService);
  constructor() {
    console.log(this.modalService.isShow());
  }
}
