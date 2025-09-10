
import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Menu, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePage, router, Head } from '@inertiajs/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PermissionGate } from '../components/PermissionGate';
import { PERMISSIONS, useAuth } from '../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {

  const { user } = useAuth();
  const { url } = usePage();
  
  // Component initialization
  React.useEffect(() => {
    // Component mounted
  }, [user, url]);
  
  // Get page title based on current URL
  const getPageTitle = () => {
    
    // Handle empty or undefined URL
    if (!url || url === '') return 'Dashboard';
    
    // Home page
    if (url === '/') return 'Home';
    
    // Dashboard
    if (url === '/admin/dashboard' || url.startsWith('/admin/dashboard')) return 'Dashboard';
    
    // Customer Management
    if (url === '/admin/customers' || url.startsWith('/admin/customers')) return 'Customer Management';
    
    // Rules Engine
    if (url === '/admin/rules' || url.startsWith('/admin/rules')) return 'Rules Engine';
    
    // Campaigns
    if (url === '/admin/campaigns' || url.startsWith('/admin/campaigns')) return 'Campaigns';
    
    // Rewards Catalog
    if (url === '/admin/rewards' || url.startsWith('/admin/rewards')) return 'Rewards Catalog';
    
    // Settings
    if (url === '/admin/settings' || url.startsWith('/admin/settings')) return 'Settings';
    
    // Reports
    if (url.includes('/admin/reports/')) {
      if (url.includes('/participation')) return 'Participation Reports';
      return 'Reports';
    }
    
    // Profile
    if (url === '/profile' || url.startsWith('/profile')) return 'Profile';
    
    // Default fallback
    return 'Dashboard';
  };

  const handleLogout = () => {
    router.post('/logout', {}, {
      onSuccess: () => {
        // Force a page reload to ensure clean state
        window.location.reload();
      },
      onError: () => {
        // Force a page reload even on error to ensure clean state
        window.location.reload();
      }
    });
  };

  // Get the current page title
  const currentPageTitle = getPageTitle();

  // Force re-render when URL changes to ensure title updates immediately
  const [titleKey, setTitleKey] = React.useState(0);
  
  React.useEffect(() => {
    setTitleKey(prev => prev + 1);
  }, [url]);

  return (
    <>
      <Head title={`${currentPageTitle} | xoo-loyalty`} key={titleKey} />
      <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header - responsive design */}
          <header className="goodcents-header h-16 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-10 border-b border-sidebar-border">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" size="sm" className="text-header-foreground hover:bg-white/10 lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-lg sm:text-xl font-bold truncate">{getPageTitle()}</h1>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-3">
              
              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-1 sm:gap-2 text-header-foreground hover:bg-white/10 border-0 p-1 sm:p-2"
                  >
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-xs sm:text-sm hidden sm:inline">
                      {user?.full_name || 'Admin User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {user?.full_name || 'Admin User'}
                  </DropdownMenuLabel>
                  <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                    {user?.email || 'admin@example.com'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <PermissionGate permission={PERMISSIONS.SETTINGS_VIEW}>
                    <DropdownMenuItem onClick={() => router.visit('/admin/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </PermissionGate>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-auto bg-gradient-subtle min-h-0">
            <div className="p-4 sm:p-6 h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
      </SidebarProvider>
    </>
  );
};
