// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { PostGeneratorComponent } from './components/post-generator/post-generator.component';
import { ChatInterfaceComponent } from './components/chat-interface/chat-interface.component';
import { ProfilesComponent } from './components/profiles/profiles.component';
import { HistoryComponent } from './components/history/history.component';

export const routes: Routes = [
  { path: '', component: ChatInterfaceComponent }, // Főoldal = Chat
  { path: 'generator', component: PostGeneratorComponent }, // Form
  { path: 'chat', component: ChatInterfaceComponent }, // Chat külön URL-en is
  { path: 'profiles', component: ProfilesComponent }, // Profilok komponens
  { path: 'history', component: HistoryComponent }, // Előzmények komponens
  { path: '**', redirectTo: '' },
];
