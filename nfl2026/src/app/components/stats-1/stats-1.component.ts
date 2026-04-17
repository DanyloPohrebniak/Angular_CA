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
    this.dataService.getResults().subscribe(data => {
      this.allResults = data;
      this.applyFilter();
    });
  }

  applyFilter() {
    let matches = this.allResults;
    
    // 1. Спочатку фільтруємо самі матчі за дивізіоном
    if (Number(this.selectedDivision) !== 0) {
      matches = this.allResults.filter(r => Number(r.division) === Number(this.selectedDivision));
    }

    // 2. Рахуємо статистику на основі відфільтрованих матчів
    this.filteredResults = this.calculateStats(matches);
  }

  private calculateStats(matches: any[]): any[] {
    const statsMap: { [key: string]: any } = {};

    matches.forEach(m => {
      // Обробляємо домашню команду (Home Team) та гостьову (Away Team)
      this.processTeamStats(statsMap, m.hteam, m.hgls, m.h2pts, m.h1pts, m.hteamtotal, m.division);
      this.processTeamStats(statsMap, m.ateam, m.agls, m.a2pts, m.a1pts, m.ateamtotal, m.division);
    });

    // Перетворюємо об'єкт у масив та рахуємо середні показники
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

  sortBy(key: string) {
    // Якщо натиснули на ту саму колонку — змінюємо напрямок (опціонально, але зручно)
    // Якщо хочеш СУВОРО лише за спаданням, просто залиш this.reverse = false;
    if (this.sortKey === key) {
      this.reverse = !this.reverse;
    } else {
      this.sortKey = key;
      this.reverse = false; // за замовчуванням при першому натисканні - спадання
    }

    this.filteredResults.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      // Логіка для чисел
      if (this.reverse) {
        return valA > valB ? 1 : -1; // зростання
      } else {
        return valA < valB ? 1 : -1; // спадання
      }
    });
  }
}