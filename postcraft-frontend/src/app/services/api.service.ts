// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  GeneratePostRequest,
  GeneratePostResponse,
  PlatformsResponse,
  OptionsResponse,
  Profile,
} from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:8000/api/v1';

  constructor(private http: HttpClient) {}

  generatePosts(
    request: GeneratePostRequest
  ): Observable<GeneratePostResponse> {
    return this.http.post<GeneratePostResponse>(
      `${this.baseUrl}/generate`,
      request
    );
  }

  getPlatforms(): Observable<PlatformsResponse> {
    return this.http.get<PlatformsResponse>(`${this.baseUrl}/platforms`);
  }

  getOptions(): Observable<OptionsResponse> {
    return this.http.get<OptionsResponse>(`${this.baseUrl}/options`);
  }

  getProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.baseUrl}/profiles`);
  }

  getProfile(id: number): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseUrl}/profiles/${id}`);
  }

  createProfile(profile: Partial<Profile>): Observable<any> {
    return this.http.post(`${this.baseUrl}/profiles`, profile);
  }

  updateProfile(id: number, profile: Partial<Profile>): Observable<any> {
    return this.http.put(`${this.baseUrl}/profiles/${id}`, profile);
  }

  deleteProfile(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/profiles/${id}`);
  }

  getHistory(limit: number = 10): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/history?limit=${limit}`);
  }

  getHistoryItem(requestId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/history/${requestId}`);
  }
}
