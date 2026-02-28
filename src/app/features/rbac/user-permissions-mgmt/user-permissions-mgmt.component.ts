import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserPermissionService } from '../../../core/serivces/user-permission.service';
import { PermissionService, PermissionListItem } from '../../../core/serivces/permission.service';
import { ModuleService, ModuleListItem } from '../../../core/serivces/module.service';
import { NotificationService } from '../../../core/serivces/notification.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { HttpService } from '../../../shared/services/generic-http.service';
import { LanguageService } from '../../../shared/services/language.service';
import { UserPermissionsLang } from './user-permissions-mgmt.component.lang';

interface PermissionItemWithSelection extends PermissionListItem {
  selected: boolean;
  shortName: string;
}

interface ModuleWithPermissions extends ModuleListItem {
  permissions: PermissionItemWithSelection[];
  allSelected: boolean;
}

@Component({
  selector: 'app-user-permissions-mgmt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-permissions-mgmt.component.html',
  styleUrls: ['./user-permissions-mgmt.component.css']
})
export class UserPermissionsMgmtComponent implements OnInit {
  private userPermService   = inject(UserPermissionService);
  private permissionService = inject(PermissionService);
  private moduleService     = inject(ModuleService);
  private http              = inject(HttpService);
  private notification      = inject(NotificationService);
  private loading           = inject(LoadingService);
  private langService       = inject(LanguageService);

  t    = UserPermissionsLang;
  lang = this.langService.currentLang;

  users                  = signal<any[]>([]);
  selectedUserId         = signal<number | null>(null);
  modulesWithPermissions = signal<ModuleWithPermissions[]>([]);
  moduleSearchTerm       = signal<string>('');

  filteredModules = computed(() => {
    const term = this.moduleSearchTerm().toLowerCase();
    if (!term) return this.modulesWithPermissions();
    return this.modulesWithPermissions().filter(m =>
      m.displayName.toLowerCase().includes(term) ||
      m.name.toLowerCase().includes(term)
    );
  });

  allModulesSelected = computed(() => {
    const modules = this.modulesWithPermissions();
    return modules.length > 0 && modules.every(m => m.allSelected);
  });

  ngOnInit() {
    this.loadUsers();
    this.loadModulesAndPermissions();
  }

  loadUsers() {
    this.http.get<any>('Users').subscribe(res => {
      if (res.isSuccess) this.users.set([...res.data]);
    });
  }

  loadModulesAndPermissions() {
    this.moduleService.getAll().subscribe(res => {
      if (res.isSuccess) {
        this.permissionService.getAll().subscribe(pRes => {
          if (pRes.isSuccess) {
            this.modulesWithPermissions.set(
              res.data.map(m => {
                const modulePermissions = pRes.data
                  .filter(p => p.moduleId === m.id || p.moduleName === m.name || p.module === m.name)
                  .map(p => {
                    const parts = p.code.split('.');
                    let shortName = parts.length > 0 ? parts[0] : p.name;
                    if (!isNaN(Number(shortName))) shortName = p.name;
                    return { ...p, selected: false, shortName };
                  });
                return { ...m, permissions: modulePermissions, allSelected: false };
              })
            );
          }
        });
      }
    });
  }

  onUserChange() {
    if (!this.selectedUserId()) {
      this.clearSelection();
      return;
    }
    this.loading.show();
    this.userPermService.getUserPermissions(this.selectedUserId()!).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          const directPermIds = new Set((res.data.directPermissions || []).map((p: any) => p.id));
          this.modulesWithPermissions.update(modules =>
            modules.map(m => {
              const updatedPerms = m.permissions.map(p => ({ ...p, selected: directPermIds.has(p.id) }));
              return {
                ...m,
                permissions: updatedPerms,
                allSelected: updatedPerms.length > 0 && updatedPerms.every(p => p.selected)
              };
            })
          );
        }
        this.loading.hide();
      },
      error: () => {
        this.notification.error(this.t.LOAD_ERROR[this.lang()]);
        this.loading.hide();
      }
    });
  }

  toggleModule(module: ModuleWithPermissions) {
    this.modulesWithPermissions.update(modules =>
      modules.map(m => m.id !== module.id ? m : {
        ...m,
        permissions: m.permissions.map(p => ({ ...p, selected: m.allSelected }))
      })
    );
  }

  toggleAllModules() {
    const newState = !this.allModulesSelected();
    this.modulesWithPermissions.update(modules =>
      modules.map(m => ({
        ...m,
        allSelected: newState,
        permissions: m.permissions.map(p => ({ ...p, selected: newState }))
      }))
    );
  }

  updateModuleSelectionState(module: ModuleWithPermissions) {
    this.modulesWithPermissions.update(modules =>
      modules.map(m => m.id !== module.id ? m : {
        ...m,
        allSelected: m.permissions.length > 0 && m.permissions.every(p => p.selected)
      })
    );
  }

  togglePermission(module: ModuleWithPermissions, perm: PermissionItemWithSelection) {
    this.modulesWithPermissions.update(modules =>
      modules.map(m => {
        if (m.id !== module.id) return m;
        const updatedPerms = m.permissions.map(p =>
          p.id !== perm.id ? p : { ...p, selected: !p.selected }
        );
        return {
          ...m,
          permissions: updatedPerms,
          allSelected: updatedPerms.length > 0 && updatedPerms.every(p => p.selected)
        };
      })
    );
  }

  clearSelection() {
    this.modulesWithPermissions.update(modules =>
      modules.map(m => ({
        ...m,
        allSelected: false,
        permissions: m.permissions.map(p => ({ ...p, selected: false }))
      }))
    );
  }

  saveChanges() {
    if (!this.selectedUserId()) return;
    const selectedIds = this.modulesWithPermissions()
      .flatMap(m => m.permissions)
      .filter(p => p.selected)
      .map(p => p.id);

    this.loading.show();
    this.userPermService.assignMultiple(this.selectedUserId()!, selectedIds).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.notification.success(this.t.SUCCESS[this.lang()]);
        } else {
          this.notification.error(res.message);
        }
        this.loading.hide();
      },
      error: () => {
        this.notification.error(this.t.ERROR[this.lang()]);
        this.loading.hide();
      }
    });
  }
}
