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
import { Plus, Edit, Trash2, Gift, Users, DollarSign, TrendingUp, Star, Calendar, Target, Zap, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';

interface Reward {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  pointsRequired: number;
  category: 'physical' | 'digital' | 'discount' | 'experience';
  availability: 'unlimited' | 'limited';
  stockQuantity?: number;
  startDate: string;
  endDate: string;
  createdDate: string;
  redemptionCount: number;
  imageUrl?: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface RewardsProps {
  // No longer need auth prop - using context
}

export default function Rewards({}: RewardsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample rewards data
  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: 1,
      name: "Free Coffee",
      description: "Redeem for a free coffee of your choice",
      status: 'active',
      pointsRequired: 100,
      category: 'physical',
      availability: 'unlimited',
      startDate: "01-01-2024",
      endDate: "12-31-2024",
      createdDate: "01-01-2024",
      redemptionCount: 45
    },
    {
      id: 2,
      name: "20% Off Next Purchase",
      description: "Get 20% off your next purchase",
      status: 'active',
      pointsRequired: 250,
      category: 'discount',
      availability: 'limited',
      stockQuantity: 50,
      startDate: "01-01-2024",
      endDate: "12-31-2024",
      createdDate: "01-01-2024",
      redemptionCount: 12
    },
    {
      id: 3,
      name: "VIP Event Access",
      description: "Exclusive access to VIP events and experiences",
      status: 'draft',
      pointsRequired: 1000,
      category: 'experience',
      availability: 'limited',
      stockQuantity: 10,
      startDate: "06-01-2024",
      endDate: "12-31-2024",
      createdDate: "05-01-2024",
      redemptionCount: 0
    }
  ]);

  const [newReward, setNewReward] = useState({
    name: '',
    description: '',
    pointsRequired: 0,
    category: 'physical',
    availability: 'unlimited',
    stockQuantity: 0,
    startDate: '',
    endDate: ''
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'draft':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'physical':
        return <Gift className="h-4 w-4" />;
      case 'digital':
        return <Zap className="h-4 w-4" />;
      case 'discount':
        return <DollarSign className="h-4 w-4" />;
      case 'experience':
        return <Star className="h-4 w-4" />;
      default:
        return <Gift className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'physical':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'digital':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'discount':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'experience':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAddReward = () => {
    if (newReward.name && newReward.pointsRequired > 0) {
      const reward: Reward = {
        id: rewards.length + 1,
        ...newReward,
        status: 'draft',
        createdDate: new Date().toISOString().split('T')[0],
        redemptionCount: 0
      };
      setRewards([...rewards, reward]);
      setNewReward({
        name: '', description: '', pointsRequired: 0, category: 'physical',
        availability: 'unlimited', stockQuantity: 0, startDate: '', endDate: ''
      });
      setShowAddDialog(false);
    }
  };

  const handleEditReward = () => {
    if (selectedReward && newReward.name && newReward.pointsRequired > 0) {
      const updatedRewards = rewards.map(reward =>
        reward.id === selectedReward.id
          ? { ...reward, ...newReward }
          : reward
      );
      setRewards(updatedRewards);
      setShowEditDialog(false);
      setSelectedReward(null);
    }
  };

  const handleDeleteReward = () => {
    if (selectedReward) {
      const updatedRewards = rewards.filter(reward => reward.id !== selectedReward.id);
      setRewards(updatedRewards);
      setShowDeleteDialog(false);
      setSelectedReward(null);
    }
  };

  const openEditDialog = (reward: Reward) => {
    setSelectedReward(reward);
    setNewReward({
      name: reward.name,
      description: reward.description,
      pointsRequired: reward.pointsRequired,
      category: reward.category,
      availability: reward.availability,
      stockQuantity: reward.stockQuantity || 0,
      startDate: reward.startDate,
      endDate: reward.endDate
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (reward: Reward) => {
    setSelectedReward(reward);
    setShowDeleteDialog(true);
  };

  // Metrics data
  const metrics = [
    {
      title: "Total Rewards",
      value: rewards.length.toString(),
      description: "available rewards",
      icon: Gift
    },
    {
      title: "Active Rewards",
      value: rewards.filter(r => r.status === 'active').length.toString(),
      description: "currently active",
      icon: CheckCircle
    },
    {
      title: "Total Redemptions",
      value: rewards.reduce((sum, r) => sum + r.redemptionCount, 0).toString(),
      description: "customer redemptions",
      icon: Users
    },
    {
      title: "Avg Points Required",
      value: Math.round(rewards.reduce((sum, r) => sum + r.pointsRequired, 0) / rewards.length).toString(),
      description: "per reward",
      icon: Star
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rewards Catalog</h1>
            <p className="text-muted-foreground">
              Manage your loyalty program rewards and incentives
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Reward
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="all-rewards">All Rewards</TabsTrigger>
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
                    <p className="text-xs text-gray-600">{metric.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Rewards Overview and Top Performer */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Rewards Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Rewards</span>
                    <span className="font-semibold">{rewards.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Rewards</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{rewards.filter(r => r.status === 'active').length}</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg Redemption Rate</span>
                    <span className="font-semibold">15.2%</span>
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
                    <h4 className="font-semibold">Free Coffee</h4>
                    <p className="text-sm text-muted-foreground">Most redeemed reward</p>
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      High Demand
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* All Rewards Tab */}
          <TabsContent value="all-rewards" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">All Rewards</h3>
              <div className="grid gap-4">
                {rewards.map((reward) => (
                  <Card key={reward.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold">{reward.name}</h3>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(reward.status)}`}>
                              {getStatusIcon(reward.status)}
                              {reward.status.charAt(0).toUpperCase() + reward.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {getCategoryIcon(reward.category)}
                            <span className="capitalize">{reward.category}</span>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div><span className="font-medium">Description:</span> {reward.description}</div>
                            <div className="flex items-center gap-4">
                              <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                {reward.pointsRequired} Points
                              </span>
                              <span className={`inline-flex px-2 py-1 text-xs font-medium border ${getCategoryColor(reward.category)}`}>
                                {reward.category.charAt(0).toUpperCase() + reward.category.slice(1)}
                              </span>
                              {reward.availability === 'limited' && reward.stockQuantity !== undefined && (
                                <span className="inline-flex px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                                  Stock: {reward.stockQuantity}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Start: {reward.startDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              End: {reward.endDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              Redemptions: {reward.redemptionCount}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(reward)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(reward)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
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

        {/* Add Reward Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Reward</DialogTitle>
              <DialogDescription>
                Create a new reward for your loyalty program.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Reward Name *</label>
                <Input
                  placeholder="Enter reward name"
                  value={newReward.name}
                  onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Enter reward description"
                  value={newReward.description}
                  onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Points Required *</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newReward.pointsRequired}
                    onChange={(e) => setNewReward({ ...newReward, pointsRequired: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={newReward.category} onValueChange={(value) => setNewReward({ ...newReward, category: value as any })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physical">Physical</SelectItem>
                      <SelectItem value="digital">Digital</SelectItem>
                      <SelectItem value="discount">Discount</SelectItem>
                      <SelectItem value="experience">Experience</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Availability</label>
                  <Select value={newReward.availability} onValueChange={(value) => setNewReward({ ...newReward, availability: value as any })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                      <SelectItem value="limited">Limited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newReward.availability === 'limited' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Stock Quantity</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newReward.stockQuantity}
                      onChange={(e) => setNewReward({ ...newReward, stockQuantity: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={newReward.startDate}
                    onChange={(e) => setNewReward({ ...newReward, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="date"
                    value={newReward.endDate}
                    onChange={(e) => setNewReward({ ...newReward, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddReward}>
                Add Reward
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Reward Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Reward</DialogTitle>
              <DialogDescription>
                Modify the selected reward's properties and settings.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Reward Name *</label>
                <Input
                  placeholder="Enter reward name"
                  value={newReward.name}
                  onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Enter reward description"
                  value={newReward.description}
                  onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Points Required *</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newReward.pointsRequired}
                    onChange={(e) => setNewReward({ ...newReward, pointsRequired: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={newReward.category} onValueChange={(value) => setNewReward({ ...newReward, category: value as any })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physical">Physical</SelectItem>
                      <SelectItem value="digital">Digital</SelectItem>
                      <SelectItem value="discount">Discount</SelectItem>
                      <SelectItem value="experience">Experience</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Availability</label>
                  <Select value={newReward.availability} onValueChange={(value) => setNewReward({ ...newReward, availability: value as any })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                      <SelectItem value="limited">Limited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newReward.availability === 'limited' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Stock Quantity</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newReward.stockQuantity}
                      onChange={(e) => setNewReward({ ...newReward, stockQuantity: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={newReward.startDate}
                    onChange={(e) => setNewReward({ ...newReward, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="date"
                    value={newReward.endDate}
                    onChange={(e) => setNewReward({ ...newReward, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditReward}>
                Update Reward
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Delete Reward</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedReward?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteReward}>
                Delete Reward
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
