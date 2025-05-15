// src/app/components/profiles/profiles.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css'],
})
export class ProfilesComponent implements OnInit {
  profiles: any[] = [];
  isLoading = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadProfiles();
  }

  loadProfiles() {
    this.isLoading = true;
    this.apiService.getProfiles().subscribe({
      next: (profiles) => {
        this.profiles = profiles;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profiles:', error);
        this.isLoading = false;
      },
    });
  }
}
