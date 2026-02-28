import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService, Role } from '../../../core/serivces/role.service';
import { PermissionService, PermissionListItem } from '../../../core/serivces/permission.service';
import { RolePermissionService } from '../../../core/serivces/role-permission.service';
import { ModuleService, ModuleListItem } from '../../../core/serivces/module.service';
import { NotificationService } from '../../../core/serivces/notification.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { LanguageService } from '../../../shared/services/language.service';
import { RolePermissionsLang } from './role-permissions-mgmt.component.lang';

interface PermissionItemWithSelection extends PermissionListItem {
  selected: boolean;
  shortName: string;
}

interface ModuleWithPermissions extends ModuleListItem {
  permissions: PermissionItemWithSelection[];
  allSelected: boolean;
}

@Component({
  selector: 'app-role-permissions-mgmt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-permissions-mgmt.component.html',
  styleUrls: ['./role-permissions-mgmt.component.css']
})
export class RolePermissionsMgmtComponent implements OnInit {
  private roleService     = inject(RoleService);
  private permissionService = inject(PermissionService);
  private rolePermService = inject(RolePermissionService);
  private moduleService   = inject(ModuleService);
  private notification    = inject(NotificationService);
  private loading         = inject(LoadingService);
  private langService     = inject(LanguageService);

  t    = RolePermissionsLang;
  lang = this.langService.currentLang;

  roles                  = signal<Role[]>([]);
  selectedRoleId         = signal<number | null>(null);
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
    this.loadRoles();
    this.loadModulesAndPermissions();
  }

  loadRoles() {
    this.roleService.getAll().subscribe({
      next: (data) => this.roles.set(data),
      error: () => this.notification.error(this.t.LOAD_ERROR[this.lang()])
    });
  }

  loadModulesAndPermissions() {
    this.moduleService.getAll().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.permissionService.getAll().subscribe({
            next: (pRes) => {
              if (pRes.isSuccess) {
                const allPermissions = pRes.data;
                this.modulesWithPermissions.set(
                  res.data.map(m => {
                    const modulePermissions = allPermissions
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
            }
          });
        }
      }
    });
  }

  onRoleChange() {
    if (!this.selectedRoleId()) {
      this.clearSelection();
      return;
    }

    this.loading.show();
    this.rolePermService.getRolePermissions(this.selectedRoleId()!).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          const rolePermIds = new Set((res.data.permissions || []).map((p: any) => p.id));
          this.modulesWithPermissions.update(modules =>
            modules.map(m => {
              const updatedPerms = m.permissions.map(p => ({ ...p, selected: rolePermIds.has(p.id) }));
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
    if (!this.selectedRoleId()) return;
    const selectedIds = this.modulesWithPermissions()
      .flatMap(m => m.permissions)
      .filter(p => p.selected)
      .map(p => p.id);

    this.loading.show();
    this.rolePermService.assignMultiple(this.selectedRoleId()!, selectedIds).subscribe({
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
