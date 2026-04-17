import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-stats-2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-2.component.html',
  styleUrl: './stats-2.component.css'
})
export class Stats2Component implements OnInit {
  divisionStats: any[] = [];
  teamStats: any[] = [];
  teams: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getTeams().subscribe(teams => {
      this.teams = teams;
      
      this.dataService.getResults().subscribe(data => {
        this.processDivisionStats(data);
        this.processTeamStats(data);
      });
    });
  }

  getTeamRgb(teamName: string): string {
    const team = this.teams.find(t => t.name === teamName);
    return team ? team.rgb : '200,200,200';
  }

  // table 1
  processDivisionStats(matches: any[]) {
    const divMap: any = {};

    matches.forEach(m => {
      const div = m.division;
      const rnd = m.round;
      const matchTotal = m.hteamtotal + m.ateamtotal;

      if (!divMap[div]) divMap[div] = {};
      if (!divMap[div][rnd]) divMap[div][rnd] = { sum: 0, count: 0 };

      divMap[div][rnd].sum += matchTotal;
      divMap[div][rnd].count += 1;
    });

    this.divisionStats = [1, 2, 3, 4].map(d => ({
      division: d,
      r1: this.getAverage(divMap, d, 1),
      r2: this.getAverage(divMap, d, 2),
      r3: this.getAverage(divMap, d, 3),
      r4: this.getAverage(divMap, d, 4),
      r5: this.getAverage(divMap, d, 5)
    }));
  }

  private getAverage(map: any, div: number, rnd: number): string {
    const data = map[div] && map[div][rnd];
    return data ? (data.sum / data.count).toFixed(1) : '-';
  }

  // table 2
  processTeamStats(matches: any[]) {
    const teamMap: any = {};

    matches.forEach(m => {
      this.addTeamRoundScore(teamMap, m.hteam, m.round, m.hteamtotal);
      this.addTeamRoundScore(teamMap, m.ateam, m.round, m.ateamtotal);
    });

    // transform to array and sort by alphabet
    this.teamStats = Object.keys(teamMap)
      .sort((a, b) => a.localeCompare(b))
      .map(name => ({
        team: name,
        r1: teamMap[name][1] || 0,
        r2: teamMap[name][2] || 0,
        r3: teamMap[name][3] || 0,
        r4: teamMap[name][4] || 0,
        r5: teamMap[name][5] || 0
      }));
  }

  private addTeamRoundScore(map: any, team: string, rnd: number, score: number) {
    if (!map[team]) map[team] = {};
    map[team][rnd] = score;
  }
}