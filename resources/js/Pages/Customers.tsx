import  { useState,   useEffect } from 'react';
import { AdminLayout } from '@/Layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { 
  Search, 
  Download, 
  Eye, 
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { PermissionGate } from '@/components/PermissionGate';
import { PERMISSIONS } from '@/contexts/AuthContext';
import { usePaginatedApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import TransactionHistoryModal from '@/components/TransactionHistoryModal';

interface Customer {
  id: number;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
  totalPoints: number;
  signupDate: string;
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
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const { toast } = useToast();

  // API hooks
  const {
    data: customersData,
    loading: customersLoading,
    error: customersError,
    fetchData: fetchCustomers,
    goToPage,
    changePerPage,
  } = usePaginatedApi<Customer>('/admin/api/customers', {
    onSuccess: () => {
      // Data loaded successfully
    },
    onError: (error) => {
      console.error('API Error:', error);
      toast({
        title: "Error",
        description: "Failed to load customers. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleExportCsv = async () => {
    try {
      const filters = getCurrentFilters();
      const params = new URLSearchParams({
        search: filters.search,
        status: filters.status,
        date_filter: filters.date_filter,
        page: filters.page.toString(),
        per_page: filters.per_page.toString(),
        sort_by: filters.sort_by,
        sort_direction: filters.sort_direction,
      });
      const response = await fetch(`/admin/api/customers/export/csv?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'text/csv',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "CSV export completed successfully.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: "Failed to export CSV. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get current filters for API calls
  const getCurrentFilters = () => ({
    search: searchTerm,
    status: statusFilter,
    date_filter: dateFilter,
    page: currentPage,
    per_page: perPage,
    sort_by: sortBy,
    sort_direction: sortDirection,
  });

  // Initial load
  useEffect(() => {
    fetchCustomers(getCurrentFilters());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch customers when filters change (debounced for search)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCustomers(getCurrentFilters());
    }, searchTerm ? 300 : 0); // Only debounce search, not other filters

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, dateFilter, currentPage, perPage, sortBy, sortDirection]);

  const customers = customersData?.users || [];
  const pagination = customersData?.pagination;

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    goToPage(page, getCurrentFilters());
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
    changePerPage(newPerPage, getCurrentFilters());
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column with default direction
      setSortBy(column);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 text-blue-600" />
      : <ArrowDown className="h-4 w-4 text-blue-600" />;
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setDateFilter('All');
    setCurrentPage(1);
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
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Customer Management</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage customer accounts and loyalty points
            </p>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              {/* Search and Export Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search customers by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
                
                <div className="flex items-center gap-2 sm:gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filters</span>
                    {hasActiveFilters && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {[searchTerm, statusFilter, dateFilter].filter(f => f !== 'All' && f !== '').length}
                      </span>
                    )}
                  </Button>
                  
                  <PermissionGate permission={PERMISSIONS.CUSTOMERS_EXPORT}>
                    <Button 
                      variant="outline" 
                      onClick={handleExportCsv}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Export CSV</span>
                    </Button>
                  </PermissionGate>
                </div>
              </div>

              {/* Advanced Filters */}
              <Collapsible open={showFilters} className="space-y-4">
                <CollapsibleContent>
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <div className="space-y-2 sm:col-span-2 lg:col-span-1">
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
            <CardTitle>
              Customer List 
              {pagination && (
                <span className="text-lg font-normal text-muted-foreground ml-2">
                  ({pagination.total})
                </span>
              )}
            </CardTitle>
            {pagination && hasActiveFilters && (
              <CardDescription className="text-blue-600">
                Showing {pagination.from}-{pagination.to} of {pagination.total} customers
              </CardDescription>
            )}
            {pagination && !hasActiveFilters && (
              <CardDescription>
                Showing {pagination.from}-{pagination.to} of {pagination.total} customers
            </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {customersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading customers...</span>
              </div>
            ) : customersError ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{customersError}</p>
                <Button onClick={() => fetchCustomers(getCurrentFilters())}>
                  Try Again
                </Button>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 sm:p-3 font-medium">
                        <button
                          onClick={() => handleSort('first_name')}
                          className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                        >
                          <span className="hidden sm:inline">Name</span>
                          <span className="sm:hidden">Customer</span>
                          {getSortIcon('first_name')}
                        </button>
                      </th>
                      <th className="text-left p-2 sm:p-3 font-medium hidden sm:table-cell">
                        <button
                          onClick={() => handleSort('email')}
                          className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                        >
                          Email
                          {getSortIcon('email')}
                        </button>
                      </th>
                      <th className="text-left p-2 sm:p-3 font-medium">Status</th>
                      <th className="text-left p-2 sm:p-3 font-medium">Points</th>
                      <th className="text-left p-2 sm:p-3 font-medium hidden md:table-cell">
                        <button
                          onClick={() => handleSort('created_at')}
                          className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                        >
                          <span className="hidden lg:inline">Signup Date</span>
                          <span className="lg:hidden">Date</span>
                          {getSortIcon('created_at')}
                        </button>
                      </th>
                      <th className="text-left p-2 sm:p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                <tbody>
                    {customers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-muted-foreground">
                          No customers found
                        </td>
                      </tr>
                    ) : (
                      customers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-muted/50">
                      <td className="p-2 sm:p-3">
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-xs text-muted-foreground sm:hidden">{customer.email}</div>
                      </td>
                      <td className="p-2 sm:p-3 text-muted-foreground hidden sm:table-cell">{customer.email}</td>
                      <td className="p-2 sm:p-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="p-2 sm:p-3">
                        <span className="font-medium text-blue-600">{customer.totalPoints.toLocaleString()}</span>
                      </td>
                      <td className="p-2 sm:p-3 text-muted-foreground hidden md:table-cell">{customer.signupDate}</td>
                      <td className="p-2 sm:p-3">
                        <div className="flex items-center gap-1 sm:gap-2">
                          {/* Eye icon - Transaction History */}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setShowTransactionHistory(true);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                      ))
                    )}
                </tbody>
              </table>
            </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-muted-foreground">
                    Rows per page:
                  </p>
                  <select
                    value={perPage}
                    onChange={(e) => handlePerPageChange(Number(e.target.value))}
                    className="h-9 w-16 rounded border border-input bg-background px-2 text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <p className="text-sm text-muted-foreground">
                    Page {pagination.current_page} of {pagination.last_page}
                  </p>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                      disabled={pagination.current_page <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                      let pageNum;
                      if (pagination.last_page <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.current_page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.current_page >= pagination.last_page - 2) {
                        pageNum = pagination.last_page - 4 + i;
                      } else {
                        pageNum = pagination.current_page - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === pagination.current_page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                      disabled={pagination.current_page >= pagination.last_page}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transaction History Modal */}
        <TransactionHistoryModal
          customer={selectedCustomer}
          isOpen={showTransactionHistory}
          onClose={() => {
            setShowTransactionHistory(false);
            setSelectedCustomer(null);
          }}
          onCustomerUpdate={(updatedCustomer) => {
            // Refresh the customer list to get updated points
            if (updatedCustomer) {
              fetchCustomers(getCurrentFilters());
            }
          }}
        />
      </div>
    </AdminLayout>
  );
}
