import React, { useState } from 'react';
import { AdminLayout } from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Settings as SettingsIcon, 
  Shield, 
  DollarSign, 
  Gift, 
  Save,
  Users,
  Coins,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    // Module Configuration
    loyaltyModuleEnabled: true,
    
    // Fraud Detection
    fraudDetectionEnabled: true,
    requireOrderCompletion: true,
    timeBasedFreeze: true,
    freezeDurationHours: 24,
    newCustomerFreeze: true,
    customerAgeThresholdDays: 7,
    releaseOnOrderCompletion: true,
    
    // Points & Currency
    pointToCurrencyRate: 0.01,
    currency: 'USD',
    
    // Signup Rewards
    signupBonusPoints: 100
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Show success message or handle response
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Global Settings</h1>
            <p className="text-muted-foreground">
              Configure your loyalty program settings
            </p>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Module Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Module Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Enable Loyalty Module</h3>
                <p className="text-sm text-muted-foreground">
                  Turn the entire loyalty program on or off
                </p>
              </div>
              <Switch
                checked={settings.loyaltyModuleEnabled}
                onCheckedChange={(checked) => updateSetting('loyaltyModuleEnabled', checked)}
                className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300"
              />
            </div>
          </CardContent>
        </Card>

        {/* Fraud Detection & Point Freezing */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Fraud Detection & Point Freezing
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Enable Fraud Detection */}
            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-medium text-gray-900">Enable Fraud Detection</h3>
                <p className="text-sm text-gray-500">
                  Automatically freeze suspicious reward points until verification
                </p>
              </div>
              <Switch
                checked={settings.fraudDetectionEnabled}
                onCheckedChange={(checked) => updateSetting('fraudDetectionEnabled', checked)}
              />
            </div>

            {/* Conditional content when fraud detection is enabled */}
            {settings.fraudDetectionEnabled && (
              <>
                {/* Freeze Triggers */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <h3 className="font-medium text-gray-900">Freeze Triggers</h3>
                  </div>
                  
                  {/* Require Order Completion */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Require Order Completion</h4>
                        <p className="text-sm text-gray-500">
                          Freeze points until the related order is completed/shipped
                        </p>
                      </div>
                      <Switch
                        checked={settings.requireOrderCompletion}
                        onCheckedChange={(checked) => updateSetting('requireOrderCompletion', checked)}
                      />
                    </div>
                  </div>

                  {/* Time-based Freeze */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Time-based Freeze</h4>
                          <p className="text-sm text-gray-500">
                            Freeze points for a specific duration after earning
                          </p>
                        </div>
                        <Switch
                          checked={settings.timeBasedFreeze}
                          onCheckedChange={(checked) => updateSetting('timeBasedFreeze', checked)}
                        />
                      </div>
                      {settings.timeBasedFreeze && (
                        <div className="ml-0 space-y-2 border-gray-100">
                          <div className="flex items-center gap-4">
                            <Label htmlFor="freezeDuration" className="text-sm font-medium text-gray-700">
                              Freeze Duration (hours)
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="freezeDuration"
                                type="number"
                                value={settings.freezeDurationHours}
                                onChange={(e) => updateSetting('freezeDurationHours', parseInt(e.target.value) || 0)}
                                className="w-16 h-8"
                                min="1"
                              />
                              <Button variant="outline" size="sm" className="h-8 text-xs">
                                {settings.freezeDurationHours === 24 ? '1 day' : 
                                 settings.freezeDurationHours > 24 ? `${Math.round(settings.freezeDurationHours / 24)} days` : 
                                 `${settings.freezeDurationHours}h`}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* New Customer Freeze */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">New Customer Freeze</h4>
                          <p className="text-sm text-gray-500">
                            Freeze points for recently registered customers
                          </p>
                        </div>
                        <Switch
                          checked={settings.newCustomerFreeze}
                          onCheckedChange={(checked) => updateSetting('newCustomerFreeze', checked)}
                        />
                      </div>
                      {settings.newCustomerFreeze && (
                        <div className="ml-0 border-gray-100">
                          <div className="flex items-center gap-4">
                            <Label htmlFor="customerAgeThreshold" className="text-sm font-medium text-gray-700">
                              Customer Age Threshold (days)
                            </Label>
                            <Input
                              id="customerAgeThreshold"
                              type="number"
                              value={settings.customerAgeThresholdDays}
                              onChange={(e) => updateSetting('customerAgeThresholdDays', parseInt(e.target.value) || 0)}
                              className="w-16 h-8"
                              min="1"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>


                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Points & Currency */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Points & Currency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Point to Currency Rate</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm">1 Point =</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={settings.pointToCurrencyRate}
                      onChange={(e) => updateSetting('pointToCurrencyRate', parseFloat(e.target.value))}
                      className="w-20"
                    />
                  </div>
                  <span className="text-sm">{settings.currency}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  How much each loyalty point is worth in dollars
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signup Rewards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Signup Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Signup Bonus Points</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    type="number"
                    value={settings.signupBonusPoints}
                    onChange={(e) => updateSetting('signupBonusPoints', parseInt(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm">points</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Points awarded when a customer creates a new account
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Current Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Members */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Total Members</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">1,234</div>
              </div>

              {/* Points Issued */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Points Issued</span>
                </div>
                <div className="text-2xl font-bold text-green-900">45,678</div>
              </div>

              {/* Frozen Points */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Frozen Points</span>
                </div>
                <div className="text-2xl font-bold text-orange-900">1,856</div>
                <div className="text-xs text-orange-700 mt-1">
                  {settings.fraudDetectionEnabled ? '(Fraud Detection Active)' : '(Fraud Detection Inactive)'}
                </div>
              </div>

              {/* Total Value */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Total Value</span>
                </div>
                <div className="text-2xl font-bold text-purple-900">
                  ${(45678 * settings.pointToCurrencyRate).toFixed(2)}
                </div>
                <div className="text-xs text-purple-700 mt-1">
                  (Based on current rate: ${settings.pointToCurrencyRate}/point)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
