import { Injectable, inject } from '@angular/core';
import { HttpService } from '../../shared/services/generic-http.service';
import { Observable } from 'rxjs';
import { ApiResponse, Permissions } from '../../shared/models/common.model';

export interface ModuleListItem {
    id: number;
    name: string;
    displayName: string;
    orderIndex: number;
    permissionCount: number;
}

@Injectable({
    providedIn: 'root'
})
export class ModuleService {
    private http = inject(HttpService);

    getAll(): Observable<ApiResponse<ModuleListItem[]>> {
        return this.http.get<ApiResponse<ModuleListItem[]>>('Modules', null, Permissions.RolesModule.Read);
    }

    getPaged(params: any): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>('Modules/paged', params, Permissions.RolesModule.Read);
    }

    getById(id: number): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(`Modules/${id}`, null, Permissions.RolesModule.Read);
    }

    create(data: any): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>('Modules', data, Permissions.RolesModule.Create);
    }

    update(id: number, data: any): Observable<ApiResponse<any>> {
        return this.http.put<ApiResponse<any>>(`Modules/${id}`, data, Permissions.RolesModule.Update);
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>(`Modules/${id}`, Permissions.RolesModule.Delete);
    }

    initializePermissions(id: number): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`Modules/${id}/initialize-permissions`, {}, Permissions.RolesModule.Create);
    }
}
