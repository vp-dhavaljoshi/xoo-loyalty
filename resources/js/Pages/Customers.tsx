import React, { useState, useMemo } from 'react';
import { AdminLayout } from '@/Layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Search, 
  Download, 
  Eye, 
  TrendingUp, 
  Filter,
  X,
  ChevronDown
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { PermissionGate } from '@/components/PermissionGate';
import { PERMISSIONS } from '@/contexts/AuthContext';

interface Customer {
  id: number;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
  totalPoints: number;
  signupDate: string;
}

interface Transaction {
  date: string;
  type: string;
  points: string;
  description: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface CustomersProps {
  // No longer need auth prop - using context
}

export default function Customers({}: CustomersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [dateFilter, setDateFilter] = useState<'All' | 'Last 30 days' | 'Last 90 days' | 'Last year'>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showPointsAdjustment, setShowPointsAdjustment] = useState(false);
  const [pointsToAdjust, setPointsToAdjust] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');

  const customers: Customer[] = [
    { 
      id: 1, 
      name: 'John Smith', 
      email: 'john@example.com', 
      status: 'Active', 
      totalPoints: 1250, 
      signupDate: '2024-01-15' 
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      email: 'sarah@example.com', 
      status: 'Active', 
      totalPoints: 890, 
      signupDate: '2024-02-20' 
    },
    { 
      id: 3, 
      name: 'Mike Wilson', 
      email: 'mike@example.com', 
      status: 'Active', 
      totalPoints: 2100, 
      signupDate: '2024-01-08' 
    },
    { 
      id: 4, 
      name: 'Emily Davis', 
      email: 'emily@example.com', 
      status: 'Inactive', 
      totalPoints: 450, 
      signupDate: '2024-03-10' 
    },
  ];

  const transactions: Transaction[] = [
    {
      date: '2024-01-15',
      type: 'Signup Bonus',
      points: '+100',
      description: 'Welcome bonus for new account'
    },
    {
      date: '2024-01-20',
      type: 'Product Points',
      points: '+50',
      description: 'Purchase: Premium Coffee Beans'
    },
    {
      date: '2024-02-01',
      type: 'Cart Points',
      points: '+200',
      description: 'Cart total over $100'
    },
    {
      date: '2024-02-15',
      type: 'Redemption',
      points: '-100',
      description: 'Redeemed: $10 discount coupon'
    }
  ];

  // Enhanced client-side filtering
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      // Search filter
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'All' || customer.status === statusFilter;
      
