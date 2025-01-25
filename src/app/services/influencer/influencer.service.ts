import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import type {
  Influencer,
  InfluencerResponse,
  InfluencersResponse,
} from '@interfaces/InfluencerResponse';
import { delay, map } from 'rxjs';

interface State {
  influencers: Influencer[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class InfluencerService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  #state = signal<State>({
    loading: true,
    influencers: [],
  });

  public influencers = computed(() => this.#state().influencers);
  public loading = computed(() => this.#state().loading);

  constructor() {
    this.http
      .get<InfluencersResponse>(`${this.apiUrl}/influencer`)
      .pipe(delay(1500))
      .subscribe((res) => {
        this.#state.set({
          loading: false,
          influencers: res.data,
        });
      });
  }

  getUserById(id: string) {
    return this.http
      .get<InfluencerResponse>(`${this.apiUrl}/influencer/profile/${id}`)
      .pipe(
        delay(0),
        map((res) => res.data)
      );
  }
}
