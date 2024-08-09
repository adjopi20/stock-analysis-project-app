import { Routes } from '@angular/router';
import { DashboardCanvasComponent } from './core/layout/dashboard-canvas/dashboard-canvas.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/homepage/homepage.component').then(
        (m) => m.HomepageComponent
      ),
  },
  {
    path: 'histogram-analysis',
    loadComponent: () =>
      import(
        './features/components/histogram-analysis/histogram-analysis.component'
      ).then((m) => m.HistogramAnalysisComponent),
  },
  {
    path: 'financials',
    loadComponent: () =>
      import('./features/components/financials/financials.component').then(
        (m) => m.FinancialsComponent
      ),
  },
  {
    path: 'news',
    loadComponent: () =>
      import('./features/components/news/news.component').then(
        (m) => m.NewsComponent
      ),
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./features/components/overview/overview.component').then(
        (m) => m.OverviewComponent
      ),
  },

  // {
  //   path: '',
  //   loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  // },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./core/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'auth/signin',
    loadComponent: () =>
      import('./core/auth/signin/signin.component').then(
        (m) => m.SigninComponent
      ),
  },
];
