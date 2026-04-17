import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-stats-1',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stats-1.component.html',
  styleUrl: './stats-1.component.css'
})
export class Stats1Component implements OnInit {
  allResults: any[] = [];
  filteredResults: any[] = []; 
  teams: any[] = []; 
  sortKey: string = 'total';
  reverse: boolean = false;

  divisions = [
    { value: 0, label: 'All Divisions' },
    { value: 1, label: 'Division 1' },
    { value: 2, label: 'Division 2' },
    { value: 3, label: 'Division 3' },
    { value: 4, label: 'Division 4' }
  ];
  selectedDivision: number = 0;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getTeams().subscribe(teams => {
      this.teams = teams;
      
      this.dataService.getResults().subscribe(data => {
        this.allResults = data;
        this.applyFilter();
      });
    });
  }

  getTeamRgb(teamName: string): string {
    const team = this.teams.find(t => t.name === teamName);
    return team ? team.rgb : '200,200,200';
  }

  applyFilter() {
    let matches = this.allResults;
    
    if (Number(this.selectedDivision) !== 0) {
      matches = this.allResults.filter(r => Number(r.division) === Number(this.selectedDivision));
    }

    this.filteredResults = this.calculateStats(matches);
  }

  private calculateStats(matches: any[]): any[] {
    const statsMap: { [key: string]: any } = {};

    matches.forEach(m => {
      this.processTeamStats(statsMap, m.hteam, m.hgls, m.h2pts, m.h1pts, m.hteamtotal, m.division);
      this.processTeamStats(statsMap, m.ateam, m.agls, m.a2pts, m.a1pts, m.ateamtotal, m.division);
    });


    return Object.values(statsMap).map((team: any) => ({
      ...team,
      total: (team.totalPoints / team.matches),
      goals: (team.goals / team.matches),
      pts2: (team.pts2 / team.matches),
      pts1: (team.pts1 / team.matches)
    }));
  }

  private processTeamStats(map: any, teamName: string, gls: number, p2: number, p1: number, total: number, div: number) {
    if (!map[teamName]) {
      map[teamName] = { 
        name: teamName, 
        division: div, 
        matches: 0, 
        totalPoints: 0, 
        goals: 0, 
        pts2: 0, 
        pts1: 0 
      };
    }

    map[teamName].matches += 1;
    map[teamName].totalPoints += (total || 0);
    map[teamName].goals += (gls || 0);
    map[teamName].pts2 += (p2 || 0);
    map[teamName].pts1 += (p1 || 0);
  }


  // table sorting
  sortBy(key: string) {
    if (this.sortKey === key) {
      this.reverse = !this.reverse;
    } else {
      this.sortKey = key;
      this.reverse = false; 
    }

    this.filteredResults.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      if (this.reverse) {
        return valA > valB ? 1 : -1; 
      } else {
        return valA < valB ? 1 : -1; 
      }
    });
  }
}