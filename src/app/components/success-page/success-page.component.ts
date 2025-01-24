import { Component, inject } from '@angular/core';
import { ResponseHandlerService } from '../../services/responseHandler/responseHandler.service';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderHttpModule } from 'ngx-ui-loader';

@Component({
  selector: 'app-success-page',
  standalone: true,
  imports: [CommonModule, NgxUiLoaderHttpModule],
  templateUrl: './success-page.component.html',
  styleUrl: './success-page.component.scss'
})
export class SuccessPageComponent {
  responseHandlerService = inject(ResponseHandlerService);
  success = this.responseHandlerService.success;
  error = this.responseHandlerService.error;
  errorMsg = this.responseHandlerService.message;
}
