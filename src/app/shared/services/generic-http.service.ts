import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(permission?: string): HttpHeaders {
    let headers = new HttpHeaders();
    if (permission) {
      headers = headers.set('X-Permission', permission);
    }
    return headers;
  }

  // GET
  get<T>(url: string, params?: any, permission?: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${url}`, {
      params: this.buildParams(params),
      headers: this.getHeaders(permission),
      withCredentials: true
    });
  }

  // POST
  post<T>(url: string, body: any, permission?: string): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${url}`, body, {
      headers: this.getHeaders(permission),
      withCredentials: true
    });
  }

  // PUT
  put<T>(url: string, body: any, permission?: string): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${url}`, body, {
      headers: this.getHeaders(permission),
      withCredentials: true
    });
  }

  // DELETE
  delete<T>(url: string, permission?: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${url}`, {
      headers: this.getHeaders(permission),
      withCredentials: true
    });
  }

  // PATCH
  patch<T>(url: string, body: any, permission?: string): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${url}`, body, {
      headers: this.getHeaders(permission),
      withCredentials: true
    });
  }

  // Helper for query params
  private buildParams(paramsObj: any): HttpParams {
    let params = new HttpParams();

    if (!paramsObj) return params;

    Object.keys(paramsObj).forEach(key => {
      if (paramsObj[key] !== null && paramsObj[key] !== undefined) {
        params = params.set(key, paramsObj[key]);
      }
    });

    return params;
  }
}
