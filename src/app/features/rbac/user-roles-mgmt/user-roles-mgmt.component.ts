import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService, Role } from '../../../core/serivces/role.service';
import { UserRoleService } from '../../../core/serivces/user-role.service';
import { NotificationService } from '../../../core/serivces/notification.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { HttpService } from '../../../shared/services/generic-http.service';
import { LanguageService } from '../../../shared/services/language.service';
import { UserRolesLang } from './user-roles-mgmt.component.lang';

@Component({
  selector: 'app-user-roles-mgmt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-roles-mgmt.component.html',
  styleUrls: ['./user-roles-mgmt.component.css']
})
export class UserRolesMgmtComponent implements OnInit {
  private roleService = inject(RoleService);
  private userRoleService = inject(UserRoleService);
  private http = inject(HttpService); // For loading users until UserMgmt has a better service
  private notification = inject(NotificationService);
  private loading = inject(LoadingService);
  private cdr = inject(ChangeDetectorRef);
  private langService = inject(LanguageService);

  // Localization
  t = UserRolesLang;
  lang = this.langService.currentLang;

  users: any[] = [];
  rolesWithStatus: (Role & { selected: boolean })[] = [];
  selectedUserId: number | null = null;

  ngOnInit() {
    this.loadRoles();
    this.loadUsers();
  }

  loadRoles() {
    this.roleService.getAll().subscribe(data => {
      this.rolesWithStatus = data.map(r => ({ ...r, selected: false }));
    });
  }

  loadUsers() {
    this.http.get<any>('Users').subscribe(res => {
      if (res.isSuccess) {
        this.users = [...res.data];
        this.cdr.detectChanges();
      }
    });
  }

  onUserChange() {
    if (!this.selectedUserId) return;
    this.loading.show();
    this.userRoleService.getUserRoles(this.selectedUserId).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          const userRoleIds = new Set(res.data.roles.map((r: any) => r.id));
          this.rolesWithStatus.forEach(r => r.selected = userRoleIds.has(r.id));
          this.loading.hide();
          this.cdr.detectChanges();
        }
      },
      error: () => this.loading.hide()
    });
  }

  saveChanges() {
    if (!this.selectedUserId) return;
    const selectedRoleIds = this.rolesWithStatus.filter(r => r.selected).map(r => r.id);
    this.loading.show();
    this.userRoleService.assignMultiple(this.selectedUserId, selectedRoleIds).subscribe({
      next: (res) => {
        if (res.isSuccess) this.notification.success(this.t.SUCCESS[this.lang()]);
        this.loading.hide();
      },
      error: () => this.loading.hide()
    });
  }
}
