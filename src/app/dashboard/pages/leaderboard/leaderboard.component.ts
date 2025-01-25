import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { InfluencerService } from '@services/influencer/influencer.service';
import { TitleComponent } from '@shared/title/title.component';
import { QuantityParsePipe } from '../../../pipes/quantity-parse.pipe';
import { RouterLink } from '@angular/router';
import { Influencer } from '@interfaces/InfluencerResponse';
import { FormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { DashboardSkeletonComponent } from '../../../shared/skeletons/dashboard-skeleton/dashboard-skeleton.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TitleComponent,
    QuantityParsePipe,
    RouterLink,
    FormsModule,
    DashboardSkeletonComponent,
  ],
  templateUrl: './leaderboard.component.html',
  styles: ``,
})
export default class LeaderboardComponent {
  public influencerService = inject(InfluencerService);
  public stats = computed(() => {
    let initialStates = [
      {
        title: 'Active Influencers',
        value: 0,
      },
      {
        title: 'Claims Verified',
        value: 0,
      },
      {
        title: 'Average Trust Score',
        value: 0 + '%',
      },
    ];
    if (!this.influencerService.influencers()) {
      return initialStates;
    }
    //active influencers
    initialStates[0].value = this.influencerService.influencers().length;
    //total claims analyzed
    initialStates[1].value = this.influencerService
      .influencers()
      .reduce((acc, influencer) => acc + influencer.claims.length, 0);
    //average trust score
    const totalScore = this.influencerService
      .influencers()
      .reduce((acc, influencer) => acc + influencer.score, 0);
    initialStates[2].value = `${(totalScore / initialStates[0].value).toFixed(
      0
    )}%`;
    return initialStates;
  });

  categories = signal([
    {
      name: 'All',
      active: true,
    },
    {
      name: 'Fitness',
      active: false,
    },
    {
      name: 'Nutrition',
      active: false,
    },
    {
      name: 'Medicine',
      active: false,
    },
    {
      name: 'Mental Health',
      active: false,
    },
  ]);

  public nameFilter = '';

  toggleCategory(index: number) {
    const updatedCategories = this.categories().map((category, i) => ({
      ...category,
      active: i === index ? !category.active : false,
    }));
    this.categories.set(updatedCategories);
  }

  get filteredInfluencers(): Influencer[] {
    const influencers = this.influencerService.influencers();

    // If no filter is applied, return all influencers
    if (
      this.nameFilter === '' &&
      this.categories().some((cat) => cat.active && cat.name === 'All')
    ) {
      return [...influencers];
    }

    // Filter by category
    const filteredByCategory = this.categories().some(
      (cat) => cat.active && cat.name !== 'All'
    )
      ? influencers.filter((influencer) =>
          influencer.contentCategories
            .map((cat) => cat.toLowerCase())
            .includes(
              this.categories()
                .find((cat) => cat.active)
                ?.name?.toLowerCase() || ''
            )
        )
      : influencers;

    // Filter by name
    return filteredByCategory.filter((influencer) =>
      influencer.name.toLowerCase().includes(this.nameFilter.toLowerCase())
    );
  }
}
