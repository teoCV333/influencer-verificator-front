import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import type {
  Influencer,
  InfluencerResponse,
  InfluencersResponse,
} from '@interfaces/InfluencerResponse';
import { ResponsePageService } from '@services/responsePage/responsePage.service';
import { SpinnerService } from '@services/spinner/spinner.service';
import { catchError, delay, finalize, map, Observable, throwError } from 'rxjs';

interface State {
  influencers: Influencer[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class InfluencerService {
  private http = inject(HttpClient);
  private apiUrl = 'https://influencer-verificator-backend.vercel.app/api';
  public modalService = inject(ResponsePageService);
  public spinnerService = inject(SpinnerService);

  #state = signal<State>({
    loading: true,
    influencers: [],
  });

  public influencers = computed(() => this.#state().influencers);
  public loading = computed(() => this.#state().loading);

  constructor() {
    this.getAllInfluencers().subscribe((data) => {
      this.#state.set({
        loading: false,
        influencers: data,
      });
    });
  }

  getAllInfluencers(): Observable<Influencer[]> {
    return this.http.get<InfluencersResponse>(`${this.apiUrl}/influencer`).pipe(
      delay(1500),
      map((res) => res.data)
    );
  }

  getInfluencerById(id: string): Observable<Influencer> {
    return this.http
      .get<InfluencerResponse>(`${this.apiUrl}/influencer/profile/${id}`)
      .pipe(map((res) => res.data));
  }

  searchInfluencerByName({
    name,
    filter,
    claims,
    token,
  }: any): Observable<Influencer> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Assuming token is a Bearer token
    });
    return this.http
      .get<InfluencerResponse>(`${this.apiUrl}/influencer/${name}`, {
        headers,
        params: {
          filter: filter,
          claimsNumber: claims.toString(),
        },
      })
      .pipe(map((res) => res.data));
  }
}
