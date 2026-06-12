import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { PodsComponent } from './components/pods/pods';
import { ServicesComponent } from './components/services/services';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'pods', component: PodsComponent },
  { path: 'services', component: ServicesComponent },
];