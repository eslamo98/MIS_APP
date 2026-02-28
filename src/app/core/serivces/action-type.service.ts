import { Injectable, inject } from '@angular/core';
import { HttpService } from '../../shared/services/generic-http.service';
import { Observable } from 'rxjs';
import { ApiResponse, Permissions } from '../../shared/models/common.model';

export interface ActionTypeListItem {
    id: number;
    name: string;
    displayName: string;
    description: string;
    orderIndex: number;
}

@Injectable({
    providedIn: 'root'
})
export class ActionTypeService {
    private http = inject(HttpService);

    getAll(): Observable<ApiResponse<ActionTypeListItem[]>> {
        return this.http.get<ApiResponse<ActionTypeListItem[]>>('ActionTypes', null, Permissions.RolesModule.Read);
    }

    getPaged(params: any): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>('ActionTypes/paged', params, Permissions.RolesModule.Read);
    }

    getById(id: number): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(`ActionTypes/${id}`, null, Permissions.RolesModule.Read);
    }
}
