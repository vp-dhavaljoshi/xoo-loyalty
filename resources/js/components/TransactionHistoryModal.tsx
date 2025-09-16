import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDateTime } from '@/lib/dateUtils';

interface Transaction {
  id: number;
  transaction_type: string;
  transaction_type_label: string;
  transaction_type_color: string;
  description: string;
  points: number;
  formatted_points: string;
  points_color: string;
  points_balance_after: number;
  formatted_date: string;
  formatted_date_time: string;
  created_at: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  totalPoints: number;
}

interface TransactionHistoryModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onCustomerUpdate?: (updatedCustomer: Customer) => void;
}

export default function TransactionHistoryModal({ 
  customer, 
  isOpen, 
  onClose,
  onCustomerUpdate
}: TransactionHistoryModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdjustmentForm, setShowAdjustmentForm] = useState(false);
  const [adjustmentPoints, setAdjustmentPoints] = useState('');
  const [adjustmentDescription, setAdjustmentDescription] = useState('');
  const [adjustmentLoading, setAdjustmentLoading] = useState(false);
  const [currentCustomerPoints, setCurrentCustomerPoints] = useState(0);
  const { toast } = useToast();

  const loadTransactions = async () => {
    if (!customer) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/admin/api/transactions/user/${customer.id}/history?limit=20`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        credentials: 'same-origin',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const result = await response.json();
      
      if (result.status) {
        setTransactions(result.data);
        
        // Update current customer points from the latest transaction
        if (result.data.length > 0) {
          const latestTransaction = result.data[0];
          setCurrentCustomerPoints(latestTransaction.points_balance_after);
          
          // Update parent component with new points
          if (onCustomerUpdate && customer) {
            onCustomerUpdate({
              ...customer,
              totalPoints: latestTransaction.points_balance_after
            });
          }
        } else {
          // If no transactions, use the customer's current points
          setCurrentCustomerPoints(customer.totalPoints);
        }
      } else {
        throw new Error(result.message || 'Failed to load transactions');
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transaction history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && customer) {
      // Initialize current customer points
      setCurrentCustomerPoints(customer.totalPoints);
      loadTransactions();
    }
  }, [isOpen, customer]);


  const handleManualAdjustment = async () => {
    if (!customer || !adjustmentPoints || !adjustmentDescription.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both points and description fields.",
        variant: "destructive",
      });
      return;
    }

    const points = parseInt(adjustmentPoints);
    if (isNaN(points) || points === 0) {
      toast({
        title: "Error",
        description: "Please enter a valid number of points (positive or negative).",
        variant: "destructive",
      });
      return;
    }

    setAdjustmentLoading(true);
    try {
      const response = await fetch('/admin/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          user_id: customer.id,
          transaction_type: 'adjustment',
          description: adjustmentDescription.trim(),
          points: points,
          reference_type: 'manual',
          metadata: {
            adjusted_by: 'admin',
            adjustment_reason: adjustmentDescription.trim(),
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create adjustment');
      }

      const result = await response.json();
      
      if (result.status) {
        toast({
          title: "Success",
          description: `Points ${points > 0 ? 'added' : 'removed'} successfully.`,
        });
        
        // Reset form
        setAdjustmentPoints('');
        setAdjustmentDescription('');
        setShowAdjustmentForm(false);
        
        // Reload transactions and update points
        await loadTransactions();
      } else {
        throw new Error(result.message || 'Failed to create adjustment');
      }
    } catch (error) {
      console.error('Error creating adjustment:', error);
      toast({
        title: "Error",
        description: "Failed to adjust points. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAdjustmentLoading(false);
    }
  };

  const resetAdjustmentForm = () => {
    setAdjustmentPoints('');
    setAdjustmentDescription('');
    setShowAdjustmentForm(false);
  };

  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetAdjustmentForm();
      }
      onClose();
    }}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Transaction History - {customer.name}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdjustmentForm(!showAdjustmentForm)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Adjust Points</span>
              </Button>
              {/* Refresh button temporarily hidden */}
              {/* <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="ml-2">Refresh</span>
              </Button> */}
            </div>
          </div>
        </DialogHeader>

        {/* Customer Summary */}
        <div className="bg-blue-50 p-4 rounded-lg mb-4 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">{customer.name}</h3>
              <p className="text-blue-700">{customer.email}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">{(currentCustomerPoints || customer.totalPoints).toLocaleString()}</div>
              <div className="text-sm text-blue-700">Total Points</div>
            </div>
          </div>
        </div>

        {/* Manual Points Adjustment Form */}
        {showAdjustmentForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4 flex-shrink-0 border">
            <h4 className="font-medium text-sm text-gray-700 mb-3">Manual Points Adjustment</h4>
            
            {/* Customer Information */}
            <div className="bg-white p-3 rounded-lg mb-4 border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">Customer: {customer.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    Current Points: {currentCustomerPoints || customer.totalPoints}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Points to Add/Subtract</label>
                <Input
                  type="number"
                  placeholder="Enter points (use negative for removal)"
                  value={adjustmentPoints}
                  onChange={(e) => setAdjustmentPoints(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Use positive numbers to add points, negative to remove
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Reason for Adjustment</label>
                <Textarea
                  placeholder="Enter reason for this adjustment"
                  value={adjustmentDescription}
                  onChange={(e) => setAdjustmentDescription(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={resetAdjustmentForm}
                disabled={adjustmentLoading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleManualAdjustment}
                disabled={adjustmentLoading || !adjustmentPoints || !adjustmentDescription.trim()}
              >
                {adjustmentLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  'Apply Adjustment'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading transactions...</span>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Recent Transactions</h4>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-sm text-gray-700">Date & Time</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-gray-700">Points</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-gray-700">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-sm text-gray-900 font-medium">
                          {transaction.formatted_date_time || transaction.formatted_date}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${transaction.transaction_type_color}`}>
                            {transaction.transaction_type_label}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`font-semibold text-sm ${transaction.points_color}`}>
                            {transaction.formatted_points}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {transaction.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 pt-4 border-t">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Showing {transactions.length} recent transactions</span>
            <span>Last updated: {formatDateTime(new Date())}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
