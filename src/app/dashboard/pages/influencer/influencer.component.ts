import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TitleComponent } from '../../../shared/title/title.component';
import { switchMap } from 'rxjs';
import { InfluencerService } from '@services/influencer/influencer.service';
import { CommonModule } from '@angular/common';
import { QuantityParsePipe } from '../../../pipes/quantity-parse.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [TitleComponent, CommonModule, QuantityParsePipe, FormsModule],
  templateUrl: './influencer.component.html',
  styles: ``,
})
export default class InfluencerComponent {
  private route = inject(ActivatedRoute);
  private influencerService = inject(InfluencerService);

  public filters = {
    categories: [
      'All',
      'Sleep',
      'Performance',
      'Hormones',
      'Nutrition',
      'Exercise',
      'Stress',
      'Cognition',
      'Motivation',
      'Recovery',
      'Mental Health',
    ],
    status: ['All', 'Verified', 'Questionable', 'Debunked'],
  };

  public influencer = toSignal(
    this.route.params.pipe(
      switchMap(({ id }) => this.influencerService.getInfluencerById(id))
    )
  );

  selectedCategory = "All";
  selectedStatus = "All";

  get filteredClaims() {
    return this.influencer()?.claims.filter((claim) => {
      const matchesCategory =
        this.selectedCategory === 'All' ||
        claim.categories.includes(this.selectedCategory);
      const matchesStatus =
        this.selectedStatus === 'All' ||
        claim.verificationStatus === this.selectedStatus;
      return matchesCategory && matchesStatus;
    });
  }

  constructor() {}
}
