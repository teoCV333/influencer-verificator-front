import { Component, OnInit } from '@angular/core';
import { Influencer } from '../../model/interface/Influencer';
import { InfluencerService } from '../../services/influencer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  formData: any;

  influencer!: Influencer;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }
}
