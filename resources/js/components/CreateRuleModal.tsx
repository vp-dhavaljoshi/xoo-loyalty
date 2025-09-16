import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, AlertTriangle, Calendar } from 'lucide-react';

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
  connector?: 'AND' | 'OR';
}

interface Rule {
  id?: number;
  name: string;
  description: string;
  pointsEarned: number;
  priority: number;
  rewardMultiplier: number;
  active: boolean;
  conditions: Condition[];
  isLifetime?: boolean;
  maxApplications?: number;
  cooldownPeriod?: number;
}

interface CreateRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rule: Omit<Rule, 'id'>) => Promise<void>;
  isLoading?: boolean;
}

export const CreateRuleModal: React.FC<CreateRuleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Partial<Rule>>({
    name: '',
    description: '',
    pointsEarned: 0,
    priority: 50,
    rewardMultiplier: 1,
    active: true,
    conditions: [],
    isLifetime: true,
    maxApplications: undefined,
    cooldownPeriod: undefined
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.name?.trim()) {
      newErrors.push('Rule name is required');
    }

    if (conditions.length === 0) {
      newErrors.push('At least one condition is required');
    }

    if ((formData.pointsEarned || 0) < 0) {
      newErrors.push('Points earned cannot be negative');
    }

    if ((formData.priority || 0) < 0 || (formData.priority || 0) > 100) {
      newErrors.push('Priority must be between 0 and 100');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const ruleData = {
      name: formData.name!,
      description: formData.description || '',
      pointsEarned: formData.pointsEarned || 0,
      priority: formData.priority || 50,
      rewardMultiplier: formData.rewardMultiplier || 1,
      active: formData.active !== false,
      conditions: conditions,
      isLifetime: formData.isLifetime !== false,
      maxApplications: formData.maxApplications,
      cooldownPeriod: formData.cooldownPeriod
    };

    await onSubmit(ruleData);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      pointsEarned: 0,
      priority: 50,
      rewardMultiplier: 1,
      active: true,
      conditions: [],
      isLifetime: true,
      maxApplications: undefined,
      cooldownPeriod: undefined
    });
    setConditions([]);
    setErrors([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Rule</DialogTitle>
          <DialogDescription>
            Define a new loyalty program rule with conditions and rewards.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Rule Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Enter rule name"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Describe what this rule does"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Rule Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Rule Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div>
                  <Label>Field</Label>
                  <Select
                    value={conditions[0]?.field || ''}
                    onValueChange={(value) => {
                      const newConditions = [...conditions];
                      if (newConditions.length === 0) {
                        newConditions.push({ id: '1', field: value, operator: 'equals', value: '' });
                      } else {
                        newConditions[0] = { ...newConditions[0], field: value, operator: 'equals', value: '' };
                      }
                      setConditions(newConditions);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cart_total">Cart Total</SelectItem>
                      <SelectItem value="product_category">Product Category</SelectItem>
                      <SelectItem value="product_tag">Product Tag</SelectItem>
                      <SelectItem value="purchase_count">Purchase Count</SelectItem>
                      <SelectItem value="total_spent">Total Spent</SelectItem>
                      <SelectItem value="days_since_signup">Days Since Signup</SelectItem>
                      <SelectItem value="days_since_last_purchase">Days Since Last Purchase</SelectItem>
                      <SelectItem value="store_location">Store Location</SelectItem>
                      <SelectItem value="time_of_day">Time of Day</SelectItem>
                      <SelectItem value="day_of_week">Day of Week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Operator</Label>
                  <Select
                    value={conditions[0]?.operator || ''}
                    onValueChange={(value) => {
                      const newConditions = [...conditions];
                      if (newConditions.length > 0) {
                        newConditions[0] = { ...newConditions[0], operator: value };
                        setConditions(newConditions);
                      }
                    }}
                    disabled={!conditions[0]?.field}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals (=)</SelectItem>
                      <SelectItem value="greater_than">Greater Than (&gt;)</SelectItem>
                      <SelectItem value="less_than">Less Than (&lt;)</SelectItem>
                      <SelectItem value="greater_equal">Greater Than or Equal (&gt;=)</SelectItem>
                      <SelectItem value="less_equal">Less Than or Equal (&lt;=)</SelectItem>
                      <SelectItem value="between">Between</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Value</Label>
                  <Input
                    placeholder="Enter value"
                    value={conditions[0]?.value || ''}
                    onChange={(e) => {
                      const newConditions = [...conditions];
                      if (newConditions.length > 0) {
                        newConditions[0] = { ...newConditions[0], value: e.target.value };
                        setConditions(newConditions);
                      }
                    }}
                    disabled={!conditions[0]?.field || !conditions[0]?.operator}
                  />
                </div>
              </div>

              {conditions.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  No conditions added yet. Add your first condition above.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rule Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Rule Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="points">Base Points Earned *</Label>
                  <Input
                    id="points"
                    type="number"
                    value={formData.pointsEarned || 0}
                    onChange={(e) => updateFormData('pointsEarned', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority (0-100)</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={formData.priority || 50}
                    onChange={(e) => updateFormData('priority', parseInt(e.target.value) || 50)}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="multiplier">Reward Multiplier</Label>
                  <Select
                    value={(formData.rewardMultiplier || 1).toString()}
                    onValueChange={(value) => updateFormData('rewardMultiplier', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1X (Normal)</SelectItem>
                      <SelectItem value="2">2X (Double)</SelectItem>
                      <SelectItem value="3">3X (Triple)</SelectItem>
                      <SelectItem value="5">5X (Quintuple)</SelectItem>
                      <SelectItem value="10">10X (Extreme)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active !== false}
                  onCheckedChange={(checked) => updateFormData('active', checked)}
                />
                <Label htmlFor="active">Rule Active</Label>
              </div>
            </CardContent>
          </Card>

          {/* Time Restrictions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Time Restrictions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="lifetime"
                  checked={formData.isLifetime !== false}
                  onCheckedChange={(checked) => updateFormData('isLifetime', checked)}
                />
                <Label htmlFor="lifetime">Lifetime Rule (No expiration)</Label>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxApplications">Max Applications per Customer</Label>
                  <Input
                    id="maxApplications"
                    type="number"
                    value={formData.maxApplications || ''}
                    onChange={(e) => updateFormData('maxApplications', parseInt(e.target.value) || undefined)}
                    placeholder="Unlimited"
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="cooldown">Cooldown Period (months)</Label>
                  <Input
                    id="cooldown"
                    type="number"
                    value={formData.cooldownPeriod || ''}
                    onChange={(e) => updateFormData('cooldownPeriod', parseInt(e.target.value) || undefined)}
                    placeholder="No cooldown"
                    min="1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Rule'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
