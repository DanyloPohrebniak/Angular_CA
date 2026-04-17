import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './routes.component.html'
})
export class RoutesComponent {
  previewData: any = null; // data for display

  // array of all routes
  navigationRoutes = [
    { name: '/managers', path: '/managers', apiUrl: 'http://localhost:3000/managers', description: "GET managers" },
    { name: '/teams', path:'/teams', apiUrl: 'http://localhost:3000/teams', description: "GET teams" },
    { name: '/players', path:'/players', apiUrl: 'http://localhost:3000/players', description: "GET players" },
    { name: '/results', path: '/results', apiUrl: 'http://localhost:3000/results', description: "GET results" },
    { name: '/fixtures', path:'/fixtures', apiUrl: 'http://localhost:3000/fixtures', description: "GET fixtures" }
  ];

  constructor(private dataService: DataService) {}

  // GET JSON method
  fetchDataPreview(name: string) {
    // call method with service name
    const method = name.toLowerCase();
    
    if (method === '/managers') {
      this.dataService.getManagers().subscribe(data => this.previewData = data);
    } else if (method === '/teams') {
      this.dataService.getTeams().subscribe(data => this.previewData = data);
    } else if (method === '/results') {
      this.dataService.getResults().subscribe(data => this.previewData = data);
    } else if (method === '/fixtures') {
      this.dataService.getFixtures().subscribe(data => this.previewData = data);
    } else if (method === '/players') {
      this.dataService.getPlayers().subscribe(data => this.previewData = data);
    } 
  }
}