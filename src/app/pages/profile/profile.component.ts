import { Component, inject, OnInit } from '@angular/core';
import { Influencer } from '../../model/interface/Influencer';
import { InfluencerService } from '../../services/influencer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuantityParsePipe } from "../../pipes/quantity-parse.pipe";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, QuantityParsePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{

  influencerService = inject(InfluencerService);
  route = inject(ActivatedRoute);
  influencerId = "";
  influencer: Influencer;

  constructor() {
    this.route.params.subscribe((params) => {
      this.influencerId = params["id"];
    });{
      console.log(this.influencerId)
    }
    this.influencer = this.influencerService.influencers().filter((influencer) => influencer._id == this.influencerId)[0];
    console.log(this.influencer)
  }


  ngOnInit(): void {
   
  }
}
