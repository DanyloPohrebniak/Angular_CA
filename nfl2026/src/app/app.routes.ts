import { Routes } from '@angular/router';
import { ManagersComponent } from './components/managers/managers.component';
import { TeamsComponent } from './components/teams/teams.component';
import { RoutesComponent } from './components/routes/routes.component';

export const routes: Routes = [
  { path: '', component: RoutesComponent },
  { path: 'managers', component: ManagersComponent },
  { path: 'teams', component: TeamsComponent },
];

