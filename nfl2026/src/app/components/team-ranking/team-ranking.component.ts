import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team-ranking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-ranking.component.html',
  styleUrl: './team-ranking.component.css'
})
export class TeamRankingComponent implements OnInit {
  pair: any[] = [];
  votesRemaining: number = 5; 

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.loadNewPair();
  }

  loadNewPair() {
    this.dataService.getRandomTeams().subscribe(data => {
      this.pair = data;
    });
  }

  handleVote(teamId: number) {
    if (this.votesRemaining > 0) {
      this.dataService.voteForTeam(teamId).subscribe(() => {
        this.votesRemaining--;
        
        if (this.votesRemaining === 0) {
          // redirect to /teams in the end
          this.router.navigate(['/teams']);
        } else {
          // next pair
          this.loadNewPair();
        }
      });
    }
  }
}
