import { Injectable, inject } from '@angular/core';
import { HttpService } from '../../shared/services/generic-http.service';
import { Observable } from 'rxjs';
import { ApiResponse, Permissions } from '../../shared/models/common.model';

@Injectable({
    providedIn: 'root'
})
export class UserRoleService {
    private http = inject(HttpService);

    getUserRoles(userId: number): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(`UserRoles/user/${userId}`, null, Permissions.Users.Read);
    }

    assignRole(userId: number, roleId: number): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>('UserRoles/assign', { userId, roleId }, Permissions.Users.Assign);
    }

    assignMultiple(userId: number, roleIds: number[]): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>('UserRoles/assign-multiple', { userId, roleIds }, Permissions.Users.Assign);
    }

    removeRole(userId: number, roleId: number): Observable<any> {
        return this.http.delete<any>(`UserRoles/remove/${userId}/${roleId}`, Permissions.Users.Manage);
    }
}
