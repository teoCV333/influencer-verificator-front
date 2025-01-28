import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { InfluencerService } from '@services/influencer/influencer.service';
import { CommonModule } from '@angular/common';
import { QuantityParsePipe } from '../../../pipes/quantity-parse.pipe';
import { FormsModule } from '@angular/forms';
import { InfoComponent } from '../../../shared/icons/info/info.component';

@Component({
  standalone: true,
  imports: [CommonModule, QuantityParsePipe, FormsModule, InfoComponent],
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
  accordionStates: boolean[] = [];

  public selectedCategory = 'All';
  public selectedStatus = 'All';

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

  constructor() {
    // Initialize all accordions to closed
    this.accordionStates = new Array(this.filteredClaims?.length).fill(false);
  }

  toggleAccordion(index: number) {
    this.accordionStates[index] = !this.accordionStates[index];
  }
}
