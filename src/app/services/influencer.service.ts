import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { APIResponse } from '../model/interface/APIResponse';
import { Influencer } from '../model/interface/Influencer';


@Injectable({
  providedIn: 'root'
})
export class InfluencerService {

  constructor(private http: HttpClient) { }

  getAllInfluencers(): Observable<APIResponse> {
    return this.http.get<APIResponse>("http://localhost:3000/api/influencer");
  }

  getInfluencerByName(params: any): Observable<APIResponse> {
    const { name, filter, claims, token } = params;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}` // Assuming token is a Bearer token
    });
      const result = this.http.get<APIResponse>(`http://localhost:3000/api/influencer/${name}`, {
        headers,
        params: {
          filter: filter,
          claimsNumber: claims.toString()
        }
      });      
      return result;
  }

  searchNewClaims(): Observable<APIResponse> {
    return this.http.get<APIResponse>("http://localhost:3000/api/influencer");
  }

}
