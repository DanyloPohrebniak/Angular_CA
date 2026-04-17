import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-5" style="max-width: 400px;">
      <div class="card shadow-lg p-4">
        <h3 class="text-center mb-4">Admin Login</h3>
        <div class="mb-3">
          <label class="form-label">Email address</label>
          <input [(ngModel)]="username" type="text" class="form-control" placeholder="thomas.devine@atu.ie">
        </div>
        <div class="mb-3">
          <label class="form-label">Password</label>
          <input [(ngModel)]="password" type="password" class="form-control" placeholder="password">
        </div>
        <button (click)="onLogin()" class="btn btn-primary w-100">Login</button>
        <div *ngIf="error" class="alert alert-danger mt-3 text-center p-2">
          Access Denied!
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  username = ''; password = ''; error = false;
  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    if (this.auth.login(this.username, this.password)) {
      this.router.navigate(['/admin']);
    } else {
      this.error = true;
    }
  }
}