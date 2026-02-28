import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PagedResult } from '../../shared/models/common.model';

export interface User {
    id: number;
    userName: string;
    email: string;
    nickname?: string;
    phoneNumber?: string;
    nationalId?: string;
    avatarUrl?: string;
    description?: string;
    isActive: boolean;
    status: string;
    lastLogin: string;
    roles?: string[];
}

export interface UserListItem {
    id: number;
    userName: string;
    email: string;
    nickname?: string;
    phoneNumber?: string;
    nationalId?: string;
    avatarUrl?: string;
    description?: string;
    isActive: boolean;
    status: string;
    lastLogin: string;
    roleCount: number;
}

export enum FileState {
    Attached = 0,
    Added = 1,
    Modified = 2,
    Deleted = 3
}

export interface FilePayload {
    filename: string;
    base64: string;
    state: FileState;
}

export interface UpdateUserRequest {
    id: number;
    userName?: string;
    email?: string;
    nickname?: string;
    phoneNumber?: string;
    description?: string;
    avatarUrl?: string;
    imagePayload?: FilePayload;
}

export interface CreateUserRequest {
    userName: string;
    email: string;
    password?: string;
    confirmPassword?: string;
    nickname?: string;
    phoneNumber?: string;
    nationalId?: string;
    description?: string;
    imagePayload?: FilePayload;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Users`;

    getAll(): Observable<ApiResponse<UserListItem[]>> {
        return this.http.get<ApiResponse<UserListItem[]>>(this.apiUrl);
    }

    getById(id: number): Observable<ApiResponse<User>> {
        return this.http.get<ApiResponse<User>>(`${this.apiUrl}/${id}`);
    }

    getPaged(params: any): Observable<ApiResponse<PagedResult<UserListItem>>> {
        return this.http.get<ApiResponse<PagedResult<UserListItem>>>(`${this.apiUrl}/paged`, { params });
    }

    create(data: CreateUserRequest): Observable<ApiResponse<User>> {
        return this.http.post<ApiResponse<User>>(this.apiUrl, data);
    }

    update(id: number, data: UpdateUserRequest): Observable<ApiResponse<User>> {
        return this.http.put<ApiResponse<User>>(`${this.apiUrl}/${id}`, data);
    }

    deactivate(id: number): Observable<ApiResponse<User>> {
        return this.http.put<ApiResponse<User>>(`${this.apiUrl}/${id}/deactivate`, {});
    }

    delete(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
    }
}
