import { Routes } from '@angular/router';
import { ManagersComponent } from './components/managers/managers.component';

export const routes: Routes = [
  { path: 'managers', component: ManagersComponent },
  { path: '', redirectTo: '/managers', pathMatch: 'full' }
];

