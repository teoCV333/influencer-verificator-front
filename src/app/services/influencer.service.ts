import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Influencer } from '../model/interface/influencer';
import { APIResponse } from '../model/interface/APIResponse';


@Injectable({
  providedIn: 'root'
})
export class InfluencerService {

  constructor(private http: HttpClient) { }


  getAllInfluencers(): Observable<APIResponse> {
    return this.http.get<APIResponse>("http://localhost:3000/api/influencer");
  }

  getInfluencerByName(): Observable<APIResponse> {
    return this.http.get<APIResponse>("http://localhost:3000/api/influencer");
  }

}
