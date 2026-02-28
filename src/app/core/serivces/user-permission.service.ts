import { Injectable, inject } from '@angular/core';
import { HttpService } from '../../shared/services/generic-http.service';
import { Observable } from 'rxjs';
import { ApiResponse, Permissions } from '../../shared/models/common.model';

@Injectable({
    providedIn: 'root'
})
export class UserPermissionService {
    private http = inject(HttpService);

    getUserPermissions(userId: number): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(`UserPermissions/user/${userId}`, null, Permissions.Users.Read);
    }

    assignPermission(userId: number, permissionId: number): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>('UserPermissions/assign', { userId, permissionId }, Permissions.Users.Assign);
    }

    assignMultiple(userId: number, permissionIds: number[]): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>('UserPermissions/assign-multiple', { userId, permissionIds }, Permissions.Users.Assign);
    }

    removePermission(userId: number, permissionId: number): Observable<any> {
        return this.http.delete<any>(`UserPermissions/remove/${userId}/${permissionId}`, Permissions.Users.Manage);
    }
}
