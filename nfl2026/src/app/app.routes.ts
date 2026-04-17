import { Routes } from '@angular/router';
import { ManagersComponent } from './components/managers/managers.component';
import { TeamsComponent } from './components/teams/teams.component';
import { RoutesComponent } from './components/routes/routes.component';
import { ResultsComponent } from './components/results/results.component';
import { FixturesComponent } from './components/fixtures/fixtures.component';
import { Stats1Component } from './components/stats-1/stats-1.component';
import { Stats2Component } from './components/stats-2/stats-2.component';
import { TeamRankingComponent } from './components/team-ranking/team-ranking.component';
import { ChartComponent } from './components/chart/chart.component';

export const routes: Routes = [
  { path: '', component: RoutesComponent },
  { path: 'managers', component: ManagersComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'fixtures', component: FixturesComponent },
  { path: 'team-ranking', component: TeamRankingComponent },
  { path: 'scoring-stats-1', component: Stats1Component },
  { path: 'scoring-stats-2', component: Stats2Component },
  { path: 'scoring-chart', component: ChartComponent },
];

