import { AdminLayout } from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, ArrowRight, BarChart3, Mail, Trophy, Gift } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { PermissionGate } from '@/components/PermissionGate';
import { PERMISSIONS } from '@/contexts/AuthContext';

interface DashboardProps {
  // Props are now handled globally by Inertia middleware
}

export default function Dashboard({}: DashboardProps) {
  const { toast } = useToast();
  const { props } = usePage();
  
  // Show success message if redirected from login
  useEffect(() => {
    if ((props.flash as any)?.success) {
      toast({
        title: "Success!",
        description: (props.flash as any).success,
        variant: "success",
      });
    }
  }, [(props.flash as any)?.success, toast]);

  // Auth data is now handled globally by Inertia middleware
  const stats = [
    {
      title: 'Total Members',
      value: '1,234',
      change: '+12% from last month',
      changeType: 'positive',
      icon: Users
    },
    {
      title: 'Points Issued (This Month)',
      value: '45,678',
      change: '+8% from last month',
      changeType: 'positive',
      icon: Trophy
    },
    {
      title: 'Points Redeemed',
      value: '23,456',
      change: '+15% from last month',
      changeType: 'positive',
      icon: TrendingUp
    },
    {
      title: 'Active Campaigns',
      value: '3',
      change: '2 scheduled',
      changeType: 'neutral',
      icon: Mail
    }
  ];

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Navigation handlers for Quick Actions
  const navigateToCustomers = () => router.visit('/admin/customers');
  const navigateToRules = () => router.visit('/admin/rules');
  const navigateToCampaigns = () => router.visit('/admin/campaigns');
  const navigateToRewards = () => router.visit('/admin/rewards');

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 lg:gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gradient">Dashboard</h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">Monitor your loyalty program performance and insights</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <PermissionGate permission={PERMISSIONS.RULES_VIEW}>
              <Button className="btn-gradient" onClick={navigateToRules}>
                <TrendingUp className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Manage Rules</span>
                <span className="sm:hidden">Rules</span>
              </Button>
            </PermissionGate>
            <PermissionGate permission={PERMISSIONS.CAMPAIGNS_VIEW}>
              <Button variant="outline" className="hover-lift" onClick={navigateToCampaigns}>
                <Mail className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Manage Campaigns</span>
                <span className="sm:hidden">Campaigns</span>
              </Button>
            </PermissionGate>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <div key={stat.title} className="animate-slide-up" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                  {stat.change && (
                    <p className={`text-xs ${getChangeColor(stat.changeType)} truncate`}>
                      {stat.change}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 animate-scale-in">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Points Issued vs. Redeemed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] sm:h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-center text-gray-500 p-4">
                    <BarChart3 className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs sm:text-sm">Chart visualization would be rendered here</p>
                    <p className="text-xs text-gray-400 hidden sm:block">Red line: Points Issued, Blue line: Points Redeemed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick Actions */}
          <div className="space-y-4 lg:space-y-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Quick Actions</h3>
            <div className="space-y-2 sm:space-y-3">
              <PermissionGate permission={PERMISSIONS.CUSTOMERS_VIEW}>
                <Button 
                  variant="outline" 
                  className="w-full justify-between hover-lift transition-all duration-smooth"
                  onClick={navigateToCustomers}
                >
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">View All Customers</span>
                    <span className="sm:hidden">Customers</span>
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </PermissionGate>
              
              <PermissionGate permission={PERMISSIONS.RULES_CREATE}>
                <Button 
                  variant="outline" 
                  className="w-full justify-between hover-lift transition-all duration-smooth"
                  onClick={navigateToRules}
                >
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="hidden sm:inline">Create New Rule</span>
                    <span className="sm:hidden">New Rule</span>
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </PermissionGate>
              
              <PermissionGate permission={PERMISSIONS.CAMPAIGNS_CREATE}>
                <Button 
                  variant="outline" 
                  className="w-full justify-between hover-lift transition-all duration-smooth"
                  onClick={navigateToCampaigns}
                >
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="hidden sm:inline">Launch Campaign</span>
                    <span className="sm:hidden">Campaign</span>
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </PermissionGate>
              
              <PermissionGate permission={PERMISSIONS.REWARDS_VIEW}>
                <Button 
                  variant="outline" 
                  className="w-full justify-between hover-lift transition-all duration-smooth"
                  onClick={navigateToRewards}
                >
                  <span className="flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    <span className="hidden sm:inline">Manage Rewards</span>
                    <span className="sm:hidden">Rewards</span>
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </PermissionGate>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
