
export const localStorageKeys = {
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
    user: 'user_info',
    theme: 'theme_mode',
    language: 'app_lang'
};

export const ActionTypes = {
    Create: 'CREATE',
    Read: 'READ',
    Update: 'UPDATE',
    Delete: 'DELETE',
    Print: 'PRINT',
    Export: 'EXPORT',
    Manage: 'MANAGE',
    Approve: 'APPROVE',
    Assign: 'ASSIGN'
};

export const Modules = {
    Orders: 'ORDER',
    Users: 'USER',
    Roles: 'ROLES',
    Dashboard: 'DASHBOARD',
    Settings: 'SETTING',
    Reports: 'REPORT',
    ModulesPermission: 'MODULE'
};

export const Permissions = {
    Users: {
        Create: `${ActionTypes.Create}.${Modules.Users}`,
        Read: `${ActionTypes.Read}.${Modules.Users}`,
        Update: `${ActionTypes.Update}.${Modules.Users}`,
        Delete: `${ActionTypes.Delete}.${Modules.Users}`,
        Print: `${ActionTypes.Print}.${Modules.Users}`,
        Export: `${ActionTypes.Export}.${Modules.Users}`,
        Manage: `${ActionTypes.Manage}.${Modules.Users}`,
        Approve: `${ActionTypes.Approve}.${Modules.Users}`,
        Assign: `${ActionTypes.Assign}.${Modules.Users}`,
    },
    RolesModule: {
        Create: `${ActionTypes.Create}.${Modules.Roles}`,
        Read: `${ActionTypes.Read}.${Modules.Roles}`,
        Update: `${ActionTypes.Update}.${Modules.Roles}`,
        Delete: `${ActionTypes.Delete}.${Modules.Roles}`,
        Print: `${ActionTypes.Print}.${Modules.Roles}`,
        Export: `${ActionTypes.Export}.${Modules.Roles}`,
        Manage: `${ActionTypes.Manage}.${Modules.Roles}`,
        Approve: `${ActionTypes.Approve}.${Modules.Roles}`,
        Assign: `${ActionTypes.Assign}.${Modules.Roles}`,
    },
    ModulesPermission: {
        Create: `${ActionTypes.Create}.${Modules.ModulesPermission}`,
        Read: `${ActionTypes.Read}.${Modules.ModulesPermission}`,
        Update: `${ActionTypes.Update}.${Modules.ModulesPermission}`,
        Delete: `${ActionTypes.Delete}.${Modules.ModulesPermission}`,
        Print: `${ActionTypes.Print}.${Modules.ModulesPermission}`,
        Export: `${ActionTypes.Export}.${Modules.ModulesPermission}`,
        Manage: `${ActionTypes.Manage}.${Modules.ModulesPermission}`,
        Approve: `${ActionTypes.Approve}.${Modules.ModulesPermission}`,
        Assign: `${ActionTypes.Assign}.${Modules.ModulesPermission}`,
    },
    Orders: {
        Create: `${ActionTypes.Create}.${Modules.Orders}`,
        Read: `${ActionTypes.Read}.${Modules.Orders}`,
        Update: `${ActionTypes.Update}.${Modules.Orders}`,
        Delete: `${ActionTypes.Delete}.${Modules.Orders}`,
        Print: `${ActionTypes.Print}.${Modules.Orders}`,
        Export: `${ActionTypes.Export}.${Modules.Orders}`,
        Manage: `${ActionTypes.Manage}.${Modules.Orders}`,
        Approve: `${ActionTypes.Approve}.${Modules.Orders}`,
        Assign: `${ActionTypes.Assign}.${Modules.Orders}`,
    },
    Reports: {
        Create: `${ActionTypes.Create}.${Modules.Reports}`,
        Read: `${ActionTypes.Read}.${Modules.Reports}`,
        Update: `${ActionTypes.Update}.${Modules.Reports}`,
        Delete: `${ActionTypes.Delete}.${Modules.Reports}`,
        Print: `${ActionTypes.Print}.${Modules.Reports}`,
        Export: `${ActionTypes.Export}.${Modules.Reports}`,
        Manage: `${ActionTypes.Manage}.${Modules.Reports}`,
        Approve: `${ActionTypes.Approve}.${Modules.Reports}`,
        Assign: `${ActionTypes.Assign}.${Modules.Reports}`,
    },
    Dashboard: {
        Create: `${ActionTypes.Create}.${Modules.Dashboard}`,
        Read: `${ActionTypes.Read}.${Modules.Dashboard}`,
        Update: `${ActionTypes.Update}.${Modules.Dashboard}`,
        Delete: `${ActionTypes.Delete}.${Modules.Dashboard}`,
        Print: `${ActionTypes.Print}.${Modules.Dashboard}`,
        Export: `${ActionTypes.Export}.${Modules.Dashboard}`,
        Manage: `${ActionTypes.Manage}.${Modules.Dashboard}`,
        Approve: `${ActionTypes.Approve}.${Modules.Dashboard}`,
        Assign: `${ActionTypes.Assign}.${Modules.Dashboard}`,
    },
    Settings: {
        Create: `${ActionTypes.Create}.${Modules.Settings}`,
        Read: `${ActionTypes.Read}.${Modules.Settings}`,
        Update: `${ActionTypes.Update}.${Modules.Settings}`,
        Delete: `${ActionTypes.Delete}.${Modules.Settings}`,
        Print: `${ActionTypes.Print}.${Modules.Settings}`,
        Export: `${ActionTypes.Export}.${Modules.Settings}`,
        Manage: `${ActionTypes.Manage}.${Modules.Settings}`,
        Approve: `${ActionTypes.Approve}.${Modules.Settings}`,
        Assign: `${ActionTypes.Assign}.${Modules.Settings}`,
    }
};

