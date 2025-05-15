import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../services/api.service';
import { GeneratePostRequest, PlatformConfig } from '../../models/post.model';

interface ChatMessage {
  type: 'user' | 'bot' | 'results';
  content: string;
  timestamp: Date;
  results?: any[];
}

@Component({
  selector: 'app-chat-interface',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
  ],
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.css'],
})
export class ChatInterfaceComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatMessages', { static: false }) chatMessagesRef!: ElementRef;

  userMessage = '';
  messages: ChatMessage[] = [];
  isLoading = false;
  platforms: PlatformConfig[] = [];
  selectedPlatforms: string[] = ['facebook', 'instagram', 'linkedin', 'x'];

  // Show modal state
  showMoreSuggestions = false;
  showPlatformPreview = false;
  selectedPlatformResult: any = null;

  // Track if we have results to show/hide suggestions
  hasResults = false;

  // Quick suggestions - first 5 for display
  quickSuggestions = [
    'Új termékünk most 20% kedvezménnyel kapható!',
    'Black Friday mega akció - 50% kedvezmény',
    'Bemutatjuk csapatunk új tagját!',
    'Nyertes ügyfeleink sikertörténetei',
    'Ingyenes webinárium jövő héten!',
  ];

  // All suggestions for the modal
  allSuggestions = [
    // Product Launches & Sales
    'Új termékünk most 20% kedvezménnyel kapható!',
    'Black Friday mega akció - 50% kedvezmény minden termékre',
    'Limitált idejű ajánlat - csak a következő 24 órában',
    'Exkluzív előrendelési lehetőség új kollekciónkhoz',
    'Karácsonyi különlegesség - személyre szabott ajándékok',

    // Events & Webinars
    'Ingyenes webinárium: "Digital Marketing 2025" - Regisztrálj most!',
    'Csatlakozz élő Q&A sessziónkhoz pénteken 15:00-kor',
    'Workshop: "AI in Business" - Március 15, Budapest',
    'Networking event startup alapítóknak - jelentkezz most',
    'Húsvéti akció - tavaszba lendülünk együtt',

    // Team & Company News
    'Bemutatjuk csapatunk új tagját - Kovács Anna, Marketing Manager',
    'Büszkén jelentjük: elnyertük az "Év Startupja" díjat',
    'Új irodánk Szegeden - növekvő csapatunkkal szolgálunk',
    'CEO interjú a Forbes-ban - olvass itt részleteket',
    'Fenntarthatóság a fókuszban - zöld megoldásaink',

    // Customer Success & Testimonials
    'Nyertes ügyfeleink sikertörténetei: 300% növekedés 6 hónap alatt',
    'Mit mondanak rólunk? - Friss vélemények és értékelések',
    'Esettanulmány: Hogyan segítettünk egy KKV-nak 10x-ére növelni bevételeit',
    'Ügyfeleink által leggyakrabban feltett kérdések',

    // Educational & Tips
    'Top 5 tipp a sikeres social media marketinghez',
    '2025 marketing trendek, amiket tudnod kell',
    'Lépésről lépésre guide: Email marketing automatizálás',
    'Gyakori hibák online vállalkozásokban - kerüld el őket',

    // Community & Engagement
    'Nyertes fotóverseny - küldd be a legjobb képedet',
    'Közös jótékonysági akció - segíts velünk segíteni',
    'Hónapunk embere - szavazz a kedvenc csapattagodra',
    'Újévi fogadalmak a business világban - tippjeink',

    // Behind the Scenes
    'Betekintés a kulisszák mögé - hogyan dolgozunk',
    'Irodai élet 2025-ben - home office vs. jelenléti munka',
    'Technológiai újítások, amikkel dolgozunk',
    'Nyári kampány - vakáció alatt is dolgozunk érted',
  ];

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadPlatforms();
    this.addBotMessage(
      'Szia! 👋 Írj be egy marketing üzenetet és én létrehozom a social media posztjaidat minden platformra!'
    );
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      if (this.chatMessagesRef) {
        this.chatMessagesRef.nativeElement.scrollTop =
          this.chatMessagesRef.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.log('Error scrolling to bottom:', err);
    }
  }

  loadPlatforms() {
    this.apiService.getPlatforms().subscribe({
      next: (response) => {
        this.platforms = response.platforms;
      },
      error: (err) => {
        console.error('Platforms loading error:', err);
        this.addBotMessage('⚠️ Nem sikerült betölteni a platformokat.');
      },
    });
  }

  addBotMessage(content: string) {
    this.messages.push({
      type: 'bot',
      content,
      timestamp: new Date(),
    });
  }

  togglePlatform(platformId: string) {
    const index = this.selectedPlatforms.indexOf(platformId);
    if (index > -1) {
      this.selectedPlatforms.splice(index, 1);
    } else {
      this.selectedPlatforms.push(platformId);
    }
  }

  useSuggestion(suggestion: string) {
    this.userMessage = suggestion;
    this.showMoreSuggestions = false; // Close modal if open
    this.sendMessage();
  }

  openMoreSuggestions() {
    this.showMoreSuggestions = true;
  }

  closeMoreSuggestions() {
    this.showMoreSuggestions = false;
  }

  // Platform Preview Modal Methods
  openPlatformPreview(result: any) {
    this.selectedPlatformResult = result;
    this.showPlatformPreview = true;
  }

  closePlatformPreview() {
    this.showPlatformPreview = false;
    this.selectedPlatformResult = null;
  }

  // Get random stock photo
  getStockPhoto(platform: string): string {
    const photos = [
      'https://picsum.photos/600/400?random=1',
      'https://picsum.photos/600/400?random=2',
      'https://picsum.photos/600/400?random=3',
      'https://picsum.photos/600/400?random=4',
      'https://picsum.photos/600/400?random=5',
    ];
    const index = Math.floor(Math.random() * photos.length);
    return photos[index];
  }

  // Get platform-specific user mock data
  getPlatformUser(platform: string) {
    const users = {
      facebook: {
        name: 'Kovács Anna',
        avatar: 'https://i.pravatar.cc/150?img=1',
        handle: '',
        time: '2 óra',
      },
      instagram: {
        name: 'anna_kovacs',
        avatar: 'https://i.pravatar.cc/150?img=5',
        handle: '@anna_kovacs',
        time: '2h',
      },
      linkedin: {
        name: 'Kovács Anna',
        avatar: 'https://i.pravatar.cc/150?img=3',
        handle: 'Marketing Manager at TechCorp',
        time: '2 óra',
      },
      x: {
        name: 'Anna Kovács',
        avatar: 'https://i.pravatar.cc/150?img=7',
        handle: '@anna_kovacs',
        time: '2h',
      },
    };
    return users[platform as keyof typeof users] || users.facebook;
  }

  // Check if we should show suggestions
  shouldShowSuggestions(): boolean {
    // Show if not loading - ALWAYS show after first message
    return !this.isLoading && this.messages.length >= 1;
  }

  async sendMessage() {
    if (!this.userMessage.trim() || this.isLoading) return;

    if (this.selectedPlatforms.length === 0) {
      this.snackBar.open('Válassz ki legalább egy platformot!', 'Bezár', {
        duration: 3000,
      });
      return;
    }

    // Add user message
    this.messages.push({
      type: 'user',
      content: this.userMessage,
      timestamp: new Date(),
    });

    const message = this.userMessage;
    this.userMessage = '';
    this.isLoading = true;

    try {
      // Create individual requests for each platform
      const platformRequests: any[] = [];

      for (const platform of this.selectedPlatforms) {
        const request: GeneratePostRequest = {
          message,
          audience: '25-40 éves social media felhasználók',
          vibe: 'friendly',
          style: 'medium',
          use_emojis: true,
          platforms: [platform],
          ab_testing: true, // Enable A/B testing for multiple versions
          include_scheduling: true, // Enable scheduling suggestions
        };

        platformRequests.push(
          this.apiService.generatePosts(request).pipe(
            map((response: any) => {
              console.log('API Response for', platform, ':', response);

              // Helyes adatstruktúra kezelés
              const platformData = response.posts?.[platform];
              const firstVersion = platformData?.versions?.[0];

              return {
                platform: platform,
                content: firstVersion?.text || 'Hiba a generálás során',
                hashtags: firstVersion?.hashtags || [],
                tips: platformData?.tips || {},
                all_versions: platformData?.versions || [],
                selectedVersionIndex: 0, // Track which version is displayed
              };
            })
          )
        );
      }

      // Execute all requests in parallel
      const results = await forkJoin(platformRequests).toPromise();

      // Remove loading message
      this.messages.pop();

      // Add results message
      this.messages.push({
        type: 'results',
        content: 'Kész! 🎉 Itt vannak a generált posztjaid:',
        timestamp: new Date(),
        results: results,
      });

      // Mark that we have results
      this.hasResults = true;
    } catch (error: unknown) {
      // Remove loading message
      this.messages.pop();

      // Részletesebb hibaüzenet
      console.error('Generation error details:', error);

      let errorMessage = '⚠️ Hiba történt a generálás során. ';

      if (error && typeof error === 'object') {
        const err = error as any;

        if (err.error) {
          console.error('Error response:', err.error);
          if (err.error.detail) {
            errorMessage += `Részletek: ${err.error.detail}`;
          }
        }

        if (err.status) {
          console.error('Error status:', err.status);
        }

        if (err.message && !err.error?.detail) {
          errorMessage += `${err.message}`;
        }
      } else {
        errorMessage += 'Kérjük próbálja újra később.';
      }

      this.addBotMessage(errorMessage);
    } finally {
      this.isLoading = false;
    }
  }

  onEnterPressed(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  getPlatformName(platformId: string): string {
    const platform = this.platforms.find((p) => p.id === platformId);
    return platform ? platform.name : platformId;
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

  copyToClipboard(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        this.snackBar.open('Vágólapra másolva! 📋', 'Bezár', {
          duration: 2000,
        });
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
        this.snackBar.open('Hiba a másolás során', 'Bezár', {
          duration: 2000,
        });
      });
  }

  // Select different version for a platform result
  selectVersion(result: any, versionIndex: number) {
    if (result.all_versions && result.all_versions[versionIndex]) {
      result.selectedVersionIndex = versionIndex;
      const selectedVersion = result.all_versions[versionIndex];
      result.content = selectedVersion.text;
      result.hashtags = selectedVersion.hashtags || [];
    }
  }

  // Get the display content based on selected version
  getDisplayContent(result: any): string {
    const selectedIndex = result.selectedVersionIndex || 0;
    if (result.all_versions && result.all_versions[selectedIndex]) {
      return result.all_versions[selectedIndex].text;
    }
    return result.content;
  }

  // Get hashtags for selected version
  getDisplayHashtags(result: any): string[] {
    const selectedIndex = result.selectedVersionIndex || 0;
    if (result.all_versions && result.all_versions[selectedIndex]) {
      return result.all_versions[selectedIndex].hashtags || [];
    }
    return result.hashtags || [];
  }

  // Reset the chat for a new conversation
  startNewConversation() {
    this.messages = [];
    this.hasResults = false;
    this.addBotMessage(
      'Szia! 👋 Írj be egy marketing üzenetet és én létrehozom a social media posztjaidat minden platformra!'
    );
  }
}
