import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InfluencerService } from '../../services/influencer.service';
import { APIResponse } from '../../model/interface/APIResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalComponent } from '../../components/modal/modal.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalComponent, NgxUiLoaderModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  showModal: boolean = false;
  errorMessage: string = "";
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

  constructor(private fb: FormBuilder, private router: Router, private influencerService: InfluencerService) {
    this.researchForm = this.fb.group({
      filter: ['week'],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      claims: [50, [Validators.min(10), Validators.max(200)]],
      token: ['', [Validators.required, Validators.minLength(50)]]
    });

  }

  ngOnInit(): void {

  }

  selectRange(range: any) {
    this.dateFilters.map((date) => date.active = false);
    this.researchForm.patchValue({ filter: range.value });
    range.active = true;
  }

  onSubmit() {
    if (this.researchForm.valid) {
      this.searchInfluencer(this.researchForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  closeModal() {
    this.showModal = false; // Set visibility to false when modal is closed
  }

  searchInfluencer(data: any) {
    const influencer = this.influencerService.searchInfluencer(data);
    console.log(influencer)
   /*  this.influencerService.getInfluencerByName(data).subscribe((res: APIResponse) => {
      this.router.navigate(["/profile", res.data.name], {state: { influencer: res.data}})
    }, (error: HttpErrorResponse) => {
      const errorResponse = error.error;
      this.errorMessage = errorResponse.status.message;
      this.showModal = true;
    }); */
  }
}
