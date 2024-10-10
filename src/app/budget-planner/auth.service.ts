// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  // Function to get the token
  getToken(): string | null {
    return localStorage.getItem('token'); // Or however you store the token
  }

  // Function to check if the user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null; // You may also want to check for token expiration
  }
}
