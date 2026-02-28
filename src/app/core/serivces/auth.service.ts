import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { HttpService } from '../../shared/services/generic-http.service';
import { Observable, tap, of, BehaviorSubject } from 'rxjs';
import { ApiResponse, localStorageKeys } from '../../shared/models/common.model';

export interface AuthenticationResponseDto {
  userId: number;
  username: string;
  email: string;
  nickname: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiration: string;
  refreshTokenExpiration: string;
  roles: string[];
  permissions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(
    private tokenService: TokenService,
    private http: HttpService
  ) {
    const savedUser = localStorage.getItem(localStorageKeys.user);
    if (savedUser) {
      this.userSubject.next(JSON.parse(savedUser));
    }
  }

  login(credentials: any): Observable<ApiResponse<AuthenticationResponseDto>> {
    return this.http.post<ApiResponse<AuthenticationResponseDto>>('Auth/login', credentials).pipe(
      tap(response => {
        if (response.isSuccess) {
          this.handleAuthentication(response.data);
        }
      })
    );
  }

  register(userData: any): Observable<ApiResponse<AuthenticationResponseDto>> {
    return this.http.post<ApiResponse<AuthenticationResponseDto>>('Auth/register', userData).pipe(
      tap(response => {
        if (response.isSuccess) {
          this.handleAuthentication(response.data);
        }
      })
    );
  }

  refreshToken(): Observable<ApiResponse<AuthenticationResponseDto>> {
    // No need to pass refresh token in body; it's in the HttpOnly cookie
    return this.http.post<ApiResponse<AuthenticationResponseDto>>('Auth/refresh-token', {}).pipe(
      tap(response => {
        if (response.isSuccess) {
          this.handleAuthentication(response.data);
        } else {
          this.logout();
        }
      })
    );
  }

  logout(): void {
    // Logout from backend (Backend will clear the cookie)
    this.http.post('Auth/logout', {}).subscribe({
      next: () => {
        this.tokenService.clear();
        this.userSubject.next(null);
      },
      error: () => {
        // Even if request fails, clear local state
        this.tokenService.clear();
        this.userSubject.next(null);
      }
    });
  }

  isLoggedIn(): boolean {
    const token = this.tokenService.getAccessToken();
    return !!token && !this.tokenService.isTokenExpired();
  }

  private handleAuthentication(data: AuthenticationResponseDto) {
    this.tokenService.setAccessToken(data.accessToken);
    // Refresh token is handled by the browser via Set-Cookie header

    const user = {
      userId: data.userId,
      username: data.username,
      email: data.email,
      nickname: data.nickname,
      roles: data.roles,
      permissions: data.permissions
    };

    localStorage.setItem(localStorageKeys.user, JSON.stringify(user));
    this.userSubject.next(user);
  }

  currentUserValue() {
    return this.userSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue();
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  }

  /**
   * Check if user has a specific permission
   * @param permission e.g., 'READ.ORDER' or ActionTypes.Read + '.' + Modules.Orders
   */
  hasPermission(permission: string): boolean {
    const user = this.currentUserValue();
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  }

  /**
   * Check if user has specific action on a module.
   * Special case: if user has 'MANAGE' on the module, they have all permissions.
   */
  checkPermission(action: string, module: string): boolean {
    // 1. Check for Super Access (MANAGE) on the module
    const managePermission = `MANAGE.${module}`;
    if (this.hasPermission(managePermission)) return true;

    // 2. Check for specific requested action
    const permission = `${action}.${module}`;
    return this.hasPermission(permission);
  }
}
