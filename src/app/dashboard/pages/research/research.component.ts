import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InfluencerService } from '@services/influencer/influencer.service';
import { ResponsePageService } from '@services/responsePage/responsePage.service';
import { TitleComponent } from '@shared/title/title.component';

@Component({
  standalone: true,
  imports: [CommonModule, TitleComponent, ReactiveFormsModule],
  templateUrl: './research.component.html',
  styles: ``,
})
export default class ResearchComponent {
  private influenerService = inject(InfluencerService);
  private responsePageService = inject(ResponsePageService);
  public dateFilters = signal([
    {
      id: 1,
      title: 'Last Week',
      active: true,
      value: 'week',
    },
    {
      id: 2,
      title: 'Last Month',
      active: false,
      value: 'month',
    },
    {
      id: 3,
      title: 'Last Year',
      active: false,
      value: 'year',
    },
    {
      id: 4,
      title: 'All Time',
      active: false,
      value: 'all',
    },
  ]);

  public researchForm: FormGroup;
  public submitted = false;

  constructor(private fb: FormBuilder, private router: Router) {
      this.researchForm = this.fb.group({
        filter: ['week'],
        name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
        claims: [50, [Validators.min(10), Validators.max(200)]],
        token: ['', [Validators.required, Validators.minLength(50)]]
      });
  
    }

  public searchInfluencer() {
    this.submitted = true;  
    console.log("searching", this.researchForm.value);
    this.influenerService.searchInfluencerByName(this.researchForm.value).subscribe(data => {
      this.responsePageService.showSuccess("Successful Research.")
      this.router.navigate(['dashboard/influencer', data._id]);
    });
  }

  public toggleDateRange(index: number) {
    const updatedDateFilters = this.dateFilters().map((date, i) => ({
      ...date,
      active: i === index ? !date.active : false,
    }));
    this.researchForm.patchValue({ filter: updatedDateFilters.filter(filter => filter.active) });
    this.dateFilters.set(updatedDateFilters);
  }
}
