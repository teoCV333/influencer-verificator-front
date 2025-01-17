import { Component, inject, OnInit } from '@angular/core';
import { InfluencerService } from '../../services/influencer.service';
import { APIResponse } from '../../model/interface/APIResponse';
import { Influencer } from '../../model/interface/Influencer';
import { CapitalizePipe } from "../../pipes/capitalize.pipe";
import { QuantityParsePipe } from "../../pipes/quantity-parse.pipe";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CapitalizePipe, QuantityParsePipe, FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  influencerService = inject(InfluencerService);
  influencers: Influencer[] = [];
  filteredInfluencers: Influencer[] = [];
  nameFilter: string = "";
  loading: boolean = true;


  constructor(private router: Router) {}


  stats = [
    {
      title: "Active Influencers",
      value: 0
    },
    {
      title: "Claims Verified",
      value: 0
    },
    {
      title: "Average Trust Score",
      value: 0 + '%'
    }
  ]

  categories = [
    {
      name: "All",
      active: true
    },
    {
      name: "Fitness",
      active: false
    },
    {
      name: "Nutrition",
      active: false
    },
    {
      name: "Medicine",
      active: false
    },
    {
      name: "Mental Health",
      active: false
    },
  ]


  ngOnInit(): void {
    this.influencerService.getAllInfluencers().subscribe((res: APIResponse) => {
      this.influencers = res.data;
      this.filteredInfluencers = this.influencers;
      this.calculateStats();
      this.loading = false;
    })
  }

  filterInfluencer(category?: string): void {
    if (category) {
      this.nameFilter = "";
      if (category === 'All') {
        this.filteredInfluencers = this.influencers; // Show all if 'All' is selected
      } else {
        this.filteredInfluencers = this.influencers.filter(influencer =>
          influencer.contentCategories.map(cat => cat.toLowerCase()).includes(category.toLowerCase())
        );
        console.log(this.filteredInfluencers)
      }
      this.categories.forEach(cat => cat.active = cat.name === category);
    }
  }

  searchByName() {
    this.categories.forEach(cat => cat.active = cat.name === 'All' );
    this.filteredInfluencers = this.influencers.filter((influencer) => influencer.name.toLowerCase().includes(this.nameFilter.toLocaleLowerCase()));
    if (!this.nameFilter) {
      this.filteredInfluencers = this.influencers;
    }
  }

  calculateStats(): void {
    const totalInfluencers = this.influencers.length;

    const totalClaims = this.influencers.reduce((acc, influencer) => acc + influencer.claims.length, 0);

    const totalScore = this.influencers.reduce((acc, influencer) => acc + influencer.score, 0);
    const averageTrustScore = totalInfluencers > 0 ? (totalScore / totalInfluencers) / 2 : 0;

    this.stats[0].value = totalInfluencers; // Active Influencers
    this.stats[1].value = totalClaims; // Claims Verified
    this.stats[2].value = `${averageTrustScore.toFixed(1)}%`; // Average Trust Score
  }

  goToInfluencer(influencer: Influencer): void { 
    this.router.navigate(['/profile', influencer.name]);
  }
 
}
