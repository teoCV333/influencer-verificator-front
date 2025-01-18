import { Component, OnInit } from '@angular/core';
import { Influencer } from '../../model/interface/Influencer';
import { InfluencerService } from '../../services/influencer.service';
import { Router } from '@angular/router';
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
  influencer!: Influencer;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
      if (navigation && navigation.extras.state) {
          this.influencer = navigation.extras.state['influencer']; // Access your data here
      }
  }

  ngOnInit(): void {
      console.log(this.influencer)
  }
}
