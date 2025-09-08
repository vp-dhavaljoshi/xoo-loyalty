import React, { createContext, useContext, ReactNode, useState } from 'react';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  full_name: string;
}

interface AuthData {
  user: User | null;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  permissions: string[];
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  hasLoyaltyPermission: (permission: string) => boolean;
  hasModulePermission: (module: string, action?: string) => boolean;
  canAccessModule: (module: string) => boolean;
  getModulePermissions: (module: string) => string[];
  setAuth: (auth: AuthData) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  auth: AuthData;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, auth }) => {
  console.log('AuthProvider rendered:', auth);
  const [safeAuth, setSafeAuth] = useState<AuthData>(auth || {
    user: null,
    permissions: []
  });

  // Update state when auth prop changes (on page navigation)
  React.useEffect(() => {
    console.log('Auth context updated:', auth);
    if (auth) {
      // Ensure permissions is always an array
      const safeAuthData = {
        user: auth.user,
        permissions: Array.isArray(auth.permissions) ? auth.permissions : []
      };
      
      setSafeAuth(safeAuthData);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth context updated:', {
          user: safeAuthData.user,
          permissionsCount: safeAuthData.permissions.length,
          permissions: safeAuthData.permissions,
          isAuthenticated: !!safeAuthData.user
        });
      }
    }
  }, [auth]);

  const setAuth = (auth: AuthData) => {
    console.log('setAuth called:', auth);
    setSafeAuth(auth);
  };
 
  const hasPermission = (permission: string): boolean => {
    if (!safeAuth.permissions || !Array.isArray(safeAuth.permissions)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Permissions array is not available or not an array:', safeAuth.permissions);
      }
      return false;
    }
    
    const hasAccess = safeAuth.permissions.includes(permission);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`hasPermission(${permission}): ${hasAccess}`, {
        permissions: safeAuth.permissions,
        permission,
        found: safeAuth.permissions.includes(permission)
      });
    }
    
    return hasAccess;
  };

  const hasLoyaltyPermission = (permission: string): boolean => {
    return hasPermission(permission);
  };

  const hasModulePermission = (module: string, action: string = 'view'): boolean => {
    // Check if user has any permission for this module
    return safeAuth.permissions.some(perm => 
      perm.startsWith(`${module}.`) || perm.includes(`${module}-`) || perm.includes(`${module}.${action}`)
    );
  };

  const canAccessModule = (module: string): boolean => {
    // Check if user has any permission for this module
    return safeAuth.permissions.some(perm => 
      perm.startsWith(`${module}.`) || perm.includes(`${module}-`)
    );
  };

  const getModulePermissions = (module: string): string[] => {
    // Return all permissions that belong to this module
    return safeAuth.permissions.filter(perm => 
      perm.startsWith(`${module}.`) || perm.includes(`${module}-`)
    );
  };

  const value: AuthContextType = {
    user: safeAuth.user,
    permissions: safeAuth.permissions || [],
    isAuthenticated: !!safeAuth.user,
    hasPermission,
    hasLoyaltyPermission,
    hasModulePermission,
    canAccessModule,
    getModulePermissions,
    setAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

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
