import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InfluencerService } from '../../services/influencer/old-influencer.service';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { APIResponse } from '../../model/interface/APIResponse';
import { SuccessPageComponent } from '../../components/success-page/success-page.component';
import { ResponseHandlerService } from '../../services/responseHandler/responseHandler.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxUiLoaderModule, SuccessPageComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  influencerService = inject(InfluencerService);
  responseHandlerService = inject(ResponseHandlerService);
  ngxUILoaderService = inject(NgxUiLoaderService)
  submitted = false;
  researchForm: FormGroup;
  dateFilters = [
    {
      id: 1,
      title: "Last Week",
      active: true,
      value: "week"
    },
    {
      id: 2,
      title: "Last Month",
      active: false,
      value: "month"
    },
    {
      id: 3,
      title: "Last Year",
      active: false,
      value: "year"
    },
    {
      id: 4,
      title: "All Time",
      active: false,
      value: "all"
    }
  ]

  constructor(private fb: FormBuilder, private router: Router) {
    this.researchForm = this.fb.group({
      filter: ['week'],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      claims: [50, [Validators.min(10), Validators.max(200)]],
      token: ['', [Validators.required, Validators.minLength(50)]]
    });

  }

  selectRange(range: any) {
    this.dateFilters.map((date) => date.active = false);
    this.researchForm.patchValue({ filter: range.value });
    range.active = true;
  }

  onSubmit() {
    this.submitted = true;
    this.ngxUILoaderService.start();
    this.searchInfluencer(this.researchForm.value);
  }

  searchInfluencer(data: any) {
    this.influencerService.getInfluencerByName(data).subscribe(
      {
        next: (res: APIResponse) => {
          console.log(res)
          const newInfluencer = !res.data.data ? res.data : res.data;
          this.influencerService.addInfluencer(newInfluencer);
          this.ngxUILoaderService.stop();
          this.responseHandlerService.success.set(true);
          setTimeout(() => {
            this.router.navigate(['/profile', newInfluencer._id]);
          },2000)
        },
        error: async (error: HttpErrorResponse) => {
          this.ngxUILoaderService.stop();
          let message = 'Internal Error';
          console.log(error.status)
          if(error.status === 401) message = "Invalid Token";
          if(error.status === 404) message = "Influencer Not Found";
          if(error.status === 422) message = "Influencer content not found";
          this.responseHandlerService.message.set(message);
          this.responseHandlerService.error.set(true);
        },
        complete: () => {this.ngxUILoaderService.stop();}
      }
  ); 
  }
}
