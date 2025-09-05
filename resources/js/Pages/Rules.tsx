import React, { useState } from 'react';
import { AdminLayout } from '@/Layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Plus, Edit, Trash2, Eye, MoreHorizontal, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Rule {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  points: number;
  type: 'purchase' | 'referral' | 'birthday' | 'anniversary';
  conditions: string;
  createdAt: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface RulesProps {
  // No longer need auth prop - using context
}

export default function Rules({}: RulesProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample rules data
  const [rules, setRules] = useState<Rule[]>([
    {
      id: 1,
      name: "Purchase Points",
      description: "Earn 1 point for every $1 spent on purchases",
      status: 'active',
      points: 1,
      type: 'purchase',
      conditions: "Minimum purchase amount: $10",
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      name: "Referral Bonus",
      description: "Earn 100 points for each successful referral",
      status: 'active',
      points: 100,
      type: 'referral',
      conditions: "Referral must make first purchase",
      createdAt: "2024-01-10"
    },
    {
      id: 3,
      name: "Birthday Bonus",
      description: "Special birthday points for registered customers",
      status: 'draft',
      points: 50,
      type: 'birthday',
      conditions: "Valid ID required",
      createdAt: "2024-01-20"
    },
    {
      id: 4,
      name: "Anniversary Points",
      description: "Bonus points on customer anniversary",
      status: 'inactive',
      points: 25,
      type: 'anniversary',
      conditions: "Minimum 1 year membership",
      createdAt: "2024-01-05"
    }
  ]);

  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    points: 0,
    type: 'purchase',
    conditions: ''
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'draft':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200 ring-1 ring-green-200/50';
      case 'inactive':
        return 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-200/50';
      case 'draft':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 ring-1 ring-yellow-200/50';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 ring-1 ring-gray-200/50';
    }
  };

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return rule.status === activeTab && matchesSearch;
  });

  const handleCreateRule = () => {
    if (newRule.name && newRule.description) {
      const rule: Rule = {
        id: rules.length + 1,
        ...newRule,
        status: 'draft',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setRules([...rules, rule]);
      setNewRule({ name: '', description: '', points: 0, type: 'purchase', conditions: '' });
      setShowCreateDialog(false);
    }
  };

  const handleEditRule = () => {
    if (selectedRule && newRule.name && newRule.description) {
      const updatedRules = rules.map(rule =>
        rule.id === selectedRule.id
          ? { ...rule, ...newRule }
          : rule
      );
      setRules(updatedRules);
      setShowEditDialog(false);
      setSelectedRule(null);
    }
  };

  const handleDeleteRule = () => {
    if (selectedRule) {
      const updatedRules = rules.filter(rule => rule.id !== selectedRule.id);
      setRules(updatedRules);
      setShowDeleteDialog(false);
      setSelectedRule(null);
    }
  };

  const openEditDialog = (rule: Rule) => {
    setSelectedRule(rule);
    setNewRule({
      name: rule.name,
      description: rule.description,
      points: rule.points,
      type: rule.type,
      conditions: rule.conditions
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (rule: Rule) => {
    setSelectedRule(rule);
    setShowDeleteDialog(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rules Engine</h1>
            <p className="text-muted-foreground">
              Configure and manage your loyalty program rules and conditions
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Rule
          </Button>
        </div>

        {/* Search and Tabs */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                <Input
                  placeholder="Search rules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
                <Eye className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Rules</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                  <TabsTrigger value="draft">Draft</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
        </Card>

        {/* Rules List */}
        <div className="grid gap-4">
          {filteredRules.map((rule) => (
            <Card key={rule.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{rule.name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(rule.status)}`}>
                        {getStatusIcon(rule.status)}
                        {rule.status.charAt(0).toUpperCase() + rule.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{rule.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="font-medium text-foreground">{rule.points}</span> points
                      </span>
                      <span>Type: {rule.type}</span>
                      <span>Created: {rule.createdAt}</span>
                    </div>
                    {rule.conditions && (
                      <div className="text-sm">
                        <span className="font-medium">Conditions:</span> {rule.conditions}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(rule)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(rule)}
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

        {/* Create Rule Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Rule</DialogTitle>
              <DialogDescription>
                Define a new loyalty program rule with conditions and rewards.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Rule Name</label>
                <Input
                  placeholder="Enter rule name"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  placeholder="Enter rule description"
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Points</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newRule.points}
                    onChange={(e) => setNewRule({ ...newRule, points: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={newRule.type} onValueChange={(value) => setNewRule({ ...newRule, type: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purchase">Purchase</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="birthday">Birthday</SelectItem>
                      <SelectItem value="anniversary">Anniversary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Conditions</label>
                <Input
                  placeholder="Enter rule conditions"
                  value={newRule.conditions}
                  onChange={(e) => setNewRule({ ...newRule, conditions: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRule}>
                Create Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Rule Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Rule</DialogTitle>
              <DialogDescription>
                Modify the selected rule's properties and conditions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Rule Name</label>
                <Input
                  placeholder="Enter rule name"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  placeholder="Enter rule description"
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Points</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newRule.points}
                    onChange={(e) => setNewRule({ ...newRule, points: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={newRule.type} onValueChange={(value) => setNewRule({ ...newRule, type: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purchase">Purchase</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="birthday">Birthday</SelectItem>
                      <SelectItem value="anniversary">Anniversary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Conditions</label>
                <Input
                  placeholder="Enter rule conditions"
                  value={newRule.conditions}
                  onChange={(e) => setNewRule({ ...newRule, conditions: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditRule}>
                Update Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Delete Rule</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedRule?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteRule}>
                Delete Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
