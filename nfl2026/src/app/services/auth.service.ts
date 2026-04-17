import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  login(user: string, pass: string): boolean {
    if (user === 'thomas.devine@atu.ie' && pass === 'password') {
      this.loggedIn.next(true);
      return true;
    }
    return false;
  }

  logout() {
    this.loggedIn.next(false);
  }
}