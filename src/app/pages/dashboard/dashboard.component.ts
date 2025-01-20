import { Component, inject, OnInit } from '@angular/core';
import { InfluencerService } from '../../services/influencer.service';
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
  router = inject(Router);

  influencers = this.influencerService.influencers;
  nameFilter: string = "";
  loading = this.influencerService.loading

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
      this.calculateStats(); // Recalculate stats if needed
  }

  get filteredInfluencers(): Influencer[] {
    const influencers = this.influencerService.influencers();
    
    // If no filter is applied, return all influencers
    if (this.nameFilter === "" && this.categories.some(cat => cat.active && cat.name === "All")) {
      return [...influencers];
    }

    // Filter by category
    const filteredByCategory = this.categories.some(cat => cat.active && cat.name !== 'All')
      ? influencers.filter(influencer =>
          influencer.contentCategories.map(cat => cat.toLowerCase()).includes(this.categories.find(cat => cat.active)?.name?.toLowerCase() || '')
        )
      : influencers;

    // Filter by name
    return filteredByCategory.filter(influencer =>
      influencer.name.toLowerCase().includes(this.nameFilter.toLowerCase())
    );
  }


  filterInfluencer(category?: string): void {
    if (category) {
      this.nameFilter = ""; // Reset name filter when filtering by category
      this.categories.forEach(cat => cat.active = cat.name === category);
      this.calculateStats(); // Recalculate stats after filtering
    }
  }

  searchByName(): void {
    this.categories.forEach(cat => cat.active = false); // Reset category selection
    this.calculateStats(); // Recalculate stats after searching
  }

  calculateStats(): void {
    const totalInfluencers = this.influencers().length;
    console.log(this.influencers().length)
    const totalClaims = this.influencers().reduce((acc, influencer) => {
      console.log(acc);
      console.log(influencer)
      
      return acc + influencer.claims.length;
    }, 0);

    const totalScore = this.influencers().reduce((acc, influencer) => acc + influencer.score, 0);
    
    const averageTrustScore = totalInfluencers > 0 ? (totalScore / totalInfluencers) / 2 : 0;

    this.stats[0].value = totalInfluencers; // Active Influencers
    this.stats[1].value = totalClaims; // Claims Verified
    this.stats[2].value = `${averageTrustScore.toFixed(1)}%`; // Average Trust Score
  }

  goToInfluencer(influencer: Influencer): void { 
    this.router.navigate(['/profile', influencer._id]);
  }
}
