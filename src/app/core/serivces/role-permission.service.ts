import { Injectable, inject } from '@angular/core';
import { HttpService } from '../../shared/services/generic-http.service';
import { Observable } from 'rxjs';
import { ApiResponse, Permissions } from '../../shared/models/common.model';

@Injectable({
    providedIn: 'root'
})
export class RolePermissionService {
    private http = inject(HttpService);

    getRolePermissions(roleId: number): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(`RolePermissions/role/${roleId}`, null, Permissions.RolesModule.Read);
    }

    assignPermission(roleId: number, permissionId: number): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>('RolePermissions/assign', { roleId, permissionId }, Permissions.RolesModule.Assign);
    }

    assignMultiple(roleId: number, permissionIds: number[]): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>('RolePermissions/assign-multiple', { roleId, permissionIds }, Permissions.RolesModule.Assign);
    }

    removePermission(roleId: number, permissionId: number): Observable<any> {
        return this.http.delete<any>(`RolePermissions/remove/${roleId}/${permissionId}`, Permissions.RolesModule.Manage);
    }
}
