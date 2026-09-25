export type UserRole = 'super_admin' | 'hr_admin' | 'hr_analyst' | 'manager' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentScope?: string; // e.g. 'All' or specific dept like 'Engineering'
  avatarUrl?: string;
  status: 'active' | 'suspended' | 'invited';
  createdAt: string;
  lastLogin: string;
  title: string;
}

export interface RolePermissions {
  canViewAllDepartments: boolean;
  canViewCompensation: boolean;
  canEditData: boolean;
  canManageUsers: boolean;
  canExecuteCustomCode: boolean; // SQL / Python
  canExportData: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  super_admin: {
    canViewAllDepartments: true,
    canViewCompensation: true,
    canEditData: true,
    canManageUsers: true,
    canExecuteCustomCode: true,
    canExportData: true,
  },
  hr_admin: {
    canViewAllDepartments: true,
    canViewCompensation: true,
    canEditData: true,
    canManageUsers: true,
    canExecuteCustomCode: true,
    canExportData: true,
  },
  hr_analyst: {
    canViewAllDepartments: true,
    canViewCompensation: true,
    canEditData: true,
    canManageUsers: false,
    canExecuteCustomCode: true,
    canExportData: true,
  },
  manager: {
    canViewAllDepartments: false,
    canViewCompensation: false,
    canEditData: false,
    canManageUsers: false,
    canExecuteCustomCode: false,
    canExportData: true,
  },
  viewer: {
    canViewAllDepartments: true,
    canViewCompensation: false,
    canEditData: false,
    canManageUsers: false,
    canExecuteCustomCode: false,
    canExportData: false,
  },
};

export interface AuditEntry {
  id: string;
  timestamp: string;
  userEmail: string;
  action: string;
  category: 'auth' | 'data_clean' | 'export' | 'user_management' | 'query';
  details: string;
}
