import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // data retrieving for all components

  getManagers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/managers`);
  }

  getTeams(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/teams`);
  }

  getRandomTeams(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/teams/random`);
  }

  voteForTeam(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/teams/vote`, { id });
  }

  getResults(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/results`);
  }

  getFixtures(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/fixtures`);
  }

  getPlayers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/players`);
  }

  updateMatch(m: any): Observable<any> {
    // Переконайся, що шлях збігається з Node.js (наприклад, '/results/:id' або '/matches/:id')
    return this.http.put(`${this.apiUrl}/results/${m.id}`, m); 
  }
}