export const UserMessages = {
    CreateSuccess: 'User created successfully.',
    UpdateSuccess: 'User updated successfully.',
    DeactivateSuccess: 'User deactivated successfully.',
    DeleteSuccess: 'User deleted successfully.',
    LoadError: 'Failed to load users.',
    UpdateError: 'Error updating user.',
    CreateError: 'Error creating user.',
    DeactivateError: 'Failed to deactivate user.',
    DeactivateConfirm: (name: string) => `Are you sure you want to deactivate user "${name}"?`
};

export const UserLabels = {
    Management: 'User Management',
    Title: 'Manage system users, their status, and profile information.',
    EditTitle: (name: string) => `Edit User: ${name}`,
    CreateTitle: 'Create New User',
    UpdateLabel: 'Update User',
    CreateLabel: 'Create User',
    DeactivateLabel: 'Deactivate User'
};

export const pageRoutes = {
    home: 'home',
    dashboard: '',
    root: '',
    auth: {
        login: 'auth/login',
        register: 'auth/register'
    },
    orders: 'orders',
    users: 'users',
    roles: 'roles',
    permissions: 'permissions',
    modules: 'modules',
    rolePermissions: 'role-permissions',
    userPermissions: 'user-permissions',
    userRoles: 'user-roles',
    profile: 'profile'
};

export interface TableColumn {
    key: string;
    label: string;
    sortable?: boolean;
    type?: 'text' | 'date' | 'badge' | 'currency' | 'action' | 'image';
}

export interface TablePagination {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    pageSizeOptions: number[];
}

export interface PageChangeEvent {
    pageIndex: number;
    pageSize: number;
}

export interface PagedResult<T> {
    items: T[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface ApiResponse<T> {
    isSuccess: boolean;
    message: string;
    data: T;
    errors: ValidationError[];
    errorCode: string;
    timestamp: string;
}

export interface ValidationError {
    propertyName: string;
    errorMessage: string;
}
