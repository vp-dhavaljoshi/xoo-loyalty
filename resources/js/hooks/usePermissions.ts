import { useAuth } from '../contexts/AuthContext';

export function usePermissions() {
  const auth = useAuth();
  
  return {
    permissions: {
      all: auth.permissions,
      loyalty: auth.loyaltyPermissions,
      byModule: auth.permissionsByModule,
      user: auth.user
    },
    hasPermission: auth.hasPermission,
    hasLoyaltyPermission: auth.hasLoyaltyPermission,
    hasModulePermission: auth.hasModulePermission,
    canAccessModule: auth.canAccessModule,
    getModulePermissions: auth.getModulePermissions,
    isAuthenticated: auth.isAuthenticated
  };
}

// Permission constants for easy reference
export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: 'loyalty-dashboard.view',
  
  // Customers
  CUSTOMERS_VIEW: 'loyalty-customers.view',
  CUSTOMERS_EXPORT: 'loyalty-customers.export',
  CUSTOMERS_ADJUST_POINTS: 'loyalty-customers.adjust_points',
  CUSTOMERS_VIEW_TRANSACTIONS: 'loyalty-customers.view_transactions',
  
  // Rules
  RULES_VIEW: 'rules.view',
  RULES_CREATE: 'rules.create',
  RULES_EDIT: 'rules.edit',
  RULES_DELETE: 'rules.delete',
  
  // Campaigns
  CAMPAIGNS_VIEW: 'campaigns.view',
  CAMPAIGNS_CREATE: 'campaigns.create',
  CAMPAIGNS_EDIT: 'campaigns.edit',
  CAMPAIGNS_DELETE: 'campaigns.delete',
  
  // Rewards
  REWARDS_VIEW: 'rewards.view',
  REWARDS_CREATE: 'rewards.create',
  REWARDS_EDIT: 'rewards.edit',
  REWARDS_DELETE: 'rewards.delete',
  
  // Settings
  SETTINGS_VIEW: 'loyalty-settings.view',
  SETTINGS_UPDATE: 'loyalty-settings.update',
  
  // Reports
  REPORTS_VIEW: 'loyalty-reports.view',
  
  // Login
  LOGIN_VIEW: 'loyalty-login.view'
} as const;

// Module constants
export const MODULES = {
  DASHBOARD: 'dashboard',
  CUSTOMERS: 'customers',
  RULES: 'rules',
  CAMPAIGNS: 'campaigns',
  REWARDS: 'rewards',
  SETTINGS: 'settings',
  REPORTS: 'reports'
} as const;
