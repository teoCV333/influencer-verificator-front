import { Component, inject } from '@angular/core';
import { SpinnerService } from '@services/spinner/spinner.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [],
  template: `
    @if(spinnerService.isLoading() == true) {
    <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-10">
      <div class="overlay">
        <div class="flex justify-center items-center min-h-screen">
          <div
            class="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-green-500"
          ></div>
        </div>
      </div>
    </div>
    }
  `,
})
export class SpinnerComponent {
  public spinnerService = inject(SpinnerService);
}
