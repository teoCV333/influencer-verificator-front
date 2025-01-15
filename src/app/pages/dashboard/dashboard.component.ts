import { Component, inject, OnInit } from '@angular/core';
import { InfluencerService } from '../../services/influencer.service';
import { Influencer } from '../../model/interface/influencer';
import { APIResponse } from '../../model/interface/APIResponse';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  influencerService = inject(InfluencerService);
  influencers: Influencer[] = [];

  stats = [
    {
      title: "Active Influencers",
      value: 1.234
    },
    {
      title: "Claims Verified",
      value: 25.431
    },
    {
      title: "Average Trust Score",
      value: 85.7 + '%'
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
    }, error => {
      console.log("API error or Network down");
    });
  }


}
