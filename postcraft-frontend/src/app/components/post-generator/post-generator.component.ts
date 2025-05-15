import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { ApiService } from '../../services/api.service';
import { ResultDisplayComponent } from '../result-display/result-display.component';
import {
  GeneratePostRequest,
  PlatformConfig,
  OptionItem,
  GeneratePostResponse,
  OptionsResponse,
  PlatformsResponse,
} from '../../models/post.model';

@Component({
  selector: 'app-post-generator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule,
    ResultDisplayComponent,
  ],
  templateUrl: './post-generator.component.html',
  styleUrls: ['./post-generator.component.css'],
})
export class PostGeneratorComponent implements OnInit {
  generatorForm!: FormGroup;
  platforms: PlatformConfig[] = [];
  vibeOptions: OptionItem[] = [];
  styleOptions: OptionItem[] = [];

  isLoading = false;
  generationResult: GeneratePostResponse | null = null;
  error: string | null = null;

  constructor(private fb: FormBuilder, private apiService: ApiService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadOptions();
    this.loadPlatforms();
  }

  private initForm(): void {
    this.generatorForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(10)]],
      audience: ['', Validators.required],
      vibe: ['friendly', Validators.required],
      style: ['short', Validators.required],
      use_emojis: [true],
      platforms: [['facebook', 'instagram'], Validators.required],
      ab_testing: [true],
      include_scheduling: [true],
    });
  }

  private loadOptions(): void {
    this.apiService.getOptions().subscribe({
      next: (response: OptionsResponse) => {
        this.vibeOptions = response.vibe_options;
        this.styleOptions = response.style_options;
      },
      error: (err: Error) => {
        this.error = 'Nem sikerült betölteni az opciókat';
        console.error('Options loading error:', err);
      },
    });
  }

  private loadPlatforms(): void {
    this.apiService.getPlatforms().subscribe({
      next: (response: PlatformsResponse) => {
        this.platforms = response.platforms;
      },
      error: (err: Error) => {
        this.error = 'Nem sikerült betölteni a platformokat';
        console.error('Platforms loading error:', err);
      },
    });
  }

  togglePlatform(platformId: string): void {
    const platformsControl = this.generatorForm.get('platforms');
    if (!platformsControl) return;

    const currentPlatforms = [...platformsControl.value];

    if (currentPlatforms.includes(platformId)) {
      const index = currentPlatforms.indexOf(platformId);
      currentPlatforms.splice(index, 1);
    } else {
      currentPlatforms.push(platformId);
    }

    platformsControl.setValue(currentPlatforms);
  }

  onSubmit(): void {
    if (this.generatorForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.generationResult = null;

    const request: GeneratePostRequest = this.generatorForm.value;

    this.apiService.generatePosts(request).subscribe({
      next: (response: GeneratePostResponse) => {
        this.generationResult = response;
        this.isLoading = false;
      },
      error: (err: Error) => {
        this.error = 'Hiba történt a generálás során';
        this.isLoading = false;
        console.error('Generation error:', err);
      },
    });
  }

  get formControls() {
    return this.generatorForm.controls;
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
}
