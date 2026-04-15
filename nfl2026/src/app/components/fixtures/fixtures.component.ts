import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-fixtures',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fixtures.component.html',
  styleUrl: './fixtures.component.css'
})
export class FixturesComponent implements OnInit {
  allResults: any[] = [];
  // filteredResults: any[] = [];
  groupedResults: any[] = [];
  
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
    this.dataService.getFixtures().subscribe(data => {
      this.allResults = data;
      this.applyFilter();
    });
  }

  applyFilter() {
    // filter by division
    let filtered = this.allResults;
    
    if (Number(this.selectedDivision) !== 0) {
      filtered = this.allResults.filter(r => Number(r.division) === Number(this.selectedDivision));
    }
    
    this.groupData(filtered);
  }

  // group data by round
  groupData(data: any[]) {
    const groups = data.reduce((acc, curr) => {
      const round = curr.round;
      if (!acc[round]) acc[round] = [];
      acc[round].push(curr);
      return acc;
    }, {});

    // transform objects to ngFor components
    this.groupedResults = Object.keys(groups).map(key => ({
      roundName: key,
      matches: groups[key]
    }));
  }
}
