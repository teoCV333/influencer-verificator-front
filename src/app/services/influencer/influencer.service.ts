import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, finalize, Observable } from 'rxjs';
import { APIResponse } from '../../model/interface/APIResponse';
import { Influencer } from '../../model/interface/Influencer';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Injectable({
  providedIn: 'root'
})
export class InfluencerService {
  private apiUrl = 'https://influencer-verificator-backend.vercel.app/api';
  influencers = signal<Influencer[]>([]);
  loading = signal<boolean>(true);
  showModal = signal<boolean>(false);
  errorMessage = signal<string>("");

  constructor(private http: HttpClient) {
    this.loadInfluencers();
  }

  private loadInfluencers() {
    const cachedData = localStorage.getItem('influencers');
    if (!cachedData || cachedData.length == 0) {
      this.getAllInfluencers().subscribe({
        next: (res) => {
          this.influencers.set(res.data);
          localStorage.setItem('influencers', JSON.stringify(res.data));
          this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error loading influencers:', error);
          this.loading.set(false); // Ensure loading is set to false on error
        }
      });
    } else {
      this.loading.set(false);
      this.influencers.set(JSON.parse(cachedData));
    }
  }


  addInfluencer(newInfluencer: Influencer) {
    const currentInfluencers = this.influencers();
    console.log(this.influencers());
    console.log(newInfluencer);
    const existentInfluencer = this.influencers().some(influencer => influencer._id === newInfluencer._id);
    if (!existentInfluencer && newInfluencer) {
      this.influencers.update(() => [...currentInfluencers, newInfluencer]);
      localStorage.setItem('influencers', JSON.stringify(this.influencers()));
    }
  }


  clearCache() {
    localStorage.removeItem('influencers');
    this.influencers.set([]);
  }

  getAllInfluencers(): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.apiUrl}/influencer`);
  }

  getInfluencerByName(params: any): Observable<APIResponse> {
    const { name, filter, claims, token } = params;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}` // Assuming token is a Bearer token
    });
    return this.http.get<APIResponse>(`${this.apiUrl}/influencer/${name}`, {
      headers,
      params: {
        filter: filter,
        claimsNumber: claims.toString()
      }
    });
  }

  searchNewClaims(): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.apiUrl}/influencer`);
  }

}
