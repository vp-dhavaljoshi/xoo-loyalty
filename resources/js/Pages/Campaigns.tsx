import React, { useState } from 'react';
import { AdminLayout } from '@/Layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, Edit, Pause, Play, Mail, Users, DollarSign, TrendingUp, Gift, Calendar, Target, Zap, MessageSquare, Bell } from 'lucide-react';

interface Campaign {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'paused';
  channel: 'email' | 'sms' | 'push';
  subject: string;
  targetAudience: string;
  minPoints?: number;
  startDate: string;
  endDate: string;
  createdDate: string;
  associatedRule?: string;
  customerGroup: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface CampaignsProps {
  auth: {
    user: User | null;
  };
}

export default function Campaigns({ auth }: CampaignsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample campaigns data
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 1,
      name: "Welcome Email Series",
      description: "Welcome series for new loyalty program members",
      status: 'active',
      channel: 'email',
      subject: "Welcome to our Loyalty Program!",
      targetAudience: "New Members",
      startDate: "15/01/2024",
      endDate: "31/12/2024",
      createdDate: "15/01/2024",
      customerGroup: "New Members"
    },
    {
      id: 2,
      name: "Black Friday Special",
      description: "Exclusive offers for Black Friday",
      status: 'draft',
      channel: 'email',
      subject: "Black Friday Exclusive Offers",
      targetAudience: "VIP",
      minPoints: 500,
      startDate: "29/11/2024",
      endDate: "30/11/2024",
      createdDate: "01/11/2024",
      customerGroup: "VIP Members"
    }
  ]);

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    channel: 'email',
    subject: '',
    targetAudience: '',
    minPoints: 0,
    startDate: '',
    endDate: '',
    customerGroup: '',
    associatedRule: ''
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'draft':
        return <div className="w-2 h-2 bg-orange-500 rounded-full"></div>;
      case 'paused':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'push':
        return <Bell className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const handleCreateCampaign = () => {
    if (newCampaign.name && newCampaign.subject) {
      const campaign: Campaign = {
        id: campaigns.length + 1,
        ...newCampaign,
        status: 'draft',
        createdDate: new Date().toISOString().split('T')[0]
      };
      setCampaigns([...campaigns, campaign]);
      setNewCampaign({
        name: '', description: '', channel: 'email', subject: '', targetAudience: '',
        minPoints: 0, startDate: '', endDate: '', customerGroup: '', associatedRule: ''
      });
      setShowCreateDialog(false);
    }
  };

  const handleEditCampaign = () => {
    if (selectedCampaign && newCampaign.name && newCampaign.subject) {
      const updatedCampaigns = campaigns.map(campaign =>
        campaign.id === selectedCampaign.id
          ? { ...campaign, ...newCampaign }
          : campaign
      );
      setCampaigns(updatedCampaigns);
      setShowEditDialog(false);
      setSelectedCampaign(null);
    }
  };

  const toggleCampaignStatus = (campaign: Campaign) => {
    const updatedCampaigns = campaigns.map(c =>
      c.id === campaign.id
        ? { ...c, status: c.status === 'active' ? 'paused' : 'active' }
        : c
    );
    setCampaigns(updatedCampaigns);
  };

  const openEditDialog = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setNewCampaign({
      name: campaign.name,
      description: campaign.description,
      channel: campaign.channel,
      subject: campaign.subject,
      targetAudience: campaign.targetAudience,
      minPoints: campaign.minPoints || 0,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      customerGroup: campaign.customerGroup,
      associatedRule: campaign.associatedRule || ''
    });
    setShowEditDialog(true);
  };

  // Metrics data
  const metrics = [
    {
      title: "Total Revenue",
      value: "$7,611.21",
      trend: "71 vs last period",
      trendType: "positive",
      icon: DollarSign
    },
    {
      title: "Customers Reached",
      value: "5,516",
      description: "customer growth",
      icon: Users
    },
    {
      title: "Avg Engagement",
      value: "30.3%",
      trend: "engagement trend",
      trendType: "positive",
      icon: TrendingUp
    },
    {
      title: "Points Awarded",
      value: "3,800",
      description: "loyalty program impact",
      icon: Gift
    }
  ];

  return (
    <AdminLayout auth={auth}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
              Create and manage marketing campaigns for your loyalty program
          </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Campaign
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="all-campaigns">All Campaigns</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <Card key={metric.title} className="animate-slide-up" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
                    <metric.icon className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    {metric.trend && (
                      <p className={`text-xs ${metric.trendType === 'positive' ? 'text-green-600' : 'text-gray-600'}`}>
                        {metric.trend}
                      </p>
                    )}
                    {metric.description && (
                      <p className="text-xs text-gray-600">{metric.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Campaign Overview and Top Performer */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Campaign Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Campaigns</span>
                    <span className="font-semibold">{campaigns.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Campaigns</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{campaigns.filter(c => c.status === 'active').length}</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg Conversion Rate</span>
                    <span className="font-semibold">0.7%</span>
                  </div>
                </CardContent>
              </Card>

        <Card>
          <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Top Performer
                  </CardTitle>
          </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Welcome Email Series</h4>
                    <p className="text-sm text-muted-foreground">Best revenue generating campaign</p>
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      High Performer
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* All Campaigns Tab */}
          <TabsContent value="all-campaigns" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">All Campaigns</h3>
              <div className="grid gap-4">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold">{campaign.name}</h3>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                              {getStatusIcon(campaign.status)}
                              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {getChannelIcon(campaign.channel)}
                            <span className="capitalize">{campaign.channel}</span>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div><span className="font-medium">Subject:</span> {campaign.subject}</div>
                            <div><span className="font-medium">Target:</span> {campaign.targetAudience}</div>
                            <div><span className="font-medium">Channel:</span> {campaign.channel}</div>
                            {campaign.minPoints && (
                              <div>
                                <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                  Min: {campaign.minPoints} Points
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Start: {campaign.startDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              End: {campaign.endDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Created: {campaign.createdDate}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          {campaign.status === 'active' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleCampaignStatus(campaign)}
                              className="flex items-center gap-1"
                            >
                              <Pause className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleCampaignStatus(campaign)}
                              className="flex items-center gap-1"
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(campaign)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
          </CardContent>
        </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Campaign Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Set up a new marketing campaign for your loyalty program.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Campaign Name *</label>
                <Input
                  placeholder="Enter campaign name"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Enter campaign description"
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer Group *</label>
                <Select value={newCampaign.customerGroup} onValueChange={(value) => setNewCampaign({ ...newCampaign, customerGroup: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New Members">New Members</SelectItem>
                    <SelectItem value="VIP Members">VIP Members</SelectItem>
                    <SelectItem value="Regular Members">Regular Members</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-xs text-muted-foreground mt-1">
                  <span className="text-blue-600 cursor-pointer">Export New Members (0 customers)</span>
                  <br />
                  Export customer data to use with external email tools
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Associate with Loyalty Rule (Optional)</label>
                <Select value={newCampaign.associatedRule} onValueChange={(value) => setNewCampaign({ ...newCampaign, associatedRule: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select loyalty rule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Regular Purchase (10 pts)">Regular Purchase (10 pts)</SelectItem>
                    <SelectItem value="Referral Bonus (100 pts)">Referral Bonus (100 pts)</SelectItem>
                    <SelectItem value="Birthday Bonus (50 pts)">Birthday Bonus (50 pts)</SelectItem>
                  </SelectContent>
                </Select>
                {newCampaign.associatedRule && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm font-medium text-blue-900">Selected Rule: {newCampaign.associatedRule}</div>
                    <div className="text-xs text-blue-700 mt-1">Points: 10 Trigger: OnPurchase</div>
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full mt-2">
                      Active
                    </span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={newCampaign.startDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="date"
                    value={newCampaign.endDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCampaign}>
                Create Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Campaign Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Campaign</DialogTitle>
              <DialogDescription>
                Modify the selected campaign's properties and settings.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Campaign Name *</label>
                <Input
                  placeholder="Enter campaign name"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Enter campaign description"
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer Group *</label>
                <Select value={newCampaign.customerGroup} onValueChange={(value) => setNewCampaign({ ...newCampaign, customerGroup: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New Members">New Members</SelectItem>
                    <SelectItem value="VIP Members">VIP Members</SelectItem>
                    <SelectItem value="Regular Members">Regular Members</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Associate with Loyalty Rule (Optional)</label>
                <Select value={newCampaign.associatedRule} onValueChange={(value) => setNewCampaign({ ...newCampaign, associatedRule: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select loyalty rule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Regular Purchase (10 pts)">Regular Purchase (10 pts)</SelectItem>
                    <SelectItem value="Referral Bonus (100 pts)">Referral Bonus (100 pts)</SelectItem>
                    <SelectItem value="Birthday Bonus (50 pts)">Birthday Bonus (50 pts)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={newCampaign.startDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="date"
                    value={newCampaign.endDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditCampaign}>
                Update Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
