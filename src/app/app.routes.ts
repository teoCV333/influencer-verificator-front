import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SearchComponent } from './pages/search/search.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'search', component: SearchComponent },
    { path: 'profile/:id', component: ProfileComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];
