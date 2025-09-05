import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface PermissionGateProps {
  permission?: string;
  loyaltyPermission?: string;
  module?: string;
  action?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  loyaltyPermission,
  module,
  action = 'view',
  fallback = null,
  children
}) => {
  const { hasPermission, hasLoyaltyPermission, hasModulePermission, canAccessModule } = useAuth();

  // Check specific permission
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // Check loyalty permission
  if (loyaltyPermission && !hasLoyaltyPermission(loyaltyPermission)) {
    return <>{fallback}</>;
  }

  // Check module permission
  if (module) {
    if (action && !hasModulePermission(module, action)) {
      return <>{fallback}</>;
    }
    if (!action && !canAccessModule(module)) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

// Higher-order component for permission-based rendering
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  permission?: string,
  loyaltyPermission?: string,
  module?: string,
  action?: string
) {
  return function PermissionWrappedComponent(props: P) {
    return (
      <PermissionGate
        permission={permission}
        loyaltyPermission={loyaltyPermission}
        module={module}
        action={action}
      >
        <Component {...props} />
      </PermissionGate>
    );
  };
}
