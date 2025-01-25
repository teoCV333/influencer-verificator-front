import { Routes } from '@angular/router';


export const routes: Routes = [
    {
        path: "dashboard",
        loadComponent: () => import('./dashboard/dashboard.component'),
        children: [
            {
                path: "leaderboard",
                title: "Leaderboard",
                loadComponent: () => import('./dashboard/pages/leaderboard/leaderboard.component')
            },
            {
                path: "research",
                title: "Research",
                loadComponent: () => import('./dashboard/pages/research/research.component')
            },
            {
                path: "influencer/:id",
                title: "Influencer View",
                loadComponent: () => import('./dashboard/pages/influencer/influencer.component')
            },
            {
                path: '', redirectTo: 'leaderboard', pathMatch: "full",
            }
        ]
    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    }
    /* { path: 'dashboard', component: DashboardComponent },
    { path: 'search', component: SearchComponent },
    { path: 'profile/:id', component: ProfileComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' } */
];
