// src/app/components/history/history.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
  historyItems: any[] = [];
  isLoading = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.isLoading = true;
    this.apiService.getHistory(20).subscribe({
      next: (history) => {
        this.historyItems = history;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading history:', error);
        this.isLoading = false;
      },
    });
  }

  getPlatformIcon(platform: string): string {
    const icons: { [key: string]: string } = {
      facebook: 'facebook',
      instagram: 'photo_camera',
      linkedin: 'business',
      x: 'chat',
      twitter: 'chat',
    };
    return icons[platform] || 'public';
  }

  viewDetails(item: any) {
    console.log('View details:', item);
    // Implement details view
  }

  useAgain(item: any) {
    console.log('Use again:', item);
    // Implement reuse functionality
  }

  deleteItem(item: any) {
    console.log('Delete item:', item);
    // Implement delete functionality
  }
}