      // Date filter
      let matchesDate = true;
      if (dateFilter !== 'All') {
        const signupDate = new Date(customer.signupDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - signupDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch (dateFilter) {
          case 'Last 30 days':
            matchesDate = diffDays <= 30;
            break;
          case 'Last 90 days':
            matchesDate = diffDays <= 90;
            break;
          case 'Last year':
            matchesDate = diffDays <= 365;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [customers, searchTerm, statusFilter, dateFilter]);

  const handlePointsAdjustment = () => {
    // Here you would typically make an API call to adjust points
    if (process.env.NODE_ENV === 'development') {
      console.log('Adjusting points:', {
        customer: selectedCustomer?.name,
        points: pointsToAdjust,
        reason: adjustmentReason
      });
    }
    
    // TODO: Implement API call to adjust customer points
    // router.post('/admin/customers/adjust-points', { 
    //   customer_id: selectedCustomer?.id, 
    //   points: pointsToAdjust, 
    //   reason: adjustmentReason 
    // });
    
    // Reset form and close modal
    setPointsToAdjust('');
    setAdjustmentReason('');
    setShowPointsAdjustment(false);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setDateFilter('All');
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'All' || dateFilter !== 'All';

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
            <p className="text-muted-foreground">
              Manage customer accounts and loyalty points
            </p>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search and Export Row */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search customers by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                Filters
                  {hasActiveFilters && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {[searchTerm, statusFilter, dateFilter].filter(f => f !== 'All' && f !== '').length}
                    </span>
                  )}
              </Button>
                
              <PermissionGate permission={PERMISSIONS.CUSTOMERS_EXPORT}>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </PermissionGate>
              </div>

              {/* Advanced Filters */}
              <Collapsible open={showFilters} className="space-y-4">
                <CollapsibleContent>
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Status Filter */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Active' | 'Inactive')}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="All">All Statuses</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>

                      {/* Date Filter */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Signup Date</label>
                        <select
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value as 'All' | 'Last 30 days' | 'Last 90 days' | 'Last year')}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="All">All Dates</option>
                          <option value="Last 30 days">Last 30 days</option>
                          <option value="Last 90 days">Last 90 days</option>
                          <option value="Last year">Last year</option>
                        </select>
                      </div>

                      {/* Clear Filters */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">&nbsp;</label>
                        <Button 
                          variant="outline" 
                          onClick={clearFilters}
                          className="w-full"
                          disabled={!hasActiveFilters}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Clear Filters
              </Button>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CardContent>
        </Card>

        {/* Customer List */}
        <Card>
          <CardHeader>
            <CardTitle>Customer List ({filteredCustomers.length})</CardTitle>
            {hasActiveFilters && (
              <CardDescription className="text-blue-600">
                Showing {filteredCustomers.length} of {customers.length} customers
            </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Name</th>
                    <th className="text-left p-3 font-medium">Email</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Total Points</th>
                    <th className="text-left p-3 font-medium">Signup Date</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        <div className="font-medium">{customer.name}</div>
                      </td>
                      <td className="p-3 text-muted-foreground">{customer.email}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-medium text-blue-600">{customer.totalPoints.toLocaleString()}</span>
                      </td>
                      <td className="p-3 text-muted-foreground">{customer.signupDate}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {/* Eye icon - Transaction History */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedCustomer(customer)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Transaction History - {customer.name}</DialogTitle>
                              </DialogHeader>
                              
                              {/* Customer Summary */}
                              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="text-lg font-semibold text-blue-900">{customer.name}</h3>
                                    <p className="text-blue-700">{customer.email}</p>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-blue-900">{customer.totalPoints}</div>
                                    <div className="text-sm text-blue-700">Total Points</div>
                                  </div>
                                </div>
                              </div>

                              {/* Transactions Table */}
                              <div className="space-y-3">
                                <h4 className="font-medium">Recent Transactions</h4>
                                <div className="space-y-2">
                                  {transactions.map((transaction, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium">{transaction.date}</span>
                                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-700">
                                            {transaction.type}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{transaction.description}</p>
                                      </div>
                                      <span className={`font-medium ${
                                        transaction.points.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                      }`}>
                                        {transaction.points}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {/* Arrow icon - Manual Points Adjustment */}
                          <Dialog open={showPointsAdjustment} onOpenChange={setShowPointsAdjustment}>
                            <PermissionGate permission={PERMISSIONS.CUSTOMERS_ADJUST_POINTS}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedCustomer(customer);
                                    setShowPointsAdjustment(true);
                                  }}
                                >
                                  <TrendingUp className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                            </PermissionGate>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Manual Points Adjustment</DialogTitle>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-sm text-gray-600">Customer: {customer.name}</p>
                                  <p className="text-sm text-gray-600">Current Points: {customer.totalPoints}</p>
                                </div>
                                
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Points to Add/Subtract</label>
                                  <Input
                                    placeholder="Enter points (use negative for subtraction)"
                                    value={pointsToAdjust}
                                    onChange={(e) => setPointsToAdjust(e.target.value)}
                                    type="number"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Reason for Adjustment</label>
                                  <Input
                                    placeholder="Enter reason for this adjustment"
                                    value={adjustmentReason}
                                    onChange={(e) => setAdjustmentReason(e.target.value)}
                                  />
                                </div>
                                
                                <div className="flex justify-end gap-3 pt-4">
                                  <Button 
                                    variant="outline" 
                                    onClick={() => setShowPointsAdjustment(false)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button onClick={handlePointsAdjustment}>
                                    Apply Adjustment
                        </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
