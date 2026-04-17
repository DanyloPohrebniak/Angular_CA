// src/app/components/admin/admin.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  matches: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getResults().subscribe(data => this.matches = data);
  }

  saveChange(m: any) {
    const hgls = Number(m.hgls || 0);
    const h2pts = Number(m.h2pts || 0);
    const h1pts = Number(m.h1pts || 0);
    const agls = Number(m.agls || 0);
    const a2pts = Number(m.a2pts || 0);
    const a1pts = Number(m.a1pts || 0);

    m.hteamtotal = (hgls * 3) + (h2pts * 2) + h1pts;
    m.ateamtotal = (agls * 3) + (a2pts * 2) + a1pts;

    this.dataService.updateMatch(m).subscribe({
      next: (response) => {
        console.log('Success:', response);
        alert(`Match ${m.hteam} vs ${m.ateam} updated!`);
      },
      error: (err) => {
        console.error('Update failed:', err);
        alert('Error updating data. Check console.');
      }
    });
  }
}