import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../serivces/token.service';
import { AuthService, AuthenticationResponseDto } from '../serivces/auth.service';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ApiResponse, pageRoutes } from '../../shared/models/common.model';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const router = inject(Router);

  // Skip auth header for logic that doesn't need it
  if (req.url.includes('Auth/login') || req.url.includes('Auth/register')) {
    return next(req);
  }

  // Handle refresh-token differently if it's the actual refresh call
  if (req.url.includes('Auth/refresh-token')) {
    return next(req);
  }

  const token = tokenService.getAccessToken();

  let authReq = req;
  if (token) {
    authReq = addTokenHeader(req, token);
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse): Observable<HttpEvent<any>> => {
      // 401 Unauthorized - likely token expired
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(req, next, authService, tokenService, router);
      }
      return throwError(() => error);
    })
  );
};

function addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    },
    withCredentials: true
  });
}

function handle401Error(request: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService, tokenService: TokenService, router: Router): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response: ApiResponse<AuthenticationResponseDto>) => {
        isRefreshing = false;

        if (response.isSuccess) {
          const newToken = response.data.accessToken;
          refreshTokenSubject.next(newToken);
          return next(addTokenHeader(request, newToken));
        } else {
          // Refresh failed, logout
          authService.logout();
          router.navigate([`/${pageRoutes.auth.login}`]);
          return throwError(() => new Error('Session expired'));
        }
      }),
      catchError((err) => {
        isRefreshing = false;
        authService.logout();
        router.navigate([`/${pageRoutes.auth.login}`]);
        return throwError(() => err);
      })
    );
  } else {
    // Current request is waiting for a refresh to complete
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next(addTokenHeader(request, token!)))
    );
  }
}
