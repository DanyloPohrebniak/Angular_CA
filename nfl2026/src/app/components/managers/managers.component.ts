import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-managers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './managers.component.html',
  styleUrl: './managers.component.css'
})
export class ManagersComponent implements OnInit {
  managersList: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    // call service method on load
    this.dataService.getManagers().subscribe((data) => {
      this.managersList = data;
    });
  }
}
