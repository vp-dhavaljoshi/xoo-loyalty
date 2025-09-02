import { AdminLayout } from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, ArrowRight, BarChart3, Mail, Trophy } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function Dashboard() {
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
  const navigateToSettings = () => router.visit('/admin/settings');

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-gradient">Dashboard</h1>
            <p className="text-xl text-muted-foreground">Monitor your loyalty program performance and insights</p>
          </div>
          <div className="flex gap-3">
            <Button className="btn-gradient" onClick={navigateToRules}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Manage Rules
            </Button>
            <Button variant="outline" className="hover-lift" onClick={navigateToCampaigns}>
              <Mail className="h-4 w-4 mr-2" />
              Manage Campaigns
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={stat.title} className="animate-slide-up" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  {stat.change && (
                    <p className={`text-xs ${getChangeColor(stat.changeType)}`}>
                      {stat.change}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 animate-scale-in">
            <Card>
              <CardHeader>
                <CardTitle>Points Issued vs. Redeemed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Chart visualization would be rendered here</p>
                    <p className="text-xs text-gray-400">Red line: Points Issued, Blue line: Points Redeemed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick Actions */}
          <div className="space-y-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-2xl font-bold tracking-tight">Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-between hover-lift transition-all duration-smooth"
                onClick={navigateToCustomers}
              >
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  View All Customers
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between hover-lift transition-all duration-smooth"
                onClick={navigateToRules}
              >
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Create New Rule
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between hover-lift transition-all duration-smooth"
                onClick={navigateToCampaigns}
              >
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Launch Campaign
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between hover-lift transition-all duration-smooth"
                onClick={navigateToSettings}
              >
                <span className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Adjust Settings
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
