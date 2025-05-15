import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-platform-preview',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatButtonModule],
  templateUrl: './platform-preview.component.html',
  styleUrls: ['./platform-preview.component.css'],
})
export class PlatformPreviewComponent {
  @Input() platform: string = '';
  @Input() postContent: string = '';
  @Input() hashtags: string[] = [];
  @Input() imageSuggestions: string[] = [];

  // Mock platform felhasználói adatok
  profilePicture: string = 'assets/profile-placeholder.jpg';
  userName: string = 'YourBrandName';
  profileName: string = 'Your Brand';

  // Az aktuális idő
  currentTime: Date = new Date();

  constructor() {
    // Frissítsük az időt 60 másodpercenként
    setInterval(() => {
      this.currentTime = new Date();
    }, 60000);
  }
}
