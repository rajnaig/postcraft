import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PlatformPreviewComponent } from '../platform-preview/platform-preview.component';
import { GeneratePostResponse } from '../../models/post.model';

@Component({
  selector: 'app-result-display',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
    MatDividerModule,
    MatTooltipModule,
    PlatformPreviewComponent,
  ],
  templateUrl: './result-display.component.html',
  styleUrls: ['./result-display.component.css'],
})
export class ResultDisplayComponent implements OnChanges {
  @Input() result!: GeneratePostResponse;

  selectedPlatform: string = '';
  selectedVersionIndex: number = 0;
  availablePlatforms: string[] = [];

  constructor(private snackBar: MatSnackBar) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['result'] && this.result) {
      this.availablePlatforms = Object.keys(this.result.posts);
      if (this.availablePlatforms.length > 0) {
        this.selectedPlatform = this.availablePlatforms[0];
      }
    }
  }

  copyToClipboard(text: string): void {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        this.snackBar.open('Szöveg másolva a vágólapra!', 'Bezárás', {
          duration: 3000,
        });
      })
      .catch((err) => {
        console.error('Másolási hiba:', err);
        this.snackBar.open('Nem sikerült másolni a szöveget', 'Bezárás', {
          duration: 3000,
        });
      });
  }

  changeVersion(index: number): void {
    if (this.result.posts[this.selectedPlatform].versions.length > index) {
      this.selectedVersionIndex = index;
    }
  }

  getPlatformName(platformId: string): string {
    const platformNames: { [key: string]: string } = {
      facebook: 'Facebook',
      instagram: 'Instagram',
      linkedin: 'LinkedIn',
      x: 'X (Twitter)',
    };

    return platformNames[platformId] || platformId;
  }

  getPlatformIcon(platformId: string): string {
    const platformIcons: { [key: string]: string } = {
      facebook: 'facebook',
      instagram: 'photo_camera',
      linkedin: 'business',
      x: 'chat',
    };

    return platformIcons[platformId] || 'public';
  }

  getCharacterLimitClass(platformId: string, characterCount: number): string {
    const limits: { [key: string]: number } = {
      facebook: 2000,
      instagram: 2200,
      linkedin: 1300,
      x: 280,
    };

    const limit = limits[platformId] || 1000;
    const percentage = (characterCount / limit) * 100;

    if (percentage >= 90) {
      return 'char-limit-danger';
    } else if (percentage >= 70) {
      return 'char-limit-warning';
    }

    return 'char-limit-normal';
  }
}
