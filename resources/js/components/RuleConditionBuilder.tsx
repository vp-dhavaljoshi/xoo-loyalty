import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Zap } from 'lucide-react';

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
  connector?: 'AND' | 'OR';
}

interface RuleConditionBuilderProps {
  conditions: Condition[];
  onConditionsChange: (conditions: Condition[]) => void;
}

const CONDITION_FIELDS = [
  { value: 'cart_total', label: 'Cart Total', type: 'number' },
  { value: 'product_category', label: 'Product Category', type: 'text' },
  { value: 'product_tag', label: 'Product Tag', type: 'text' },
  { value: 'purchase_count', label: 'Purchase Count', type: 'number' },
  { value: 'total_spent', label: 'Total Spent', type: 'number' },
  { value: 'days_since_signup', label: 'Days Since Signup', type: 'number' },
  { value: 'days_since_last_purchase', label: 'Days Since Last Purchase', type: 'number' },
  { value: 'store_location', label: 'Store Location', type: 'text' },
  { value: 'time_of_day', label: 'Time of Day', type: 'time' },
  { value: 'day_of_week', label: 'Day of Week', type: 'select' }
];

const OPERATORS_BY_TYPE = {
  number: [
    { value: 'equals', label: 'Equals (=)' },
    { value: 'greater_than', label: 'Greater Than (>)' },
    { value: 'less_than', label: 'Less Than (<)' },
    { value: 'greater_equal', label: 'Greater Than or Equal (>=)' },
    { value: 'less_equal', label: 'Less Than or Equal (<=)' },
    { value: 'between', label: 'Between' }
  ],
  text: [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'starts_with', label: 'Starts With' },
    { value: 'ends_with', label: 'Ends With' },
    { value: 'not_equals', label: 'Not Equals' }
  ],
  select: [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'in', label: 'Is One Of' }
  ],
  time: [
    { value: 'equals', label: 'Equals' },
    { value: 'after', label: 'After' },
    { value: 'before', label: 'Before' },
    { value: 'between', label: 'Between' }
  ]
};

const VALUE_OPTIONS = {
  day_of_week: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
};

export const RuleConditionBuilder: React.FC<RuleConditionBuilderProps> = ({
  conditions,
  onConditionsChange
}) => {
  const [newCondition, setNewCondition] = useState<Partial<Condition>>({
    field: '',
    operator: '',
    value: ''
  });

  const addCondition = () => {
    if (newCondition.field && newCondition.operator && newCondition.value) {
      const condition: Condition = {
        id: Date.now().toString(),
        field: newCondition.field,
        operator: newCondition.operator,
        value: newCondition.value,
        connector: conditions.length > 0 ? 'AND' : undefined
      };
      
      onConditionsChange([...conditions, condition]);
      setNewCondition({ field: '', operator: '', value: '' });
    }
  };

  const removeCondition = (id: string) => {
    onConditionsChange(conditions.filter(c => c.id !== id));
  };

  const updateConnector = (id: string, connector: 'AND' | 'OR') => {
    onConditionsChange(
      conditions.map(c => c.id === id ? { ...c, connector } : c)
    );
  };

  const getFieldType = (fieldValue: string) => {
    return CONDITION_FIELDS.find(f => f.value === fieldValue)?.type || 'text';
  };

  const getAvailableOperators = (fieldValue: string) => {
    const fieldType = getFieldType(fieldValue);
    return OPERATORS_BY_TYPE[fieldType as keyof typeof OPERATORS_BY_TYPE] || OPERATORS_BY_TYPE.text;
  };

  const renderValueInput = (field: string, operator: string, value: string, onChange: (value: string) => void) => {
    const fieldType = getFieldType(field);
    const valueOptions = VALUE_OPTIONS[field as keyof typeof VALUE_OPTIONS];

    if (valueOptions) {
      return (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            {valueOptions.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (operator === 'between') {
      const [min, max] = value.split('-');
      return (
        <div className="flex items-center gap-2">
          <Input
            type={fieldType === 'number' ? 'number' : 'text'}
            placeholder="Min"
            value={min || ''}
            onChange={(e) => onChange(`${e.target.value}-${max || ''}`)}
            className="w-20"
          />
          <span className="text-muted-foreground">to</span>
          <Input
            type={fieldType === 'number' ? 'number' : 'text'}
            placeholder="Max"
            value={max || ''}
            onChange={(e) => onChange(`${min || ''}-${e.target.value}`)}
            className="w-20"
          />
        </div>
      );
    }

    return (
      <Input
        type={fieldType === 'number' ? 'number' : fieldType === 'time' ? 'time' : 'text'}
        placeholder="Enter value"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-40"
      />
    );
  };

  const formatConditionText = (condition: Condition) => {
    const field = CONDITION_FIELDS.find(f => f.value === condition.field)?.label || condition.field;
    const operator = getAvailableOperators(condition.field).find(o => o.value === condition.operator)?.label || condition.operator;
    return `${field} ${operator} ${condition.value}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Rule Conditions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Conditions */}
        {conditions.length > 0 && (
          <div className="space-y-3">
            {conditions.map((condition, index) => (
              <div key={condition.id} className="space-y-2">
                {index > 0 && condition.connector && (
                  <div className="flex items-center justify-center">
                    <div className="flex bg-muted rounded-md p-1">
                      <Button
                        type="button"
                        variant={condition.connector === 'AND' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => updateConnector(condition.id, 'AND')}
                      >
                        AND
                      </Button>
                      <Button
                        type="button"
                        variant={condition.connector === 'OR' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => updateConnector(condition.id, 'OR')}
                      >
                        OR
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30">
                  <Badge variant="outline" className="flex-1">
                    {formatConditionText(condition)}
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCondition(condition.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add New Condition */}
        <div className="space-y-3 p-4 border-2 border-dashed border-muted rounded-lg">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Plus className="h-4 w-4" />
            Add Condition
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div>
              <Label>Field</Label>
              <Select
                value={newCondition.field}
                onValueChange={(value) => setNewCondition({
                  ...newCondition,
                  field: value,
                  operator: 'equals',
                  value: ''
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_FIELDS.map(field => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Operator</Label>
              <Select
                value={newCondition.operator}
                onValueChange={(value) => setNewCondition({
                  ...newCondition,
                  operator: value,
                  value: ''
                })}
                disabled={!newCondition.field}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  {newCondition.field && getAvailableOperators(newCondition.field).map(op => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Value</Label>
              {newCondition.field && newCondition.operator ? (
                renderValueInput(
                  newCondition.field,
                  newCondition.operator,
                  newCondition.value || '',
                  (value) => setNewCondition({ ...newCondition, value })
                )
              ) : (
                <Input placeholder="Enter value" disabled />
              )}
            </div>
          </div>

          <Button
            type="button"
            onClick={addCondition}
            disabled={!newCondition.field || !newCondition.operator || !newCondition.value}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Condition
          </Button>
        </div>

        {conditions.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            No conditions added yet. Add your first condition above.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
