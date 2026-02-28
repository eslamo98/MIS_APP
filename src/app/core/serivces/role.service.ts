import { Injectable, inject } from '@angular/core';
import { HttpService } from '../../shared/services/generic-http.service';
import { Observable, delay, map, of } from 'rxjs';

export interface Role {
    id: number;
    name: string;
    permissionCount: number;
    userCount: number;
}

import { ApiResponse, Permissions } from '../../shared/models/common.model';

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    private http = inject(HttpService);

    getAll(): Observable<Role[]> {
        return this.http.get<ApiResponse<Role[]>>('roles', null, Permissions.RolesModule.Read).pipe(
            map(res => res?.data ?? [])
        );
    }

    getPaged(params: any): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>('roles/paged', params, Permissions.RolesModule.Read);
    }

    getById(id: number): Observable<Role> {
        return this.http.get<ApiResponse<Role>>(`roles/${id}`).pipe(
            map(res => res.data)
        );
    }

    create(role: any): Observable<ApiResponse<Role>> {
        return this.http.post<ApiResponse<Role>>('roles', role);
    }

    update(id: number, role: any): Observable<ApiResponse<Role>> {
        return this.http.put<ApiResponse<Role>>(`roles/${id}`, role);
    }

    delete(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`roles/${id}`);
    }

    /**
     * Async Validator helper: check if role name exists
     */
    checkNameExists(name: string): Observable<boolean> {
        // Simulating API call for async validation
        // return this.http.get<boolean>(`roles/check-name?name=${name}`);
        return of(name.toLowerCase() === 'admin').pipe(delay(500));
    }
}
