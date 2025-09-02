import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Zap, 
  Mail,
  Crown,
  FileBarChart,
  ChevronDown,
  Gift
} from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';

const navigationItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Customers', url: '/admin/customers', icon: Users },
  { title: 'Rules Engine', url: '/admin/rules', icon: Zap },
  { title: 'Campaigns', url: '/admin/campaigns', icon: Mail },
  { title: 'Rewards Catalog', url: '/admin/rewards', icon: Gift },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

const reportItems = [
  { title: 'Participation Report', url: '/admin/reports/participation' },
  { title: 'Points Report', url: '/admin/reports/points' },
  { title: 'Redemption Report', url: '/admin/reports/redemption' },
  { title: 'Membership Report', url: '/admin/reports/membership' },
  { title: 'Segmentation Report', url: '/admin/reports/segmentation' },
  { title: 'ROI Report', url: '/admin/reports/roi' },
  { title: 'Growth Report', url: '/admin/reports/growth' },
];

export const AdminSidebar = () => {
  const { url } = usePage();
  
  const isActive = (itemUrl: string) => {
    if (itemUrl === '/dashboard') {
      return url === '/dashboard';
    }
    return url.startsWith(itemUrl);
  };

  return (
    <div className="border-r border-sidebar-border bg-sidebar w-64 flex-shrink-0 h-screen sticky top-0 flex flex-col">
      {/* Sidebar header */}
      <div className="p-6 bg-sidebar flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Crown className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-base text-sidebar-foreground">Loyalty Manager</h2>
            <p className="text-xs text-sidebar-foreground/70">Admin Dashboard</p>
          </div>
        </div>
      </div>
      
      {/* Separator line between header and navigation - full width */}
      <Separator className="bg-sidebar-border" />
      
      {/* Navigation items */}
      <div className="flex-1 overflow-auto bg-sidebar">
        <div className="p-4 space-y-1">
          {navigationItems.map((item) => {
            const active = isActive(item.url);
            return (
              <div key={item.title}>
                <Link 
                  href={item.url} 
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${
                    active 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm border-l-4 border-primary' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <item.icon className={`h-4 w-4 ${active ? 'text-primary' : 'text-sidebar-foreground'}`} />
                  <span>{item.title}</span>
                </Link>
              </div>
            );
          })}
          
          {/* Reports Section with Submenu */}
          <div>
            <Collapsible defaultOpen className="group/collapsible">
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground w-full text-left">
                  <FileBarChart className="h-4 w-4" />
                  <span>Reports</span>
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="ml-4 space-y-1">
                  {reportItems.map((report) => {
                    const active = isActive(report.url);
                    return (
                      <div key={report.title}>
                        <Link 
                          href={report.url}
                          className={`flex items-center gap-2 px-3 py-2 text-sm transition-all duration-200 rounded-md ${
                            active 
                              ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                              : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                          }`}
                        >
                          <span>{report.title}</span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
};
