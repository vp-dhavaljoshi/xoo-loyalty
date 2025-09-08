
import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Menu, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePage, router } from '@inertiajs/react';
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
  
  // Debug logging
  React.useEffect(() => {
    console.log('AdminLayout rendered:', {
      user,
      url,
      hasUser: !!user
    });
    if (process.env.NODE_ENV === 'development') {
      console.log('AdminLayout rendered:', {
        user,
        url,
        hasUser: !!user
      });
    }
  }, [user, url]);
  
  // Get page title based on current URL
  const getPageTitle = () => {
    if (url === '/admin/dashboard') return 'Dashboard';
    if (url === '/admin/customers') return 'Customer Management';
    if (url === '/admin/rules') return 'Rules Engine';
    if (url === '/admin/campaigns') return 'Campaigns';
    if (url === '/admin/rewards') return 'Rewards Catalog';
    if (url === '/admin/settings') return 'Settings';
    if (url.includes('/admin/reports/')) return 'Reports';
    return 'Dashboard';
  };

  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header - now aligned with sidebar */}
          <header className="goodcents-header h-16 flex items-center justify-between px-6 flex-shrink-0 z-10 border-b border-sidebar-border">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-header-foreground hover:bg-white/10 md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold">{getPageTitle()}</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button className="bg-white/10 hover:bg-white/20 text-header-foreground border-0 text-sm">
                Lab Store
              </Button>
              <Button className="bg-white/10 hover:bg-white/20 text-header-foreground border-0 text-sm">
                Online Ordering
              </Button>
              
              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 text-header-foreground hover:bg-white/10 border-0 p-2"
                  >
                    <User className="h-5 w-5" />
                    <span className="text-sm">
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
            <div className="p-6 h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
