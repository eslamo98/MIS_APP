import { Injectable } from '@angular/core';
import { localStorageKeys } from '../../shared/models/common.model';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  setAccessToken(token: string) {
    localStorage.setItem(localStorageKeys.accessToken, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(localStorageKeys.accessToken);
  }

  clear() {
    localStorage.removeItem(localStorageKeys.accessToken);
    localStorage.removeItem(localStorageKeys.user);
  }

  getDecodedToken(token?: string): any {
    const t = token || this.getAccessToken();
    if (!t) return null;

    try {
      const payload = t.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  }

  getRoles(): string[] {
    const decoded = this.getDecodedToken();
    if (!decoded) return [];

    // Check for common role claim names
    const roles = decoded['role'] || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || [];
    return Array.isArray(roles) ? roles : [roles];
  }

  getPermissions(): string[] {
    const decoded = this.getDecodedToken();
    if (!decoded) return [];
    return decoded['permissions'] || [];
  }

  isTokenExpired(token?: string): boolean {
    const decoded = this.getDecodedToken(token);
    if (!decoded) return true;

    const expiry = decoded.exp;
    if (!expiry) return true;

    // Buffer of 5 seconds
    return (Date.now() / 1000) > (expiry - 5);
  }
}
