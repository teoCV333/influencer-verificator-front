import { Component, inject, OnInit } from '@angular/core';
import { Influencer } from '../../model/interface/Influencer';
import { InfluencerService } from '../../services/influencer/influencer.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuantityParsePipe } from "../../pipes/quantity-parse.pipe";
import { ResponseHandlerService } from '../../services/responseHandler/responseHandler.service';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from "../../components/modal/modal.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, QuantityParsePipe, FormsModule, ModalComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  influencerService = inject(InfluencerService);
  responseHandlerService = inject(ResponseHandlerService);
  route = inject(ActivatedRoute);
  influencerId = "";
  influencer: Influencer;

  contentCategories = ["All", "Sleep", "Performance", "Hormones", "Nutrition", "Exercise", "Stress", "Cognition", "Motivation", "Recovery", "Mental Health"];
  verificationStatus = ["All", "Verificated", "Questionable", "Debunked"];

  selectedCategory = 'All';
  selectedStatus = 'All';

  constructor() {
    this.responseHandlerService.success.set(false);
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

  get filteredClaims() {
    return this.influencer.claims.filter(claim => {
      const matchesCategory = this.selectedCategory === 'All' || claim.categories.includes(this.selectedCategory);
      const matchesStatus = this.selectedStatus === 'All' || claim.verificationStatus === this.selectedStatus;
      return matchesCategory && matchesStatus;
    });
  }

  searchNewClaims() {
    this.responseHandlerService.message.set("Coming soon.");
    this.responseHandlerService.showModal.set(true);
  }
}
