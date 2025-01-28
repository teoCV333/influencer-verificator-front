import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { ResponsePageService } from '@services/responsePage/responsePage.service';
import { ErrorComponent } from '@shared/icons/error/error.component';
import { SuccessComponent } from '@shared/icons/success/success.component';

@Component({
  selector: 'app-response-page',
  standalone: true,
  imports: [CommonModule, SuccessComponent, ErrorComponent],
  template: `
    @if(responsePageService.error() == true) {
    <div
      class="fixed inset-0 flex items-center justify-center bg-gray-900 overflow-y-auto"
    >
      <app-error [text]="responsePageService.text()" />
    </div>
    } @else if(responsePageService.success() == true) {
    <div
      class="fixed inset-0 flex items-center justify-center bg-gray-900 overflow-y-auto"
    >
      <app-success [text]="responsePageService.text()" />
    </div>
    }
  `,
})
export class ResponsePageComponent {
  public responsePageService = inject(ResponsePageService);
}
