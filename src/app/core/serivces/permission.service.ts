import { Injectable, inject } from '@angular/core';
import { HttpService } from '../../shared/services/generic-http.service';
import { Observable } from 'rxjs';
import { ApiResponse, Permissions } from '../../shared/models/common.model';

export interface PermissionListItem {
    id: number;
    name: string;
    code: string;
    module: string;
    moduleId: number;
    moduleName: string;
    actionTypeId: number;
    roleCount: number;
    userCount: number;
}

export interface PermissionResponse {
    id: number;
    name: string;
    code: string;
    module: string;
    roleCount: number;
    userCount: number;
}

@Injectable({
    providedIn: 'root'
})
export class PermissionService {
    private http = inject(HttpService);

    getAll(module?: string): Observable<ApiResponse<PermissionListItem[]>> {
        const params = module ? { module } : {};
        return this.http.get<ApiResponse<PermissionListItem[]>>('Permissions', params, Permissions.RolesModule.Read);
    }

    getPaged(params: any): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>('Permissions/paged', params, Permissions.RolesModule.Read);
    }

    getById(id: number): Observable<ApiResponse<PermissionResponse>> {
        return this.http.get<ApiResponse<PermissionResponse>>(`Permissions/${id}`, null, Permissions.RolesModule.Read);
    }

    create(permission: any): Observable<ApiResponse<PermissionResponse>> {
        return this.http.post<ApiResponse<PermissionResponse>>('Permissions', permission, Permissions.RolesModule.Create);
    }

    update(id: number, permission: any): Observable<ApiResponse<PermissionResponse>> {
        return this.http.put<ApiResponse<PermissionResponse>>(`Permissions/${id}`, permission, Permissions.RolesModule.Update);
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>(`Permissions/${id}`, Permissions.RolesModule.Delete);
    }
}
